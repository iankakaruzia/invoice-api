import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { PrismaModule } from 'src/prisma/prisma.module'
import { CryptographyModule } from 'src/cryptography/cryptography.module'
import { LocalStrategy } from './strategies/local.strategy'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './strategies/jwt.strategy'
import { MailModule } from '../mail/mail.module'

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    PrismaModule,
    CryptographyModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: `${configService.get('JWT_EXPIRES_IN')}s` }
      })
    }),
    MailModule
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [PassportModule, JwtStrategy]
})
export class AuthModule {}
