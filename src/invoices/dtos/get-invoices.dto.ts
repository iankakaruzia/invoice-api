import { Status } from '@prisma/client'
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator'
import { StatusEnum } from '../types/status.enum'

export class GetInvoicesDTO {
  @IsOptional()
  @IsEnum(StatusEnum)
  status?: Status

  @IsOptional()
  @IsNotEmpty()
  cursor?: string
}
