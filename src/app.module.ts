import { Module } from '@nestjs/common'
import { CryptographyModule } from './cryptography/cryptography.module'
import { PrismaModule } from './prisma/prisma.module'
import { AuthModule } from './auth/auth.module'
import { ConfigModule } from '@nestjs/config'
import { configValidatioSchema } from './core/config.schema'
import { InvoicesModule } from './invoices/invoices.module'
import { HealthModule } from './health/health.module'
import { UploadModule } from './upload/upload.module'
import { UsersModule } from './users/users.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      validationSchema: configValidatioSchema
    }),
    CryptographyModule,
    PrismaModule,
    AuthModule,
    InvoicesModule,
    HealthModule,
    UploadModule,
    UsersModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
