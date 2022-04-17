import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards
} from '@nestjs/common'
import { User as UserModel } from '@prisma/client'
import { CurrentDecorator } from '../shared/decorators/current-user.decorator'
import { AuthService } from './auth.service'
import { RegisterDTO } from './dtos/register.dto'
import { LocalAuthGuard } from './guards/local-auth.guard'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@CurrentDecorator() user: UserModel) {
    return this.authService.login(user)
  }

  @Post('register')
  async register(@Body() registerDTO: RegisterDTO) {
    return this.authService.register(registerDTO)
  }
}
