import { IsNotEmpty, IsString } from 'class-validator';

export class InsertCapabilityDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
