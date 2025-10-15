import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { SpotifyStrategy } from './spotify.strategy';

@Module({
    imports: [PassportModule.register({ defaultStrategy: 'spotify' })],
    controllers: [AuthController],
    providers: [AuthService, SpotifyStrategy],
    exports: [AuthService],
})
export class AuthModule {}
