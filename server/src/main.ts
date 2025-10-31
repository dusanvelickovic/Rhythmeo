import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: process.env.FRONTEND_BASE_URL,
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization', 'authorization'],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    });

    app.use(cookieParser());

    const port = process.env.PORT || 3000;
    await app.listen(port);
}
bootstrap();
