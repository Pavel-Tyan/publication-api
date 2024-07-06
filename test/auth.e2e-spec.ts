import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { disconnect } from 'mongoose';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { LoginUserDto } from 'src/auth/dto/login-user.dto';
import { USER_NOT_FOUND_ERROR } from '../src/auth/auth.constants';

const testRegisterDto: CreateUserDto = {
    name: 'name',
    surname: 'surname',
    email: 'aplzqwesdf@gmail.com',
    password: 'password',
};

const testLoginDto: LoginUserDto = {
    email: testRegisterDto.email,
    password: testRegisterDto.password,
};

describe('AuthController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/auth/register (POST) - success', async () => {
        return request(app.getHttpServer())
            .post('/auth/register')
            .send(testRegisterDto)
            .expect(201)
            .then((req: request.Response) => {
                const body = req.body;
                expect(body.name).toEqual(testRegisterDto.name);
                expect(body.surname).toEqual(testRegisterDto.surname);
                expect(body.email).toEqual(testRegisterDto.email);
                return;
            });
    });

    it('/auth/register (POST) - fail', async () => {
        return request(app.getHttpServer()).post('/auth/register').send(testRegisterDto).expect(400);
    });

    it('/auth/login (POST) - success', () => {
        return request(app.getHttpServer())
            .post('/auth/login')
            .send(testLoginDto)
            .expect(200)
            .then((req: request.Response) => {
                const body = req.body;
                expect(body.access_token).toBeDefined();
                return;
            });
    });

    it('/auth/login (POST) - fail', () => {
        return request(app.getHttpServer())
            .post('/auth/login')
            .send({ ...testLoginDto, password: testLoginDto.password + 'wrong' })
            .expect(401);
    });

    it('/auth/:email (DELETE) - success', () => {
        return request(app.getHttpServer())
            .delete('/auth/' + testLoginDto.email)
            .expect(200);
    });

    it('/auth/:email (DELETE) - fail', () => {
        return request(app.getHttpServer())
            .delete('/auth/' + 'wrong' + testLoginDto.email)
            .expect(404, {
                statusCode: 404,
                message: USER_NOT_FOUND_ERROR,
            });
    });

    afterAll(() => {
        disconnect();
    });
});
