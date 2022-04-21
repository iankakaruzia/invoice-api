import { Module } from '@nestjs/common'
import { InvoicesService } from './invoices.service'
import { InvoicesController } from './invoices.controller'
import { PrismaModule } from '../prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  providers: [InvoicesService],
  controllers: [InvoicesController]
})
export class InvoicesModule {}
