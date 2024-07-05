import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PublicationModule } from './publication/publication.module';
import { MongooseModule } from '@nestjs/mongoose';
import { getMongoConfig } from './config/mongo.config';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: getMongoConfig,
        }),
        ConfigModule.forRoot(),
        AuthModule,
        CommentModule,
        PublicationModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
