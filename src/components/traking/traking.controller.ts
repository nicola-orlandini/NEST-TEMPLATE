import { Controller, Get, Param } from '@nestjs/common';
import { TrakingService } from './traking.service';
import { GetBarcodeDto } from './dto/getBarcode.dto';
import { SkipThrottle } from '@nestjs/throttler';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Traking spedizione')
@SkipThrottle()
@Controller('traking')
export class TrakingController {
  constructor(private trakingService: TrakingService) {}

  @Get('barcode/:barcode')
  async getBarcode(@Param() getBarcodeDto: GetBarcodeDto) {
    return await this.trakingService.getBarcode(getBarcodeDto.barcode);
  }
}
