import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
const { combine, timestamp, json } = winston.format;

@Injectable()
export class WinstonLoggerService {
  private readonly logger: winston.Logger;
  constructor() {
    this.logger = winston.createLogger({
      transports: [
        new winston.transports.DailyRotateFile({
          filename: 'api.alfred24-%DATE%.log',
          level: 'warn',
          datePattern: 'YYYY-MM-DD',
          maxSize: '10M', // max sixe 20mb
          maxFiles: '14d', // delete after 14gg
          dirname: './logs',
          format: combine(timestamp(), json()),
        }),
        new winston.transports.Console({
          level: 'debug',
        }),
      ],
    });
  }
  log(message: string, level: string = 'info') {
    this.logger.log({
      message,
      level,
    });
  }
  error(message: string, error?: Error) {
    this.logger.error({
      message,
      error,
    });
  }
}
