import { Theme } from '@prisma/client'
import { IsEnum } from 'class-validator'

enum ThemeEnum {
  LIGHT = 'LIGHT',
  DARK = 'DARK'
}

export class UpdateThemeDTO {
  @IsEnum(ThemeEnum)
  theme: Theme
}
