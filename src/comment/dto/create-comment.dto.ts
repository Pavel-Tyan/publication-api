import { IsString } from 'class-validator';

export class CreateCommentDto {
    @IsString()
    text: string;
    @IsString()
    userId: string;
    @IsString()
    publicationId: string;
}
