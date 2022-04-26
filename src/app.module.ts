import { Module } from '@nestjs/common'
import { CryptographyModule } from './cryptography/cryptography.module'
import { PrismaModule } from './prisma/prisma.module'
import { AuthModule } from './auth/auth.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { configValidatioSchema } from './core/config.schema'
import { InvoicesModule } from './invoices/invoices.module'
import { HealthModule } from './health/health.module'
import { UploadModule } from './upload/upload.module'
import { UsersModule } from './users/users.module'
import { MailModule } from './mail/mail.module'
import { BullModule } from '@nestjs/bull'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      validationSchema: configValidatioSchema
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          redis: {
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT')
          }
        }
      }
    }),
    CryptographyModule,
    PrismaModule,
    AuthModule,
    InvoicesModule,
    HealthModule,
    UploadModule,
    UsersModule,
    MailModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
