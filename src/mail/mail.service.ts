import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { User as UserModel } from '@prisma/client'
import { MailProducer } from './jobs/mail.producer'

@Injectable()
export class MailService {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailProducer: MailProducer
  ) {}

  async sendForgotPasswordEmail(user: UserModel, token: string) {
    const url = `${this.configService.get('CLIENT_RESET_PASSWORD_URL')}${token}`

    await this.mailProducer.sendMail({
      to: user.email,
      subject: 'Forgot your Password?',
      template: 'forgot-password',
      context: {
        name: user.name,
        email: user.email,
        url,
        logo: this.configService.get('CLIENT_URL')
      }
    })
  }
}
