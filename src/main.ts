import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { PrismaService } from './prisma/prisma.service'

const configService = new ConfigService()

async function bootstrap() {
  const PORT = configService.get('PORT')

  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))

  const prismaService: PrismaService = app.get(PrismaService)
  prismaService.enableShutdownHooks(app)

  app.enableShutdownHooks()

  await app.listen(PORT || 8080)
}
bootstrap()
