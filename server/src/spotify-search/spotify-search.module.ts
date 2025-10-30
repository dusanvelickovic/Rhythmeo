import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SpotifySearchController } from './spotify-search.controller';
import { SpotifySearchService } from './spotify-search.service';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [HttpModule, AuthModule],
    controllers: [SpotifySearchController],
    providers: [SpotifySearchService],
    exports: [SpotifySearchService],
})
export class SpotifySearchModule {}
