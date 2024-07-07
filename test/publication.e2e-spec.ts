import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { disconnect, Types } from 'mongoose';
import { CreateUserDto } from './../src/auth/dto/create-user.dto';
import { LoginUserDto } from './../src/auth/dto/login-user.dto';
import { CreatePublicationDto } from './../src/publication/dto/create-publication.dto';
import { PUBLICATION_NOT_FOUND_ERROR } from './../src/publication/publication.constants';

let testPublicationDto: CreatePublicationDto;

const testRegisterDto: CreateUserDto = {
    name: 'name',
    surname: 'surname',
    email: 'nvytqweghjsgss@gmail.com',
    password: 'password',
};

const testLoginDto: LoginUserDto = {
    email: testRegisterDto.email,
    password: testRegisterDto.password,
};

describe('PublicationController (e2e)', () => {
    let app: INestApplication;
    let createdId: string;

    let token: string;
    let userId: string;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
        await request(app.getHttpServer()).post('/auth/register').send(testRegisterDto);
        const { body } = await request(app.getHttpServer()).post('/auth/login').send(testLoginDto);
        token = body.access_token;

        const response = await request(app.getHttpServer()).get('/auth/' + token);
        userId = response.body._id;

        testPublicationDto = {
            category: 'Frontend',
            title: 'publication',
            text: 'text',
            userId: userId,
        };
    });

    it('/publication/create (POST) - success', async () => {
        return request(app.getHttpServer())
            .post('/publication/create')
            .set('Authorization', 'Bearer ' + token)
            .send(testPublicationDto)
            .expect(201)
            .then((req: request.Response) => {
                const body = req.body;
                createdId = body._id;
                expect(body._id).toBeDefined();
                expect(body.title).toEqual(testPublicationDto.title);
                expect(body.text).toEqual(testPublicationDto.text);
                expect(body.userId).toEqual(testPublicationDto.userId);
                return;
            });
    });

    it('/publication/create (POST) - fail', async () => {
        return request(app.getHttpServer())
            .post('/publication/create')
            .set('Authorization', 'Bearer ' + token)
            .send({ ...testPublicationDto, userId: true })
            .expect(400);
    });

    it('/publication/findByUserId/:id (GET) - success', async () => {
        return request(app.getHttpServer())
            .get('/publication/findByUserId/' + testPublicationDto.userId)
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .then((req: request.Response) => {
                const body = req.body;
                expect(body.length).toBe(1);
                return;
            });
    });

    it('/publication/findByUserId/:id (GET) - fail', async () => {
        return request(app.getHttpServer())
            .get('/publication/findByUserId/' + new Types.ObjectId().toHexString())
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .then((req: request.Response) => {
                const body = req.body;
                expect(body.length).toBe(0);
                return;
            });
    });

    it('/publication/:id (DELETE) - success', () => {
        return request(app.getHttpServer())
            .delete('/publication/' + createdId)
            .set('Authorization', 'Bearer ' + token)
            .expect(200);
    });

    it('/publication/:id (DELETE) - fail', () => {
        return request(app.getHttpServer())
            .delete('/publication/' + new Types.ObjectId().toHexString())
            .set('Authorization', 'Bearer ' + token)
            .expect(404, {
                statusCode: 404,
                message: PUBLICATION_NOT_FOUND_ERROR,
            });
    });

    afterAll(async () => {
        await request(app.getHttpServer()).delete('/auth/' + testLoginDto.email);
        disconnect();
    });
});
