import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { CommentModel } from './comment.model';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentService } from './comment.service';
import { COMMENT_NOT_FOUND } from './comment.constants';

@Controller('comment')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @UsePipes(new ValidationPipe())
    @Post('create')
    async create(@Body() dto: CreateCommentDto): Promise<CommentModel> {
        return this.commentService.create(dto);
    }

    @Get('byPublication/:id')
    async getByPublication(@Param('id') id: string): Promise<CommentModel[]> {
        return this.commentService.findByPublicationId(id);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        const deletedDoc = await this.commentService.delete(id);

        if (!deletedDoc) {
            throw new HttpException(COMMENT_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
    }
}
