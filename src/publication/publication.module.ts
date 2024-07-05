import { Module } from '@nestjs/common';
import { PublicationController } from './publication.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PublicationModel, PublicationModelSchema } from './publication.model';

@Module({
    controllers: [PublicationController],
    imports: [MongooseModule.forFeature([{ name: PublicationModel.name, schema: PublicationModelSchema }])],
})
export class PublicationModule {}
