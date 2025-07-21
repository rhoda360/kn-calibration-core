"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateOtpDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_otp_dto_1 = require("./create-otp.dto");
class UpdateOtpDto extends (0, swagger_1.PartialType)(create_otp_dto_1.CreateOtpDto) {
}
exports.UpdateOtpDto = UpdateOtpDto;
//# sourceMappingURL=update-otp.dto.js.map