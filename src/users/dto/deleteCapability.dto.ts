import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteCapabilityDto {
    @IsString()
    @IsNotEmpty()
    value: string;
}