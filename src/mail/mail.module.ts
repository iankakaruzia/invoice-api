import { Module } from '@nestjs/common'
import { BullModule, InjectQueue } from '@nestjs/bull'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MailerModule } from '@nestjs-modules/mailer'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import { createBullBoard } from 'bull-board'
import { BullAdapter } from 'bull-board/bullAdapter'
import { SEND_MAIL_QUEUE } from './jobs/constants'
import { MailService } from './mail.service'
import { join } from 'path'
import { Queue } from 'bull'
import { MiddlewareBuilder } from '@nestjs/core'
import { MailProducer } from './jobs/mail.producer'
import { MailConsumer } from './jobs/mail.consumer'

@Module({
  imports: [
    ConfigModule,
    BullModule.registerQueue({ name: SEND_MAIL_QUEUE }),
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('MAIL_HOST'),
          port: config.get('MAIL_PORT'),
          auth: {
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASSWORD')
          }
        },
        defaults: {
          from: `"No Reply" <${config.get('MAIL_FROM')}>`
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true
          }
        }
      }),
      inject: [ConfigService],
      imports: [ConfigModule]
    })
  ],
  providers: [MailProducer, MailConsumer, MailService],
  exports: [MailService]
})
export class MailModule {
  constructor(
    @InjectQueue(SEND_MAIL_QUEUE) private readonly sendMailQueue: Queue
  ) {}

  configure(consumer: MiddlewareBuilder) {
    const { router } = createBullBoard([new BullAdapter(this.sendMailQueue)])
    consumer.apply(router).forRoutes('/admin/queues')
  }
}
