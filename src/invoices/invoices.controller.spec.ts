import { Test, TestingModule } from '@nestjs/testing'
import { InvoicesController } from './invoices.controller'
import { InvoicesService } from './invoices.service'

describe('InvoiceController', () => {
  let controller: InvoicesController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: InvoicesService,
          useValue: {
            getInvoiceById: jest.fn(),
            createDraftInvoice: jest.fn(),
            createPendingInvoice: jest.fn(),
            setInvoiceAsPaid: jest.fn()
          }
        }
      ],
      controllers: [InvoicesController]
    }).compile()

    controller = module.get<InvoicesController>(InvoicesController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
