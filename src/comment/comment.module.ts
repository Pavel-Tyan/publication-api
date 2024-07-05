import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentModel, CommentModelSchema } from './comment.model';

@Module({
    controllers: [CommentController],
    imports: [MongooseModule.forFeature([{ name: CommentModel.name, schema: CommentModelSchema }])],
    providers: [CommentService],
})
export class CommentModule {}
