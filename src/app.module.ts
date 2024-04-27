import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { AutorizationGuard } from './guards/autorization.guard';
import { TrakingModule } from './traking/traking.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstant } from './auth/costants/jwtCostant';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    JwtModule.register({
      global: true,
      secret: jwtConstant.secret,
      signOptions: {
        expiresIn: process.env.JWT_EXP || '8h',
      },
    }),
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
    TrakingModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: AutorizationGuard },
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
  ],
})
export class AppModule {}
