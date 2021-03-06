import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  UploadApiOptions,
  UploadApiResponse,
  v2 as cloudinary
} from 'cloudinary'
import { ReadStream } from 'fs'
import internal from 'stream'

@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET')
    })
  }

  async uploadStream(
    readStream: ReadStream | internal.Readable,
    options?: UploadApiOptions
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const cloudStream = cloudinary.uploader.upload_stream(
        options,
        function (err, fileUploaded) {
          if (fileUploaded) {
            resolve(fileUploaded)
          } else {
            reject(err)
          }
        }
      )

      readStream.pipe(cloudStream)
    })
  }
}
