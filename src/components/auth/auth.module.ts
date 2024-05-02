import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/components/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entity/users.entity';
import { Capability } from 'src/components/users/entity/capabilities.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [User, Capability],
      process.env.DB_NAMESPACE,
    ),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
