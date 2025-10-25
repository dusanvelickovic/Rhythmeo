// app.module.ts ili spotify.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SpotifyService } from './spotify.service';
import {AuthModule} from '../auth/auth.module';
import {SpotifyController} from './spotify.controller';

@Module({
    imports: [HttpModule, AuthModule],
    providers: [SpotifyService],
    exports: [SpotifyService],
    controllers: [SpotifyController],
})
export class SpotifyModule {}
