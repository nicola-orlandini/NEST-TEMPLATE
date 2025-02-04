import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { User } from 'src/components/users/entity/users.entity';
import { Capability } from './entity/capabilities.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [User, Capability],
      process.env.DB_NAMESPACE,
    ),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
