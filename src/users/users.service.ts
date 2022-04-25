import { BadRequestException, Injectable } from '@nestjs/common'
import { User as UserModel } from '@prisma/client'
import { createReadStream } from 'streamifier'
import { PrismaService } from '../prisma/prisma.service'
import { UploadService } from '../upload/upload.service'
import { UpdateThemeDTO } from './dtos/update-theme.dto'
import { UpdateProfileDTO } from './dtos/update-profile.dto'

@Injectable()
export class UsersService {
  constructor(
    private readonly uploadService: UploadService,
    private readonly prisma: PrismaService
  ) {}

  async uploadProfilePhoto(photo: Express.Multer.File, user: UserModel) {
    if (!photo) {
      throw new BadRequestException('Please provide a valid photo')
    }
    const photoStream = createReadStream(photo.buffer)
    const { secure_url } = await this.uploadService.uploadStream(photoStream, {
      folder: 'invoice-app',
      tags: ['profile-photo'],
      allowed_formats: ['jpg', 'png']
    })

    await this.prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        profilePhoto: secure_url
      }
    })

    return {
      profilePhoto: secure_url
    }
  }

  async updateTheme({ theme }: UpdateThemeDTO, user: UserModel) {
    await this.prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        preferredTheme: theme
      }
    })
  }

  async updateProfile({ name }: UpdateProfileDTO, user: UserModel) {
    await this.prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        name
      }
    })
  }
}
