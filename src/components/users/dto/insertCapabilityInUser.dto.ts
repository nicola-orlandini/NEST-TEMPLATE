import { IsNotEmpty, IsString } from 'class-validator';

export class InsertCapabilityInUserDto {
  @IsString()
  @IsNotEmpty()
  value: string;
}
