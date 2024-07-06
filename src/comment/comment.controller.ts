import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { CommentModel } from './comment.model';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentService } from './comment.service';
import { REVIEW_NOT_FOUND } from './comment.constants';

@Controller('comment')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Post('create')
    async create(@Body() dto: CreateCommentDto): Promise<CommentModel> {
        return this.commentService.create(dto);
    }

    @Get('byPublication/:publicationId')
    async getByPublication(): Promise<CommentModel[]> {
        return this.commentService.findByPublicationId('publicationId');
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        const deletedDoc = await this.commentService.delete(id);

        if (!deletedDoc) {
            throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
    }
}
