import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User as UserModel } from '@prisma/client'
import { CryptographyService } from '../cryptography/cryptography.service'
import { PrismaService } from '../prisma/prisma.service'
import { LoginDTO } from './dtos/login.dto'
import { RegisterDTO } from './dtos/register.dto'
import { JwtPayload } from './interfaces/jwt-payload.interface'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cryptographyService: CryptographyService,
    private readonly jwtService: JwtService
  ) {}

  async getUserByEmail(email: string): Promise<UserModel> {
    return this.prisma.user.findUnique({ where: { email } })
  }

  async validateUser({ email, password }: LoginDTO): Promise<UserModel | null> {
    const user = await this.getUserByEmail(email)

    if (!user) {
      return null
    }

    const isValidPassword = await this.cryptographyService.verify(
      user.password,
      password
    )
    if (!isValidPassword) {
      return null
    }

    return user
  }

  login({ email, name, profilePhoto, preferredTheme }: UserModel) {
    const payload: JwtPayload = { email }
    const accessToken = this.jwtService.sign(payload)

    return {
      accessToken,
      user: {
        name,
        email,
        profilePhoto,
        preferredTheme
      }
    }
  }

  async register({ name, email, password }: RegisterDTO) {
    const hashedPassword = await this.cryptographyService.hash(password)
    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword
      }
    })
    return this.login(user)
  }
}
