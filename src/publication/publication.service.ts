import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PublicationModel, PublicationModelDocument } from './publication.model';
import { Model } from 'mongoose';
import { CreatePublicationDto } from './dto/create-publication.dto';

@Injectable()
export class PublicationService {
    constructor(@InjectModel(PublicationModel.name) private publicationModel: Model<PublicationModelDocument>) {}

    async create(dto: CreatePublicationDto): Promise<PublicationModel> {
        return this.publicationModel.create(dto);
    }

    async updateById(id: string, dto: CreatePublicationDto): Promise<PublicationModel> {
        return this.publicationModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    }

    async delete(id: string): Promise<PublicationModel> | null {
        return this.publicationModel.findByIdAndDelete(id).exec();
    }

    async findAll(): Promise<PublicationModel[]> {
        return this.publicationModel.find().exec();
    }

    async findByUserId(userId: string): Promise<PublicationModel[]> {
        return this.publicationModel.find({ userId: userId }).exec();
    }
}
