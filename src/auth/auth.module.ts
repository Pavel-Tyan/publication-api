import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserModelSchema } from './user.model';

@Module({
    controllers: [AuthController],
    imports: [MongooseModule.forFeature([{ name: UserModel.name, schema: UserModelSchema }])],
})
export class AuthModule {}
