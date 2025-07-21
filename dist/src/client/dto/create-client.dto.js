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
exports.CreateClientDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_validator_1 = require("class-validator");
class CreateClientDto {
    companyName;
    firstName;
    lastName;
    email;
    password;
    rcNumber;
    address;
    phone;
    role;
    avatarUrl;
    isActive;
}
exports.CreateClientDto = CreateClientDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(3),
    (0, swagger_1.ApiProperty)({
        description: 'Company name of the user',
        example: 'Tech Corp',
    }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "companyName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(3),
    (0, swagger_1.ApiProperty)({
        description: 'First name of the user',
        example: 'John',
    }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(3),
    (0, swagger_1.ApiProperty)({
        description: 'Last name of the user',
        example: 'Doe',
    }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    (0, swagger_1.ApiProperty)({
        description: 'Email address of the user',
        example: 'john_doe@example.com',
    }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(8),
    (0, class_validator_1.Matches)(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message: 'Password must include uppercase, lowercase, number, special character, and be at least 8 characters',
    }),
    (0, swagger_1.ApiProperty)({
        description: 'Password for the user account',
        example: 'P@ssw0rd123',
    }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Company registration number',
        example: 'RC123456',
    }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "rcNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Company address',
        example: '123 Tech Street, Silicon Valley',
    }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/^(?:0|\+234)(7|8|9)[01]\d{8}$/, {
        message: 'Phone number must be a valid Nigerian mobile number',
    }),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Phone number of the user',
        example: '+2347012345678',
        required: false,
    }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.UserRole, { message: 'Valid role required' }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Role of the user',
        enum: client_1.UserRole,
        example: client_1.UserRole.CLIENT,
        required: false,
    }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Avatar URL for the user',
        example: 'https://example.com/avatar/john_doe.png',
        required: false,
    }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "avatarUrl", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Indicates if the user is active',
        example: true,
        required: false,
    }),
    __metadata("design:type", Boolean)
], CreateClientDto.prototype, "isActive", void 0);
//# sourceMappingURL=create-client.dto.js.map