import { Type } from 'class-transformer'
import {
  ArrayNotEmpty,
  IsDateString,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator'

class BillTo {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string

  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  email?: string

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  address?: string

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  city?: string

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  country?: string

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  postcode?: string
}

class Item {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string

  @IsNumber()
  @IsOptional()
  quantity?: number

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  price?: number
}

class BillFrom {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  address?: string

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  city?: string

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  country?: string

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  postcode?: string
}

export class CreateDraftInvoiceDTO {
  @IsDateString()
  @IsOptional()
  date?: Date

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string

  @IsIn([1, 7, 14, 30])
  @IsOptional()
  paymentTerm?: number

  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => BillFrom)
  billFrom?: BillFrom

  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => BillTo)
  billTo?: BillTo

  @ValidateNested({ each: true })
  @IsOptional()
  @ArrayNotEmpty()
  @Type(() => Item)
  items?: Item[]
}
