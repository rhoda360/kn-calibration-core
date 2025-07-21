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
exports.ClientService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
const client_1 = require("@prisma/client");
const user_service_1 = require("../user/user.service");
const mail_service_1 = require("../mail/mail.service");
let ClientService = class ClientService {
    databaseService;
    userService;
    mailService;
    constructor(databaseService, userService, mailService) {
        this.databaseService = databaseService;
        this.userService = userService;
        this.mailService = mailService;
    }
    async create(createClientDto) {
        const { email, companyName, rcNumber, address, ...userData } = createClientDto;
        const clientExists = await this.databaseService.$transaction(async (prisma) => {
            const client = await prisma.client.findUnique({
                where: { email: createClientDto.email },
            });
            const user = await prisma.user.findUnique({
                where: { email: createClientDto.email },
            });
            return !!client || !!user;
        });
        if (clientExists) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        const existingClient = await this.databaseService.client.findUnique({
            where: { rcNumber },
        });
        if (existingClient) {
            throw new common_1.ConflictException('Client with this RC Number already exists');
        }
        const otp = await this.databaseService.oneTimePassword.findFirst({
            where: { email },
        });
        if (!otp || !otp.isVerified) {
            throw new common_1.UnauthorizedException('Email is not verified');
        }
        const [user, client] = await this.databaseService.$transaction(async (tx) => {
            const user = await this.userService.createWithTx(tx, {
                ...userData,
                email,
                role: client_1.UserRole.CLIENT,
            });
            const client = await tx.client.create({
                data: { companyName, rcNumber, address, email, userId: user.id },
            });
            return [user, client];
        });
        await this.mailService.sendClientCreationEmail(user.email, user.firstName, user.email, user.role, createClientDto.password);
        return client;
    }
    async findAll() {
        return this.databaseService.client.findMany();
    }
    async findOne(id) {
        const client = await this.databaseService.client.findUnique({
            where: { id },
        });
        if (!client) {
            throw new common_1.NotFoundException('Client not found');
        }
        return client;
    }
    async update(id, updateClientDto) {
        const client = await this.databaseService.client.findUnique({
            where: { id },
        });
        if (!client) {
            throw new common_1.NotFoundException('Client not found');
        }
        return await this.databaseService.client.update({
            where: { id },
            data: updateClientDto,
        });
    }
    async remove(id) {
        const client = await this.databaseService.client.findUnique({
            where: { id },
        });
        if (!client) {
            throw new common_1.NotFoundException('Client not found');
        }
        return await this.databaseService.client.delete({
            where: { id },
        });
    }
};
exports.ClientService = ClientService;
exports.ClientService = ClientService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        user_service_1.UserService,
        mail_service_1.MailService])
], ClientService);
//# sourceMappingURL=client.service.js.map