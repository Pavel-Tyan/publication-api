import { IsString, IsEmail } from 'class-validator';

export class CreateUserDto {
    @IsString()
    name: string;
    @IsString()
    surname: string;
    @IsEmail({}, { message: 'Некорректная почта' })
    email: string;
    @IsString()
    password: string;
}
