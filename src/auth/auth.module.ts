import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entity/users.entity';
import { Capability } from 'src/users/entity/capabilities.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [User, Capability],
      process.env.DB_NAMESPACE_LOCAL,
    ),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
