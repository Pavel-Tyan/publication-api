import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ description: 'Name of user', nullable: false })
    @IsString()
    name: string;
    @ApiProperty({ description: 'Surname of user', nullable: false })
    @IsString()
    surname: string;
    @ApiProperty({ description: 'User email', nullable: false })
    @IsEmail({}, { message: 'Некорректная почта' })
    email: string;
    @ApiProperty({ description: 'User password', nullable: false })
    @IsString()
    password: string;
}
