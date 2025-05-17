// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { HttpExceptionFilter } from './http-exception.filter';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   app.useGlobalFilters(new HttpExceptionFilter());
//   await app.listen(3000);
// }
// bootstrap();



import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Добавьте эти строки
  app.enableCors({
    // origin: 'http://localhost:3001', // или true для разрешения всех доменов
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();