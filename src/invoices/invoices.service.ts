import { Injectable, NotFoundException } from '@nestjs/common'
import { Status, User as UserModel } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { CreateDraftInvoiceDTO } from './dtos/create-draft-invoice.dto'
import { CreatePendingInvoiceDTO } from './dtos/create-pending-invoice.dto'
import { calculateDueDate } from './helpers/calculate-due-date'
import { calculateTotalItems } from './helpers/calculate-total-items'
import { generateSlug } from './helpers/generate-slug'

@Injectable()
export class InvoicesService {
  constructor(private readonly prisma: PrismaService) {}

  async createDraftInvoice(
    { items = [], billFrom, billTo, ...others }: CreateDraftInvoiceDTO,
    user: UserModel
  ) {
    const slug = await this.createUniqueSlug(generateSlug())
    return await this.prisma.invoice.create({
      data: {
        ...others,
        slug,
        status: Status.DRAFT,
        userId: user.id,
        ...(items.length ? { items: { createMany: { data: items } } } : {}),
        ...(billFrom ? { billFrom: { create: { ...billFrom } } } : {}),
        ...(billTo ? { billTo: { create: { ...billTo } } } : {})
      }
    })
  }

  async createPendingInvoice(
    { items = [], billFrom, billTo, ...others }: CreatePendingInvoiceDTO,
    user: UserModel
  ) {
    const slug = await this.createUniqueSlug(generateSlug())
    return await this.prisma.invoice.create({
      data: {
        ...others,
        slug,
        status: Status.PENDING,
        userId: user.id,
        ...(billFrom ? { billFrom: { create: { ...billFrom } } } : {}),
        ...(billTo ? { billTo: { create: { ...billTo } } } : {}),
        ...(items.length ? { items: { createMany: { data: items } } } : {})
      }
    })
  }

  async setInvoiceAsPaid(invoiceId: number, user: UserModel) {
    const invoice = await this.prisma.invoice.findFirst({
      where: { id: invoiceId, userId: user.id }
    })

    if (!invoice) {
      throw new NotFoundException('Unable to find the invoice')
    }

    await this.prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        status: Status.PAID
      }
    })
  }

  async getInvoiceById(invoiceId: number, user: UserModel) {
    const invoice = await this.prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        userId: user.id
      },
      include: {
        billFrom: {
          select: {
            id: true,
            address: true,
            city: true,
            postcode: true,
            country: true
          }
        },
        billTo: {
          select: {
            id: true,
            name: true,
            email: true,
            address: true,
            city: true,
            postcode: true,
            country: true
          }
        },
        items: true
      }
    })

    if (!invoice) {
      throw new NotFoundException('Unable to find the invoice')
    }

    const { items, itemsTotal } = calculateTotalItems(invoice.items)

    return {
      ...invoice,
      items,
      itemsTotal,
      dueDate: calculateDueDate(invoice)
    }
  }

  private async createUniqueSlug(slug: string): Promise<string> {
    const existingInvoice = await this.prisma.invoice.findUnique({
      where: {
        slug
      }
    })

    if (existingInvoice) {
      return this.createUniqueSlug(generateSlug())
    }

    return slug
  }
}
