import { Module } from '@nestjs/common'
import { CryptographyModule } from './cryptography/cryptography.module'
import { PrismaModule } from './prisma/prisma.module'

@Module({
  imports: [CryptographyModule, PrismaModule],
  controllers: [],
  providers: []
})
export class AppModule {}
