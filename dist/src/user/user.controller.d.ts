import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from '@prisma/client';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(createUserDto: CreateUserDto): Promise<{
        firstName: string;
        lastName: string;
        email: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        avatarUrl: string;
        id: string;
        username: string;
    }>;
    findAll(ip: string, role?: UserRole): Promise<{
        firstName: string;
        lastName: string;
        email: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        avatarUrl: string;
        id: string;
        username: string;
    }[]>;
    findOne(id: string): Promise<{
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        avatarUrl: string;
        isActive: boolean;
        id: string;
        username: string;
        refreshToken: string | null;
        deactivatedAt: Date | null;
        deactivatedById: string | null;
        deactivationReason: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        avatarUrl: string;
        isActive: boolean;
        id: string;
        username: string;
        refreshToken: string | null;
        deactivatedAt: Date | null;
        deactivatedById: string | null;
        deactivationReason: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        firstName: string;
        lastName: string;
        email: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        avatarUrl: string;
        id: string;
        username: string;
    }>;
}
