import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SpotifyModule } from './spotify/spotify.module';
import { SpotifySearchModule } from './spotify-search/spotify-search.module';
import { LikedTracksModule } from './liked-tracks/liked-tracks.module';
import { PlaylistModule } from './playlist/playlist.module';
import { PlaylistTrackModule } from './playlist-track/playlist-track.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, 'client'),
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('DB_HOST'),
                port: configService.get('DB_PORT'),
                username: configService.get('DB_USERNAME'),
                password: configService.get('DB_PASSWORD'),
                database: configService.get('DB_NAME'),
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                migrations: [__dirname + '/server/migrations/**/*{.ts,.js}'],
                synchronize: configService.get('NODE_ENV') === 'development', // Don't use in production
                logging: configService.get('NODE_ENV') === 'development',
                extra: {
                    timezone: 'UTC',
                }
            }),
            inject: [ConfigService],
        }),
        AuthModule,
        UsersModule,
        SpotifyModule,
        SpotifySearchModule,
        LikedTracksModule,
        PlaylistModule,
        PlaylistTrackModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
