import { HealthCheckService } from '@nestjs/terminus'
import { Test, TestingModule } from '@nestjs/testing'
import { HealthController } from './health.controller'
import { PrismaHealthIndicator } from './prisma-health-indicator'

describe('HealthController', () => {
  let controller: HealthController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: HealthCheckService, useValue: { check: jest.fn() } },
        { provide: PrismaHealthIndicator, useValue: { isHealthy: jest.fn() } }
      ],
      controllers: [HealthController]
    }).compile()

    controller = module.get<HealthController>(HealthController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
