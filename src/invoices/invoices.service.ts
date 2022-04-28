import { Injectable, NotFoundException } from '@nestjs/common'
import { Status, User as UserModel } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { CreateDraftInvoiceDTO } from './dtos/create-draft-invoice.dto'
import { SavePendingInvoiceDTO } from './dtos/save-pending-invoice.dto'
import {
  GetInvoicesResultDTO,
  InvoiceDTO
} from './dtos/get-invoices-result.dto'
import { GetInvoicesDTO } from './dtos/get-invoices.dto'
import { calculateDueDate } from './helpers/calculate-due-date'
import { calculateTotalItems } from './helpers/calculate-total-items'
import { generateSlug } from './helpers/generate-slug'
import { isSameInvoice, SavedInvoice } from './helpers/is-same-invoice'
// import { seedData } from './seed'

@Injectable()
export class InvoicesService {
  private static invoicesPerPage = 10

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
    { items = [], billFrom, billTo, ...others }: SavePendingInvoiceDTO,
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
      dueDate: calculateDueDate(invoice.date, invoice.paymentTerm)
    }
  }

  async getInvoices(
    { cursor = null, status }: GetInvoicesDTO,
    user: UserModel
  ): Promise<GetInvoicesResultDTO> {
    const invoices = await this.prisma.invoice.findMany({
      take: InvoicesService.invoicesPerPage,
      ...(cursor !== null
        ? {
            cursor: {
              id: parseInt(Buffer.from(cursor, 'base64').toString('ascii'))
            },
            skip: 1
          }
        : {}),
      where: {
        userId: user.id,
        ...(status
          ? {
              status
            }
          : {})
      },
      orderBy: {
        id: 'desc'
      },
      select: {
        id: true,
        slug: true,
        date: true,
        paymentTerm: true,
        status: true,
        billTo: {
          select: {
            name: true
          }
        },
        items: true
      }
    })

    const invoicesDTO: InvoiceDTO[] = invoices.map((invoice) => {
      const { itemsTotal } = calculateTotalItems(invoice.items)
      return {
        id: invoice.id,
        slug: invoice.slug,
        status: invoice.status,
        billTo: invoice.billTo?.name ?? null,
        dueDate: calculateDueDate(invoice.date, invoice.paymentTerm),
        total: itemsTotal
      }
    })

    return {
      data: {
        invoices: invoicesDTO
      },
      nextCursor:
        invoices.length === InvoicesService.invoicesPerPage
          ? Buffer.from(invoices[invoices.length - 1].id.toString()).toString(
              'base64'
            )
          : null
    }
  }

  async deleteInvoice(invoiceId: number, user: UserModel) {
    const invoice = await this.prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        userId: user.id
      }
    })

    if (!invoice) {
      throw new NotFoundException('Unable to find the invoice')
    }

    await this.prisma.invoice.delete({
      where: {
        id: invoice.id
      }
    })
  }

  async updateInvoice(
    invoiceId: number,
    savePendingInvoiceDTO: SavePendingInvoiceDTO,
    user: UserModel
  ) {
    const { items, billFrom, billTo, ...others } = savePendingInvoiceDTO
    const invoice = await this.prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        userId: user.id
      },
      select: {
        id: true,
        description: true,
        date: true,
        paymentTerm: true,
        billFrom: true,
        billTo: true,
        items: true
      }
    })

    if (!invoice) {
      throw new NotFoundException('Unable to find the invoice')
    }

    const isSameInvoices = isSameInvoice(
      invoice as SavedInvoice,
      savePendingInvoiceDTO
    )

    if (isSameInvoices) {
      return
    }

    const deleteInvoiceItems = this.prisma.invoice.update({
      where: {
        id: invoice.id
      },
      data: {
        items: {
          deleteMany: {
            invoiceId: invoice.id
          }
        }
      }
    })

    const updateInvoice = this.prisma.invoice.update({
      where: {
        id: invoice.id
      },
      data: {
        ...others,
        status: Status.PENDING,
        billTo: {
          upsert: {
            update: {
              ...billTo
            },
            create: {
              ...billTo
            }
          }
        },
        billFrom: {
          upsert: {
            update: {
              ...billFrom
            },
            create: {
              ...billFrom
            }
          }
        },
        items: {
          createMany: {
            data: items
          }
        }
      }
    })

    await this.prisma.$transaction([deleteInvoiceItems, updateInvoice])
  }

  // async seedDatabase(user: UserModel) {
  //   seedData.forEach(async (invoice) => {
  //     await this.createDraftInvoice(
  //       {
  //         ...invoice,
  //         date: new Date(invoice.date),
  //         paymentTerm: parseInt(invoice.paymentTerm)
  //       },
  //       user
  //     )
  //   })
  // }

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
