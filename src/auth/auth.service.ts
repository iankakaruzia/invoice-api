import { Injectable, NotFoundException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User as UserModel } from '@prisma/client'
import { createHash, randomBytes } from 'crypto'
import { addDays } from 'date-fns'
import { MailService } from '../mail/mail.service'
import { CryptographyService } from '../cryptography/cryptography.service'
import { PrismaService } from '../prisma/prisma.service'
import { ForgotPasswordDTO } from './dtos/forgot-password.dto'
import { LoginDTO } from './dtos/login.dto'
import { RegisterDTO } from './dtos/register.dto'
import { JwtPayload } from './interfaces/jwt-payload.interface'
import { ResetPasswordDTO } from './dtos/reset-password.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cryptographyService: CryptographyService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService
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

  async forgotPassword({ email }: ForgotPasswordDTO): Promise<void> {
    const user = await this.getUserByEmail(email)
    if (user) {
      const resetToken = await this.createPasswordResetToken(user)
      await this.mailService.sendForgotPasswordEmail(user, resetToken)
    }
  }

  async updateUserPassword(
    { password }: ResetPasswordDTO,
    token: string
  ): Promise<void> {
    const user = await this.getUserByResetPasswordToken(token)
    const isValidToken = Date.now() <= user?.resetPasswordExpiration
    if (!user || !isValidToken) {
      throw new NotFoundException(
        'Invalid reset token! Please request a new token again.'
      )
    }
    const hashedPassword = await this.cryptographyService.hash(password)
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordExpiration: null,
        resetPasswordToken: null
      }
    })
  }

  private async createPasswordResetToken(user: UserModel): Promise<string> {
    const resetToken = randomBytes(32).toString('hex')
    const passwordResetToken = createHash('sha256')
      .update(resetToken)
      .digest('hex')
    const passwordResetExpiration = addDays(new Date(), 1).getTime()
    await this.prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        resetPasswordToken: passwordResetToken,
        resetPasswordExpiration: passwordResetExpiration
      }
    })
    return resetToken
  }

  private async getUserByResetPasswordToken(token: string): Promise<UserModel> {
    const hashedToken = createHash('sha256').update(token).digest('hex')
    return this.prisma.user.findFirst({
      where: {
        resetPasswordToken: hashedToken
      }
    })
  }
}
