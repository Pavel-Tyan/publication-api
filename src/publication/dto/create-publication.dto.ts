import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePublicationDto {
    @ApiProperty({ description: 'Category of publication', nullable: false })
    @IsString()
    category: string;
    @ApiProperty({ description: 'Title of publication', nullable: false })
    @IsString()
    title: string;
    @ApiProperty({ description: 'Text of publication', nullable: false })
    @IsString()
    text: string;
    @ApiProperty({ description: 'User identifier', nullable: false })
    @IsString()
    userId: string;
}
