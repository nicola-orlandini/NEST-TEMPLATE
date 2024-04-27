import { Controller, Get, Param } from '@nestjs/common';
import { TrakingService } from './traking.service';
import { GetBarcodeDto } from './dto/getBarcode.dto';

@Controller('traking')
export class TrakingController {
  constructor(private trakingService: TrakingService) {}

  @Get('barcode/:barcode')
  async getBarcode(@Param() param: GetBarcodeDto) {
    return await this.trakingService.getBarcode(param.barcode);
  }
}
