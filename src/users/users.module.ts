import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/prisma/prisma.module'
import { UploadModule } from 'src/upload/upload.module'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'

@Module({
  imports: [UploadModule, PrismaModule],
  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
