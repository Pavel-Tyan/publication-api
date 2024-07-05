import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type CommentModelDocument = HydratedDocument<CommentModel>;

@Schema()
export class CommentModel {
    @Prop()
    _id: string;
    @Prop()
    text: string;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users' })
    userId: Types.ObjectId;
    @Prop()
    date: Date;
}

export const CommentModelSchema = SchemaFactory.createForClass(CommentModel);
