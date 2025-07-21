"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const my_logger_service_1 = require("./my-logger.service");
describe('MyLoggerService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [my_logger_service_1.MyLoggerService],
        }).compile();
        service = module.get(my_logger_service_1.MyLoggerService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=my-logger.service.spec.js.map