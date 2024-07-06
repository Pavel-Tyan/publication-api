import { IsString } from 'class-validator';

export class CreateCommentDto {
    @IsString()
    category: string;
    @IsString()
    title: string;
    @IsString()
    text: string;
    @IsString()
    userId: string;
}
