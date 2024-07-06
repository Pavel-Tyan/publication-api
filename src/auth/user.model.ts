import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserModelDocument = HydratedDocument<UserModel>;

@Schema({ id: true })
export class UserModel {
    @Prop()
    name: string;
    @Prop()
    surname: string;
    @Prop({ unique: true })
    email: string;
    @Prop()
    passwordHash: string;
}

export const UserModelSchema = SchemaFactory.createForClass(UserModel);
