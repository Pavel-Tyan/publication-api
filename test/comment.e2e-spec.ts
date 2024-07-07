import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateCommentDto } from 'src/comment/dto/create-comment.dto';
import { disconnect, Types } from 'mongoose';
import { COMMENT_NOT_FOUND } from '../src/comment/comment.constants';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { LoginUserDto } from 'src/auth/dto/login-user.dto';

const userId = new Types.ObjectId().toHexString();
const publicationId = new Types.ObjectId().toHexString();

const testCommentDto: CreateCommentDto = {
    text: 'text',
    userId: userId,
    publicationId: publicationId,
};

const testRegisterDto: CreateUserDto = {
    name: 'name',
    surname: 'surname',
    email: 'qwmbasgfdgss@gmail.com',
    password: 'password',
};

const testLoginDto: LoginUserDto = {
    email: testRegisterDto.email,
    password: testRegisterDto.password,
};

describe('CommentController (e2e)', () => {
    let app: INestApplication;
    let createdId: string;

    let token: string;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
        await request(app.getHttpServer()).post('/auth/register').send(testRegisterDto);
        const { body } = await request(app.getHttpServer()).post('/auth/login').send(testLoginDto);
        token = body.access_token;
    });

    it('/comment/create (POST) - success', async () => {
        return request(app.getHttpServer())
            .post('/comment/create')
            .set('Authorization', 'Bearer ' + token)
            .send(testCommentDto)
            .expect(201)
            .then((req: request.Response) => {
                const body = req.body;
                createdId = body._id;
                expect(body._id).toBeDefined();
                expect(body.text).toEqual(testCommentDto.text);
                expect(body.userId).toEqual(testCommentDto.userId);
                expect(body.publicationId).toEqual(testCommentDto.publicationId);
                return;
            });
    });

    it('/comment/create (POST) - fail', async () => {
        return request(app.getHttpServer())
            .post('/comment/create')
            .set('Authorization', 'Bearer ' + token)
            .send({ ...testCommentDto, userId: true })
            .expect(400);
    });

    it('/comment/byPublication/:id (GET) - success', async () => {
        return request(app.getHttpServer())
            .get('/comment/byPublication/' + publicationId)
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .then((req: request.Response) => {
                const body = req.body;
                expect(body.length).toBe(1);
                return;
            });
    });

    it('/comment/byPublication/:id (GET) - fail', async () => {
        return request(app.getHttpServer())
            .get('/comment/byPublication/' + new Types.ObjectId().toHexString())
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .then((req: request.Response) => {
                const body = req.body;
                expect(body.length).toBe(0);
                return;
            });
    });

    it('/comment/:id (DELETE) - success', () => {
        return request(app.getHttpServer())
            .delete('/comment/' + createdId)
            .set('Authorization', 'Bearer ' + token)
            .expect(200);
    });

    it('/comment/:id (DELETE) - fail', () => {
        return request(app.getHttpServer())
            .delete('/comment/' + new Types.ObjectId().toHexString())
            .set('Authorization', 'Bearer ' + token)
            .expect(404, {
                statusCode: 404,
                message: COMMENT_NOT_FOUND,
            });
    });

    afterAll(async () => {
        await request(app.getHttpServer()).delete('/auth/' + testLoginDto.email);
        disconnect();
    });
});
