import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger'
import { User as UserModel } from '@prisma/client'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../shared/decorators/current-user.decorator'
import { UpdateProfileDTO } from './dtos/update-profile.dto'
import { UpdateThemeDTO } from './dtos/update-theme.dto'
import { UsersService } from './users.service'

@ApiTags('Invoices')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('profile-photo')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('photo'))
  @ApiBody({
    description: 'Profile photo',
    type: 'string',
    required: true
  })
  async uploadProfilePicture(
    @UploadedFile() photo: Express.Multer.File,
    @CurrentUser() user: UserModel
  ) {
    return this.usersService.uploadProfilePhoto(photo, user)
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('theme')
  async updateTheme(
    @Body() updateThemeDTO: UpdateThemeDTO,
    @CurrentUser() user: UserModel
  ) {
    return this.usersService.updateTheme(updateThemeDTO, user)
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('profile')
  async updateProfile(
    @Body() updateProfileDTO: UpdateProfileDTO,
    @CurrentUser() user: UserModel
  ) {
    return this.usersService.updateProfile(updateProfileDTO, user)
  }
}
