import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { MailProducer } from './jobs/mail.producer'
import { MailService } from './mail.service'

describe('MailService', () => {
  let service: MailService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        ConfigService,
        { provide: MailProducer, useValue: { sendMail: jest.fn() } }
      ]
    }).compile()

    service = module.get<MailService>(MailService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
