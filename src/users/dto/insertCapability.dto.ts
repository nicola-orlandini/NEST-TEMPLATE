import { IsNotEmpty, IsString } from 'class-validator';

export class InsertCapabilityDto {
    @IsString()
    @IsNotEmpty()
    value: string;
}