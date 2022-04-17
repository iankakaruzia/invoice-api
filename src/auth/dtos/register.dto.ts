import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength
} from 'class-validator'
import { IsEqualTo } from '../decorators/is-equal-to.decorator'

export class RegisterDTO {
  @IsEmail()
  email: string

  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @MinLength(8)
  @MaxLength(30)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak!'
  })
  password: string

  @IsString()
  @IsEqualTo('password')
  passwordConfirmation: string
}
