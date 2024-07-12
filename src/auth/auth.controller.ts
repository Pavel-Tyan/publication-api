import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpException,
    HttpStatus,
    NotFoundException,
    Param,
    Patch,
    Post,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from './auth.service';
import { ALREADY_REGISTERED_ERROR, USER_NOT_FOUND_ERROR } from './auth.constants';
import { LoginUserDto } from './dto/login-user.dto';
import { UserModel } from './user.model';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get(':token')
    @ApiOperation({ summary: 'Get user by access token (JWT)' })
    @ApiParam({ name: 'token', required: true, description: 'Access token' })
    async getUser(@Param('token') token: string): Promise<UserModel> {
        return this.authService.getUser(token);
    }

    @Get('byId/:id')
    @ApiOperation({ summary: 'Get user by id' })
    @ApiParam({ name: 'id', required: true, description: 'user id' })
    async getUserById(@Param('id') id: string): Promise<UserModel> {
        return this.authService.findUserById(id);
    }

    @UsePipes(new ValidationPipe())
    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
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
    @ApiOperation({ summary: 'Login user' })
    async login(@Body() { email, password }: LoginUserDto): Promise<{
        access_token: string;
    }> {
        const user = await this.authService.validateUser(email, password);
        return this.authService.login(user.email);
    }

    @Patch(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Updates a user with specified id' })
    @ApiParam({ name: 'id', required: true, description: 'User identifier' })
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    async patch(@Param('id') id: string, @Body() dto: CreateUserDto): Promise<void> {
        const updatedUser = await this.authService.updateById(id, dto);

        if (!updatedUser) {
            throw new NotFoundException(USER_NOT_FOUND_ERROR);
        }
    }

    @Delete(':email')
    @ApiOperation({ summary: 'Delete user by specified email' })
    @ApiParam({ name: 'email', required: true, description: 'Access token' })
    async delete(@Param('email') email: string): Promise<void> {
        const deletedUser = await this.authService.delete(email);

        if (!deletedUser) {
            throw new HttpException(USER_NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
        }
    }
}
