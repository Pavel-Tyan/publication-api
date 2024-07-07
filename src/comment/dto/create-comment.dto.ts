import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCommentDto {
    @ApiProperty({ description: 'Comment text', nullable: false })
    @IsString()
    text: string;
    @ApiProperty({ description: 'Specified id of user that created comment', nullable: false })
    @IsString()
    userId: string;
    @ApiProperty({ description: 'Specified id of publication comment was created for', nullable: false })
    @IsString()
    publicationId: string;
}
