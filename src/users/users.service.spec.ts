import { Test, TestingModule } from '@nestjs/testing'
import { User as UserModel } from '@prisma/client'
import * as streamifier from 'streamifier'
import { PrismaService } from '../prisma/prisma.service'
import { UploadService } from '../upload/upload.service'
import { UsersService } from './users.service'

jest.mock('streamifier', () => ({
  createReadStream: jest.fn()
}))

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

  describe('uploadProfilePhoto', () => {
    it('should call update with correct data and return correct data', async () => {
      const mockedFile = {
        buffer: Buffer.from('some-file')
      } as Express.Multer.File
      const createReadStreamSpy = jest.spyOn(streamifier, 'createReadStream')
      jest
        .spyOn(uploadServiceMock, 'uploadStream')
        .mockResolvedValue({ secure_url: 'some-img-url' })

      const result = await service.uploadProfilePhoto(mockedFile, {
        id: 1
      } as UserModel)

      expect(createReadStreamSpy).toHaveBeenCalledWith(mockedFile.buffer)
      expect(prismaServiceMock.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { profilePhoto: 'some-img-url' }
      })
      expect(result).toStrictEqual({
        profilePhoto: 'some-img-url'
      })
    })
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
