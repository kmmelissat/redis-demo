import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsPositive,
  MaxLength,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;
}
