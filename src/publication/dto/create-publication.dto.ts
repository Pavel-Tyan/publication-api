import { IsString } from 'class-validator';

export class CreatePublicationDto {
    @IsString()
    category: string;
    @IsString()
    title: string;
    @IsString()
    text: string;
    @IsString()
    userId: string;
}
