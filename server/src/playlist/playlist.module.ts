import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaylistController } from './playlist.controller';
import { PlaylistService } from './playlist.service';
import { Playlist } from './playlist.entity';
import { PlaylistTrackModule } from '../playlist-track/playlist-track.module';
import { SpotifyModule } from '../spotify/spotify.module';
import {UsersModule} from '../users/users.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Playlist]),
        PlaylistTrackModule,
        SpotifyModule,
        UsersModule,
    ],
    controllers: [PlaylistController],
    providers: [PlaylistService],
    exports: [PlaylistService],
})
export class PlaylistModule {}
