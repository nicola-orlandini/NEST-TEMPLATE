import { IsNotEmpty, IsString } from 'class-validator';

export class GetBarcodeDto {
  @IsString()
  @IsNotEmpty()
  barcode: string;
}
