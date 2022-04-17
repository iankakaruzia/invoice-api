import { Module } from '@nestjs/common'
import { CryptographyModule } from './cryptography/cryptography.module'
import { PrismaModule } from './prisma/prisma.module'
import { AuthModule } from './auth/auth.module'
import { ConfigModule } from '@nestjs/config'
import { configValidatioSchema } from './core/config.schema'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      validationSchema: configValidatioSchema
    }),
    CryptographyModule,
    PrismaModule,
    AuthModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
