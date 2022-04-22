import { Injectable } from '@nestjs/common'
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult
} from '@nestjs/terminus'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class PrismaHealthIndicator extends HealthIndicator {
  constructor(private prisma: PrismaService) {
    super()
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      await this.prisma.$queryRaw`SELECT 1`
      return this.getStatus(key, true)
    } catch (error) {
      throw new HealthCheckError(
        'PrismaHealthIndicator failed',
        this.getStatus(key, false)
      )
    }
  }
}
