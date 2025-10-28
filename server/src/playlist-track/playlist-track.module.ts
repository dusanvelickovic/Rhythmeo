import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaylistTrackController } from './playlist-track.controller';
import { PlaylistTrackService } from './playlist-track.service';
import { PlaylistTrack } from './playlist-track.entity';

@Module({
    imports: [TypeOrmModule.forFeature([PlaylistTrack])],
    controllers: [PlaylistTrackController],
    providers: [PlaylistTrackService],
    exports: [PlaylistTrackService],
})
export class PlaylistTrackModule {}
