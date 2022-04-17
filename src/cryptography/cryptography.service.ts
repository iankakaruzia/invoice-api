import { Injectable } from '@nestjs/common'
import * as argon2 from 'argon2'

@Injectable()
export class CryptographyService {
  async hash(plaintext: string): Promise<string> {
    return argon2.hash(plaintext)
  }

  async verify(digest: string, plaintext: string): Promise<boolean> {
    return argon2.verify(digest, plaintext)
  }
}
