import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikedSong } from './liked-song.entity';
import { LikedSongsService } from './liked-songs.service';
import { LikedSongsController } from './liked-songs.controller';
import {UsersModule} from '../users/users.module';

@Module({
    imports: [TypeOrmModule.forFeature([LikedSong]), UsersModule],
    controllers: [LikedSongsController],
    providers: [LikedSongsService],
    exports: [LikedSongsService],
})
export class LikedSongsModule {}
