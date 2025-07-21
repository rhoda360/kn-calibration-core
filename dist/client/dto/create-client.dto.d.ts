import { UserRole } from '@prisma/client';
export declare class CreateClientDto {
    companyName: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    rcNumber?: string;
    address?: string;
    phone?: string;
    role?: UserRole;
    avatarUrl?: string;
    isActive?: boolean;
}
