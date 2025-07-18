import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { corsOptions } from './common/config/corsOptions';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set up global exception filter
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  // Global settings
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.enableCors(corsOptions);
  app.setGlobalPrefix('api', {
    exclude: [
      { path: '/', method: RequestMethod.ALL },
      { path: '/health', method: RequestMethod.ALL },
    ],
  });

  // Enable Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('FaRS - Financial Reconciliation Software')
    .setDescription(
      'FaRS is a financial reconciliation system designed to help businesses manage multi-bank, multi-currency transactions, classify data, and perform contract-specific analysis. It includes features like real-time notifications, role-based permissions, and CSV uploads for transaction tracking.',
    )
    .setVersion('1.0')
    .addTag('fars')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/doc', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err) => {
  console.error('Bootstrap failed:', err);
  process.exit(1);
});
