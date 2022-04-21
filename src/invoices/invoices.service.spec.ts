import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '../prisma/prisma.service'
import { InvoicesService } from './invoices.service'

describe('InvoicesService', () => {
  let service: InvoicesService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvoicesService, PrismaService]
    }).compile()

    service = module.get<InvoicesService>(InvoicesService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
