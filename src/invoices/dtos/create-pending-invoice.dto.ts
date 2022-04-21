import { Type } from 'class-transformer'
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested
} from 'class-validator'

class BillFrom {
  @IsString()
  @IsNotEmpty()
  address: string

  @IsString()
  @IsNotEmpty()
  city: string

  @IsString()
  @IsNotEmpty()
  country: string

  @IsString()
  @IsNotEmpty()
  postcode: string
}

class BillTo {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsEmail()
  email: string

  @IsString()
  @IsNotEmpty()
  address: string

  @IsString()
  @IsNotEmpty()
  city: string

  @IsString()
  @IsNotEmpty()
  country: string

  @IsString()
  @IsNotEmpty()
  postcode: string
}

class Item {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsNumber()
  @IsNotEmpty()
  quantity: number

  @IsNumber({ maxDecimalPlaces: 2 })
  price: number
}

export class CreatePendingInvoiceDTO {
  @IsDateString()
  date: Date

  @IsString()
  @IsNotEmpty()
  description: string

  @IsIn([1, 7, 14, 30])
  paymentTerm: number

  @ValidateNested()
  @IsObject()
  @Type(() => BillFrom)
  billFrom: BillFrom

  @ValidateNested()
  @IsObject()
  @Type(() => BillTo)
  billTo: BillTo

  @ValidateNested({ each: true })
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => Item)
  items: Item[]
}
