import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards
} from '@nestjs/common'
import { User as UserModel } from '@prisma/client'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../shared/decorators/current-user.decorator'
import { CreateDraftInvoiceDTO } from './dtos/create-draft-invoice.dto'
import { SavePendingInvoiceDTO } from './dtos/save-pending-invoice.dto'
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
    @Body() savePendingInvoiceDTO: SavePendingInvoiceDTO,
    @CurrentUser() user: UserModel
  ) {
    return await this.invoicesService.createPendingInvoice(
      savePendingInvoiceDTO,
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

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteInvoice(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: UserModel
  ) {
    return this.invoicesService.deleteInvoice(id, user)
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id')
  async updateInvoice(
    @Param('id', ParseIntPipe) id: number,
    @Body() savePendingInvoiceDTO: SavePendingInvoiceDTO,
    @CurrentUser() user: UserModel
  ) {
    return this.invoicesService.updateInvoice(id, savePendingInvoiceDTO, user)
  }
}
