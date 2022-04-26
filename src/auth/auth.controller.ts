import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards
} from '@nestjs/common'
import { User as UserModel } from '@prisma/client'
import { ApiBody, ApiTags } from '@nestjs/swagger'
import { CurrentUser } from '../shared/decorators/current-user.decorator'
import { AuthService } from './auth.service'
import { RegisterDTO } from './dtos/register.dto'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { LoginDTO } from './dtos/login.dto'
import { ForgotPasswordDTO } from './dtos/forgot-password.dto'
import { ResetPasswordDTO } from './dtos/reset-password.dto'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({
    type: LoginDTO
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@CurrentUser() user: UserModel) {
    return this.authService.login(user)
  }

  @Post('register')
  async register(@Body() registerDTO: RegisterDTO) {
    return this.authService.register(registerDTO)
  }

  @HttpCode(200)
  @Post('/forgot-password')
  async forgotPassword(@Body() forgotPasswordDTO: ForgotPasswordDTO) {
    await this.authService.forgotPassword(forgotPasswordDTO)
    return {
      message:
        'A Token will be sent to your email if we are able to find an account with the provided email'
    }
  }

  @HttpCode(200)
  @Post('/reset-password/:token')
  async resetPassword(
    @Body() resetPasswordDTO: ResetPasswordDTO,
    @Param('token') token: string
  ) {
    await this.authService.updateUserPassword(resetPasswordDTO, token)
    return {
      message: 'Password updated! Please log in to enjoy our platform.'
    }
  }
}
