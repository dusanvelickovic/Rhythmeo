import { JwtService } from '@nestjs/jwt';
import { Profile } from 'passport-spotify';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
export declare class AuthService {
    private readonly jwtService;
    private readonly userRepository;
    private readonly configService;
    private readonly http;
    constructor(jwtService: JwtService, userRepository: Repository<User>, configService: ConfigService, http: HttpService);
    getUserBySpotifyId(spotifyId: string): Promise<User | undefined>;
    saveUserInfo(accessToken: string, refreshToken: string, profile: Profile): Promise<User>;
    login(user: Profile): string;
    getAccessToken(spotifyId: string): Promise<string | null>;
    getRefreshToken(spotifyId: string): Promise<string | null>;
    updateAccessToken(spotifyId: string, newAccessToken: string): Promise<void>;
    refreshAccessToken(spotifyId: string): Promise<string>;
}
