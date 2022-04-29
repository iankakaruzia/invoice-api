import { Test, TestingModule } from '@nestjs/testing'
import { User as UserModel } from '@prisma/client'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

describe('UsersController', () => {
  let controller: UsersController
  const usersServiceMock = {
    uploadProfilePhoto: jest.fn(),
    updateTheme: jest.fn(),
    updateProfile: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: usersServiceMock }]
    }).compile()

    controller = module.get<UsersController>(UsersController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('POST -> users/profile-photo', () => {
    it('should call uploadProfilePhoto with correct data', async () => {
      await controller.uploadProfilePicture(
        'any_photo' as unknown as Express.Multer.File,
        { id: 1 } as UserModel
      )

      expect(usersServiceMock.uploadProfilePhoto).toHaveBeenCalledWith(
        'any_photo',
        { id: 1 }
      )
    })

    it('should return profile photo url', async () => {
      jest
        .spyOn(usersServiceMock, 'uploadProfilePhoto')
        .mockResolvedValueOnce('any_photo_url')

      const result = await controller.uploadProfilePicture(
        'any_photo' as unknown as Express.Multer.File,
        { id: 1 } as UserModel
      )

      expect(result).toBe('any_photo_url')
    })
  })

  describe('PATCH -> users/theme', () => {
    it('should call update theme with correct data', async () => {
      await controller.updateTheme({ theme: 'LIGHT' }, { id: 1 } as UserModel)

      expect(usersServiceMock.updateTheme).toHaveBeenCalledWith(
        { theme: 'LIGHT' },
        { id: 1 }
      )
    })
  })

  describe('PATCH -> users/profile', () => {
    it('should call update profile with correct data', async () => {
      await controller.updateProfile({ name: 'any name' }, {
        id: 1
      } as UserModel)

      expect(usersServiceMock.updateProfile).toHaveBeenCalledWith(
        { name: 'any name' },
        { id: 1 }
      )
    })
  })
})
