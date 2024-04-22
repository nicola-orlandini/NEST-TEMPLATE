import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LockerModule } from './locker/locker.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './common/response/response.interceptor';
import { TrakingController } from './traking/traking.controller';
import { TrakingService } from './traking/traking.service';
import { TrakingModule } from './traking/traking.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    LockerModule,
    TrakingModule,
    AuthModule,
    UsersModule
  ],
  controllers: [
    AppController,
    TrakingController
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    AppService,
    TrakingService
  ],
})

export class AppModule { }
