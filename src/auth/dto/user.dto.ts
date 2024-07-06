import { IsString, IsEmail } from 'class-validator';

export class UserDto {
    @IsString()
    name: string;
    @IsString()
    surname: string;
    @IsEmail({}, { message: 'Некорректная почта' })
    email: string;
    @IsString()
    password: string;
}
