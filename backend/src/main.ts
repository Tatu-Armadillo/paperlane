import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  const port = Number(process.env.NEST_PORT || 8002);
  await app.listen(port, '127.0.0.1');
  // eslint-disable-next-line no-console
  console.log(`[nest] Paperlane API ready on 127.0.0.1:${port}`);
}
bootstrap();
