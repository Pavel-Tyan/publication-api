import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type PublicationModelDocument = HydratedDocument<PublicationModel>;
@Schema()
export class PublicationModel {
    @Prop()
    _id: string;
    @Prop()
    category: string;
    @Prop()
    title: string;
    @Prop()
    date: Date;
    @Prop()
    text: string;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users' })
    userId: Types.ObjectId;
}

export const PublicationModelSchema = SchemaFactory.createForClass(PublicationModel);
