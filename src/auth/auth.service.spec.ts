import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import { MailService } from '../mail/mail.service'
import { CryptographyService } from '../cryptography/cryptography.service'
import { PrismaService } from '../prisma/prisma.service'
import { AuthService } from './auth.service'
import { prismaServiceMock } from '../test/__mocks__/prisma'

describe('AuthService', () => {
  let service: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prismaServiceMock },
        CryptographyService,
        { provide: JwtService, useValue: { sign: jest.fn() } },
        {
          provide: MailService,
          useValue: { sendForgotPasswordEmail: jest.fn() }
        }
      ]
    }).compile()

    service = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
