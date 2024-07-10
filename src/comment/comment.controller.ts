import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { CommentModel } from './comment.model';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentService } from './comment.service';
import { COMMENT_NOT_FOUND } from './comment.constants';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Comments')
@Controller('comment')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @UsePipes(new ValidationPipe())
    @Post('create')
    @ApiOperation({ summary: 'Create a new comment' })
    async create(@Body() dto: CreateCommentDto): Promise<CommentModel> {
        return this.commentService.create(dto);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get('byPublication/:id')
    @ApiOperation({ summary: 'Get comments by specified identifier of publication' })
    @ApiParam({ name: 'id', required: true, description: 'Specified identifier of publication' })
    async getByPublication(@Param('id') id: string): Promise<CommentModel[]> {
        return this.commentService.findByPublicationId(id);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Delete(':id')
    @ApiOperation({ summary: 'Delete comments by specified identifier' })
    @ApiParam({ name: 'id', required: true, description: 'Specified identifier of comment' })
    async delete(@Param('id') id: string): Promise<void> {
        const deletedDoc = await this.commentService.delete(id);

        if (!deletedDoc) {
            throw new HttpException(COMMENT_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
    }
}
