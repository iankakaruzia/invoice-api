import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { User as UserModel } from '@prisma/client'
import { Strategy } from 'passport-local'
import { AuthService } from '../auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' })
  }

  async validate(email: string, password: string): Promise<UserModel> {
    const user = await this.authService.validateUser({ email, password })
    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    return user
  }
}
