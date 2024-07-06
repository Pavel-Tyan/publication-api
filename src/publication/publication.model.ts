import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type PublicationModelDocument = HydratedDocument<PublicationModel>;
@Schema({ timestamps: true, id: true })
export class PublicationModel {
    @Prop()
    category: string;
    @Prop()
    title: string;
    @Prop()
    text: string;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users' })
    userId: Types.ObjectId;
}

export const PublicationModelSchema = SchemaFactory.createForClass(PublicationModel);
