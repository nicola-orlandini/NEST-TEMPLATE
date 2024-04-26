import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstant } from './costants/jwtCostant';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entity/users.entity';
import { Capability } from 'src/users/entity/capabilities.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Capability], 'alfred24_ApiLocale'),
    JwtModule.register({
      global: true,
      secret: jwtConstant.secret,
      signOptions: {
        expiresIn: '8h'
      },
    }),
    UsersModule,
  ],
  controllers: [
    AuthController
  ],
  providers: [
    AuthService,
  ]
})
export class AuthModule { }
