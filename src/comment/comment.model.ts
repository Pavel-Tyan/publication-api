import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type CommentModelDocument = HydratedDocument<CommentModel>;

@Schema({ timestamps: true, id: true })
export class CommentModel {
    @Prop()
    text: string;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users' })
    userId: Types.ObjectId;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Publications' })
    publicationId: Types.ObjectId;
}

export const CommentModelSchema = SchemaFactory.createForClass(CommentModel);
