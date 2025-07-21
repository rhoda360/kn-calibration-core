"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const client_controller_1 = require("./client.controller");
const client_service_1 = require("./client.service");
describe('ClientController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [client_controller_1.ClientController],
            providers: [client_service_1.ClientService],
        }).compile();
        controller = module.get(client_controller_1.ClientController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=client.controller.spec.js.map