import { IsString, IsEmail } from 'class-validator';

export class LoginUserDto {
    @IsEmail({}, { message: 'Некорректная почта' })
    email: string;
    @IsString()
    password: string;
}
