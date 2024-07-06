import { Injectable } from '@nestjs/common';
import { CommentModel, CommentModelDocument } from './comment.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
    constructor(@InjectModel(CommentModel.name) private commentModel: Model<CommentModelDocument>) {}

    async create(dto: CreateCommentDto): Promise<CommentModel> {
        return this.commentModel.create(dto);
    }

    async delete(id: string): Promise<CommentModel> | null {
        return this.commentModel.findByIdAndDelete(id).exec();
    }

    async findByPublicationId(publicationId: string): Promise<CommentModel[]> {
        return this.commentModel.find({ publicationId: publicationId }).exec();
    }

    async deleteByPublicationId(publicationId: string): Promise<void> {
        this.commentModel.deleteMany({ publicationId: publicationId }).exec();
    }
}
