import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { User } from './user.entity';
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard';
import {UsersService} from './users.service';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UsersService) {}

    /**
     * Get the currently authenticated user's profile
     */
    @Get('me')
    @UseGuards(JwtAuthGuard)
    async getCurrentUser(@Req() req): Promise<User> {
        const user = await this.userService.findBySpotifyId(req.user.spotifyId);
        // Exclude sensitive fields
        delete user.spotifyId;
        delete user.accessToken;
        delete user.refreshToken;
        delete user.createdAt;
        delete user.updatedAt;
        delete user.tokenExpiresAt;

        try {
            const profile = typeof user.profileImage === 'string' ? JSON.parse(user.profileImage) : user.profileImage;
            user.profileImage = profile?.value ?? null;
        } catch (e) {
            user.profileImage = null;
        }

        return user;
    }
}
