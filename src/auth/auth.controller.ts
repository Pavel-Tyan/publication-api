import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpException,
    HttpStatus,
    Param,
    Post,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from './auth.service';
import { ALREADY_REGISTERED_ERROR, USER_NOT_FOUND_ERROR } from './auth.constants';
import { LoginUserDto } from './dto/login-user.dto';
import { UserModel } from './user.model';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get(':token')
    async getUser(@Param('token') token: string): Promise<UserModel> {
        return this.authService.getUser(token);
    }

    @UsePipes(new ValidationPipe())
    @Post('register')
    async register(@Body() dto: CreateUserDto) {
        const oldUser = await this.authService.findUser(dto.email);

        if (oldUser) {
            throw new BadRequestException(ALREADY_REGISTERED_ERROR);
        }

        return this.authService.createUser(dto);
    }

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Post('login')
    async login(@Body() { email, password }: LoginUserDto): Promise<{
        access_token: string;
    }> {
        const user = await this.authService.validateUser(email, password);
        return this.authService.login(user.email);
    }

    @Delete(':email')
    async delete(@Param('email') email: string): Promise<void> {
        const deletedUser = await this.authService.delete(email);

        if (!deletedUser) {
            throw new HttpException(USER_NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
        }
    }
}
