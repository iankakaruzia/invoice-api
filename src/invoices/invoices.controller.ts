import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards
} from '@nestjs/common'
import { User as UserModel } from '@prisma/client'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../shared/decorators/current-user.decorator'
import { CreateDraftInvoiceDTO } from './dtos/create-draft-invoice.dto'
import { CreatePendingInvoiceDTO } from './dtos/create-pending-invoice.dto'
import { InvoicesService } from './invoices.service'
import { GetInvoicesDTO } from './dtos/get-invoices.dto'

@ApiTags('Invoices')
@ApiBearerAuth()
@Controller('invoices')
@UseGuards(JwtAuthGuard)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  async getInvoices(
    @Query() getInvoicesDTO: GetInvoicesDTO,
    @CurrentUser() user: UserModel
  ) {
    return this.invoicesService.getInvoices(getInvoicesDTO, user)
  }

  @Get(':id')
  async getInvoiceById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: UserModel
  ) {
    return this.invoicesService.getInvoiceById(id, user)
  }

  @Post('draft')
  async createDraftInvoice(
    @Body() createDraftInvoiceDTO: CreateDraftInvoiceDTO,
    @CurrentUser() user: UserModel
  ) {
    return await this.invoicesService.createDraftInvoice(
      createDraftInvoiceDTO,
      user
    )
  }

  @Post()
  async createPendingInvoice(
    @Body() createPendingInvoiceDTO: CreatePendingInvoiceDTO,
    @CurrentUser() user: UserModel
  ) {
    return await this.invoicesService.createPendingInvoice(
      createPendingInvoiceDTO,
      user
    )
  }

  @Patch(':id/paid')
  async setInvoiceAsPaid(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: UserModel
  ) {
    return this.invoicesService.setInvoiceAsPaid(id, user)
  }
}
