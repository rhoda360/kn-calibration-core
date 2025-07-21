"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("tsconfig-paths/register");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const corsOptions_1 = require("./common/config/corsOptions");
const all_exceptions_filter_1 = require("./all-exceptions.filter");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const { httpAdapter } = app.get(core_1.HttpAdapterHost);
    app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter(httpAdapter));
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.enableCors(corsOptions_1.corsOptions);
    app.setGlobalPrefix('api', {
        exclude: [
            { path: '/', method: common_1.RequestMethod.ALL },
            { path: '/health', method: common_1.RequestMethod.ALL },
        ],
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Calib - Calibration Software')
        .setDescription('Calib is a calibration management system designed to help construction professionals manage and track calibration processes efficiently.')
        .setVersion('1.0')
        .addTag('calibration')
        .addBearerAuth()
        .build();
    const documentFactory = () => swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, documentFactory);
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err) => {
    console.error('Bootstrap failed:', err);
    process.exit(1);
});
//# sourceMappingURL=main.js.map