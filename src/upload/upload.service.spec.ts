import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { UploadService } from './upload.service'

describe('UploadService', () => {
  let service: UploadService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadService, ConfigService]
    }).compile()

    service = module.get<UploadService>(UploadService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
