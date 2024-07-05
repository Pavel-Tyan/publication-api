/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { PublicationModel } from './publication.model';

@Controller('publication')
export class PublicationController {
    @Post('create')
    async create(@Body() dto: Omit<PublicationModel, '_id'>) {}
    @Get()
    async getAll() {}
    // @Delete(':id')
    // async delete(@Param('id') id: string) {}
    @Patch(':id')
    async delete(@Param('id') id: string, @Body() dto: PublicationModel) {}
}
