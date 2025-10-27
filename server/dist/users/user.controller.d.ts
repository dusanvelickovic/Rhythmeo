import { User } from './user.entity';
import { UsersService } from './users.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UsersService);
    getCurrentUser(req: any): Promise<User>;
}
