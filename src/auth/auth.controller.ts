import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
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
}
