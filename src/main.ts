import { ValidationPipe, VersioningType } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import helmet from 'helmet'
import * as basicAuth from 'express-basic-auth'
import { AppModule } from './app.module'
import { PrismaService } from './prisma/prisma.service'

const configService = new ConfigService()

async function bootstrap() {
  const PORT = configService.get('PORT')
  const BULL_UI_USERNAME = configService.get('BULL_UI_USERNAME')
  const BULL_UI_PASSWORD = configService.get('BULL_UI_PASSWORD')

  const app = await NestFactory.create(AppModule)

  app.enableCors()

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1'
  })

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))

  app.use(
    '/admin/queues',
    basicAuth({
      users: {
        [BULL_UI_USERNAME]: BULL_UI_PASSWORD
      },
      challenge: true
    })
  )

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
