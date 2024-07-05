/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { UserDto } from './dto/user.dto';

@Controller('auth')
export class AuthController {
    @Post('register')
    async register(@Body() dto: UserDto) {}

    @HttpCode(200)
    @Post('login')
    async login(@Body() dto: UserDto) {}
}
