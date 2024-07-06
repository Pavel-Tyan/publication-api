import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateCommentDto } from 'src/comment/dto/create-comment.dto';
import { disconnect, Types } from 'mongoose';

const userId = new Types.ObjectId().toHexString();
const publicationId = new Types.ObjectId().toHexString();

const testDto: CreateCommentDto = {
    text: 'text',
    userId: userId,
    publicationId: publicationId,
};

describe('CommentController (e2e)', () => {
    let app: INestApplication;
    let createdId: string;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/comment/create (POST) - success', async () => {
        return request(app.getHttpServer())
            .post('/comment/create')
            .send(testDto)
            .expect(201)
            .then((req: request.Response) => {
                const body = req.body;
                createdId = body._id;
                expect(createdId).toBeDefined();
                expect(body.text).toEqual(testDto.text);
                expect(body.userId).toEqual(testDto.userId);
                expect(body.publicationId).toEqual(testDto.publicationId);
                return;
            });
    });

    it('/comment/:id (DELETE) - success', () => {
        return request(app.getHttpServer())
            .delete('/comment/' + createdId)
            .expect(200);
    });

    afterAll(() => {
        disconnect();
    });
});
