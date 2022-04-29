import { Test, TestingModule } from '@nestjs/testing'
import { User as UserModel } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { UploadService } from '../upload/upload.service'
import { UsersService } from './users.service'

describe('UsersService', () => {
  let service: UsersService
  const prismaServiceMock = {
    user: {
      update: jest.fn()
    }
  }
  const uploadServiceMock = {
    uploadStream: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UploadService, useValue: uploadServiceMock },
        { provide: PrismaService, useValue: prismaServiceMock }
      ]
    }).compile()

    service = module.get<UsersService>(UsersService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('uploadTheme', () => {
    it('should call user update with correct theme', async () => {
      await service.updateTheme({ theme: 'DARK' }, { id: 1 } as UserModel)

      expect(prismaServiceMock.user.update).toHaveBeenCalledWith({
        where: {
          id: 1
        },
        data: {
          preferredTheme: 'DARK'
        }
      })
    })
  })

  describe('uploadProfile', () => {
    it('should call user update with correct profile info', async () => {
      await service.updateProfile({ name: 'any name' }, { id: 1 } as UserModel)

      expect(prismaServiceMock.user.update).toHaveBeenCalledWith({
        where: {
          id: 1
        },
        data: {
          name: 'any name'
        }
      })
    })
  })
})
