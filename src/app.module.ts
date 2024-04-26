import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from './auth/guards/auth.guard';
import { AutorizationGuard } from './auth/guards/autorization.guard';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      name: process.env.DB_LOCAL,
      type: 'mysql',
      port: 3306,
      host: 'localhost',
      username: 'root',
      password: 'password',
      database: 'alfred24_api',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: AutorizationGuard },
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
  ],
})
export class AppModule { }
