import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikedTrack } from './liked-track.entity';
import { LikedTracksService } from './liked-tracks.service';
import { LikedTracksController } from './liked-tracks.controller';
import {UsersModule} from '../users/users.module';

@Module({
    imports: [TypeOrmModule.forFeature([LikedTrack]), UsersModule],
    controllers: [LikedTracksController],
    providers: [LikedTracksService],
    exports: [LikedTracksService],
})
export class LikedTracksModule {}
