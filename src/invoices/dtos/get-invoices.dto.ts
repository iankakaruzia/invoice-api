import { Status } from '@prisma/client'
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator'

export class GetInvoicesDTO {
  @IsOptional()
  @IsEnum(Status)
  status?: Status

  @IsOptional()
  @IsNotEmpty()
  cursor?: string
}
