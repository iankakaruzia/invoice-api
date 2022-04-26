import { IsString, Matches, MaxLength, MinLength } from 'class-validator'
import { IsEqualTo } from '../decorators/is-equal-to.decorator'

export class ResetPasswordDTO {
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak!'
  })
  password: string

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak!'
  })
  @IsEqualTo('password')
  passwordConfirmation: string
}
