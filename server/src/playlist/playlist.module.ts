import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaylistController } from './playlist.controller';
import { PlaylistService } from './playlist.service';
import { Playlist } from './playlist.entity';
import { PlaylistTrackModule } from '../playlist-track/playlist-track.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Playlist]),
        PlaylistTrackModule
    ],
    controllers: [PlaylistController],
    providers: [PlaylistService],
    exports: [PlaylistService],
})
export class PlaylistModule {}
