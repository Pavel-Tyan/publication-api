/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CommentModel } from './comment.model';

@Controller('comment')
export class CommentController {
    @Post('create')
    async create(@Body() dto: Omit<CommentModel, '_id'>) {}

    @Get('byPublication/:publicationId')
    async getByPublication() {}

    // @Delete(':id')
    // async delete(@Param('id') id: string) {}

    @Patch(':id')
    async delete(@Param('id') id: string, @Body() dto: CommentModel) {}
}
