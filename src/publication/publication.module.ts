import { Module } from '@nestjs/common';
import { PublicationController } from './publication.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PublicationModel, PublicationModelSchema } from './publication.model';
import { PublicationService } from './publication.service';

@Module({
    controllers: [PublicationController],
    imports: [MongooseModule.forFeature([{ name: PublicationModel.name, schema: PublicationModelSchema }])],
    providers: [PublicationService],
})
export class PublicationModule {}
