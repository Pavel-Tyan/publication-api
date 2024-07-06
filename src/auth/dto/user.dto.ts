import { IsString } from 'class-validator';

export class UserDto {
    @IsString()
    name: string;
    @IsString()
    surname: string;
    @IsString()
    email: string;
    @IsString()
    password: string;
}
