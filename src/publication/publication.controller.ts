import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    NotFoundException,
    Param,
    Patch,
    Post,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { PublicationModel } from './publication.model';
import { PublicationService } from './publication.service';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { PUBLICATION_NOT_FOUND_ERROR } from './publication.constants';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('publication')
export class PublicationController {
    constructor(private readonly publicationService: PublicationService) {}

    @Post('create')
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    async create(@Body() dto: CreatePublicationDto): Promise<PublicationModel> {
        return this.publicationService.create(dto);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    async patch(@Param('id') id: string, @Body() dto: CreatePublicationDto): Promise<void> {
        const updatedProduct = await this.publicationService.updateById(id, dto);

        if (!updatedProduct) {
            throw new NotFoundException(PUBLICATION_NOT_FOUND_ERROR);
        }
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async delete(@Param('id') id: string): Promise<void> {
        const deletedPublication = await this.publicationService.delete(id);

        if (!deletedPublication) {
            throw new HttpException(PUBLICATION_NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
        }
    }

    @Get('findAll')
    @UseGuards(JwtAuthGuard)
    async findAll(): Promise<PublicationModel[]> {
        return this.publicationService.findAll();
    }

    @Get('findByUserId/:id')
    @UseGuards(JwtAuthGuard)
    async findByUserId(@Param('id') userId: string): Promise<PublicationModel[]> {
        return this.publicationService.findByUserId(userId);
    }
}
