import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';

export class LoginUserDto {
    @ApiProperty({ description: 'User email', nullable: false })
    @IsEmail({}, { message: 'Некорректная почта' })
    email: string;
    @ApiProperty({ description: 'User password', nullable: false })
    @IsString()
    password: string;
}
