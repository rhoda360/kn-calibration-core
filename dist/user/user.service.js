"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
const hash_secret_util_1 = require("../common/utils/hash-secret.util");
const client_1 = require("@prisma/client");
const mail_service_1 = require("../mail/mail.service");
const create_username_util_1 = require("../utils/create-username.util");
let UserService = class UserService {
    databaseService;
    mailService;
    constructor(databaseService, mailService) {
        this.databaseService = databaseService;
        this.mailService = mailService;
    }
    async create(createUserDto) {
        try {
            const userExists = await this.databaseService.$transaction(async (prisma) => {
                const user = await prisma.user.findUnique({
                    where: {
                        email: createUserDto.email,
                    },
                });
                const client = await prisma.client.findUnique({
                    where: {
                        email: createUserDto.email,
                    },
                });
                return user || client;
            });
            if (userExists) {
                throw new common_1.ConflictException('User with this email already exists');
            }
            let username = '';
            while (true) {
                const candidate = (0, create_username_util_1.generateUserName)(createUserDto.role.toUpperCase());
                const existing = await this.databaseService.user.findUnique({
                    where: { username: candidate },
                });
                if (!existing) {
                    username = candidate;
                    break;
                }
            }
            const password = createUserDto.password;
            if (createUserDto.password) {
                const hashedPassword = await (0, hash_secret_util_1.hashSecret)(createUserDto.password);
                createUserDto.password = hashedPassword;
            }
            const createdUser = await this.databaseService.user.create({
                data: {
                    ...createUserDto,
                    username,
                },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    username: true,
                    email: true,
                    phone: true,
                    role: true,
                    avatarUrl: true,
                },
            });
            if (createdUser.role === client_1.UserRole.AGENT ||
                createdUser.role === client_1.UserRole.ADMIN) {
                await this.mailService.sendAccountCreationEmail(createdUser.email, createdUser.firstName, createdUser.email, createdUser.role, password);
            }
            return createdUser;
        }
        catch (error) {
            if (error.code === 'P2002') {
                throw new common_1.ConflictException('User already exists');
            }
            throw new common_1.BadRequestException('Failed to create user');
        }
    }
    async createWithTx(prisma, createUserDto) {
        const userExists = await this.databaseService.$transaction(async (prisma) => {
            const user = await prisma.user.findUnique({
                where: {
                    email: createUserDto.email,
                },
            });
            const client = await prisma.client.findUnique({
                where: {
                    email: createUserDto.email,
                },
            });
            return user || client;
        });
        if (userExists) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        let username = '';
        while (true) {
            const candidate = (0, create_username_util_1.generateUserName)(createUserDto.role.toUpperCase());
            const existing = await this.databaseService.user.findUnique({
                where: { username: candidate },
            });
            if (!existing) {
                username = candidate;
                break;
            }
        }
        const password = createUserDto.password;
        if (createUserDto.password) {
            const hashedPassword = await (0, hash_secret_util_1.hashSecret)(createUserDto.password);
            createUserDto.password = hashedPassword;
        }
        const data = { ...createUserDto, username };
        return await prisma.user.create({ data });
    }
    async findAll(role) {
        try {
            if (role) {
                const users = await this.databaseService.user.findMany({
                    where: {
                        role,
                    },
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        username: true,
                        email: true,
                        phone: true,
                        role: true,
                        avatarUrl: true,
                    },
                });
                if (!users || users.length === 0) {
                    throw new common_1.NotFoundException('No users found with the specified role');
                }
                return users;
            }
            const users = await this.databaseService.user.findMany({
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    username: true,
                    email: true,
                    phone: true,
                    role: true,
                    avatarUrl: true,
                },
            });
            if (!users || users.length === 0) {
                throw new common_1.NotFoundException('No users found');
            }
            return users;
        }
        catch (error) {
            if (error.code === 'P2003') {
                throw new common_1.BadRequestException('Invalid role provided');
            }
            throw new common_1.BadRequestException('Failed to fetch users');
        }
    }
    async findOne(id) {
        const user = await this.databaseService.user.findUnique({
            where: {
                id,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async findByEmail(email) {
        return await this.databaseService.user.findUnique({
            where: {
                email,
            },
        });
    }
    async update(id, updateUserDto) {
        try {
            return await this.databaseService.user.update({
                where: {
                    id,
                },
                data: {
                    ...updateUserDto,
                },
            });
        }
        catch (error) {
            if (error.code === 'P2002') {
                throw new common_1.ConflictException('User already exists');
            }
            else if (error.code === 'P2025') {
                throw new common_1.NotFoundException('User not found');
            }
            throw new common_1.BadRequestException('Failed to update user');
        }
    }
    async updatePassword(id, password) {
        return await this.databaseService.user.update({
            where: { id },
            data: { password },
        });
    }
    async updateRefreshToken(id, refreshToken) {
        return await this.databaseService.user.update({
            where: { id },
            data: { refreshToken },
        });
    }
    async remove(id) {
        try {
            const user = await this.databaseService.user.findUnique({
                where: {
                    id,
                },
            });
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            return await this.databaseService.user.delete({
                where: {
                    id,
                },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    username: true,
                    email: true,
                    phone: true,
                    role: true,
                    avatarUrl: true,
                },
            });
        }
        catch (error) {
            if (error.code === 'P2003') {
                throw new common_1.BadRequestException('User cannot be deleted');
            }
            else if (error.code === 'P2025') {
                throw new common_1.NotFoundException('User not found');
            }
            throw new common_1.BadRequestException('Failed to delete user');
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        mail_service_1.MailService])
], UserService);
//# sourceMappingURL=user.service.js.map