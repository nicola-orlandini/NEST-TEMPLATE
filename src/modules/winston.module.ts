import { Global, Module } from '@nestjs/common';
import { WinstonLoggerService } from 'src/services/winston.service';

@Global()
@Module({
  providers: [WinstonLoggerService],
  exports: [WinstonLoggerService],
})
export class WinstonModule {}
