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
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Publications')
@Controller('publication')
export class PublicationController {
    constructor(private readonly publicationService: PublicationService) {}

    @Post('create')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Post a new publication' })
    @ApiParam({ name: 'noteId', required: true, description: 'Note identifier' })
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    async create(@Body() dto: CreatePublicationDto): Promise<PublicationModel> {
        return this.publicationService.create(dto);
    }

    @Patch(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Updates a publication with specified id' })
    @ApiParam({ name: 'id', required: true, description: 'Publication identifier' })
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    async patch(@Param('id') id: string, @Body() dto: CreatePublicationDto): Promise<void> {
        const updatedProduct = await this.publicationService.updateById(id, dto);

        if (!updatedProduct) {
            throw new NotFoundException(PUBLICATION_NOT_FOUND_ERROR);
        }
    }

    @Delete(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Deletes a publication with specified id' })
    @ApiParam({ name: 'id', required: true, description: 'Publication identifier' })
    @UseGuards(JwtAuthGuard)
    async delete(@Param('id') id: string): Promise<void> {
        const deletedPublication = await this.publicationService.delete(id);

        if (!deletedPublication) {
            throw new HttpException(PUBLICATION_NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
        }
    }

    @Get('findAll')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Gets all publications' })
    @UseGuards(JwtAuthGuard)
    async findAll(): Promise<PublicationModel[]> {
        return this.publicationService.findAll();
    }

    @Get('findByUserId/:id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Gets all publications with specified id' })
    @ApiParam({ name: 'id', required: true, description: 'User identifier' })
    @UseGuards(JwtAuthGuard)
    async findByUserId(@Param('id') userId: string): Promise<PublicationModel[]> {
        return this.publicationService.findByUserId(userId);
    }
}
