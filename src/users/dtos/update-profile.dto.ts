import { IsNotEmpty, IsString } from 'class-validator'

export class UpdateProfileDTO {
  @IsString()
  @IsNotEmpty()
  name: string
}
