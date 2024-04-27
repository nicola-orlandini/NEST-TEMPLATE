import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from './auth/guards/auth.guard';
import { AutorizationGuard } from './auth/guards/autorization.guard';
import { TrakingModule } from './traking/traking.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      name: process.env.DB_NAMESPACE_LOCAL,
      type: 'mysql',
      port: parseInt(process.env.MYSQL_PORT) || 3306,
      host: process.env.MYSQL_HOST,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forRoot({
      name: process.env.DB_NAMESPACE_ALFRED,
      type: 'mysql',
      port: parseInt(process.env.MYSQL_PORT_FORWARD) || 3307,
      host: process.env.MYSQL_HOST_REMOTE,
      username: process.env.MYSQL_USER_REMOTE,
      password: process.env.MYSQL_PASSWORD_REMOTE,
      database: process.env.MYSQL_DATABASE_REMOTE,
      autoLoadEntities: true,
      synchronize: false,
    }),
    UsersModule,
    AuthModule,
    TrakingModule
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: AutorizationGuard },
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
  ],
})
export class AppModule { }
