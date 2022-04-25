import { Test, TestingModule } from '@nestjs/testing'
import * as argon2 from 'argon2'
import { CryptographyService } from './cryptography.service'

jest.mock('argon2', () => ({
  async hash(): Promise<string> {
    return 'hash'
  },
  async verify(): Promise<boolean> {
    return true
  }
}))

describe('CryptographyService', () => {
  let service: CryptographyService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptographyService]
    }).compile()

    service = module.get<CryptographyService>(CryptographyService)
  })

  describe('hash()', () => {
    it('should call argon2 hash with correct value', async () => {
      const plaintext = 'some_text'
      const hashSpy = jest.spyOn(argon2, 'hash')
      await service.hash(plaintext)

      expect(hashSpy).toBeCalledWith(plaintext)
    })

    it('should return valid hash on success', async () => {
      const plaintext = 'some_text'
      const hashedText = await service.hash(plaintext)

      expect(hashedText).toBe('hash')
    })

    it('should throw if hash throws', async () => {
      jest.spyOn(argon2, 'hash').mockImplementation(() => {
        throw new Error()
      })
      const promise = service.hash('some_text')

      await expect(promise).rejects.toThrow()
    })
  })

  describe('verify()', () => {
    it('should call argon2 verify with correct values', async () => {
      const plaintext = 'some_text'
      const digest = 'some_hashed_text'
      const verifySpy = jest.spyOn(argon2, 'verify')
      await service.verify(digest, plaintext)

      expect(verifySpy).toBeCalledWith(digest, plaintext)
    })

    it('should return true when validation succeeds', async () => {
      const plaintext = 'some_text'
      const digest = 'some_hashed_text'
      const isValid = await service.verify(digest, plaintext)

      expect(isValid).toBe(true)
    })

    it('should throw if verify throws', async () => {
      jest.spyOn(argon2, 'verify').mockImplementation(() => {
        throw new Error()
      })
      const promise = service.verify('some_hashed_text', 'some_text')

      await expect(promise).rejects.toThrow()
    })
  })
})
