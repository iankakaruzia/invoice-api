import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import helmet from 'helmet'
import { AppModule } from './app.module'
import { PrismaService } from './prisma/prisma.service'

const configService = new ConfigService()

async function bootstrap() {
  const PORT = configService.get('PORT')

  const app = await NestFactory.create(AppModule)

  app.enableCors()

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))

  const prismaService: PrismaService = app.get(PrismaService)
  prismaService.enableShutdownHooks(app)

  app.enableShutdownHooks()

  app.use(helmet())

  const config = new DocumentBuilder()
    .setTitle('Invoices API')
    .setDescription('Control your invoices information')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  await app.listen(PORT || 8080)
}
bootstrap()
