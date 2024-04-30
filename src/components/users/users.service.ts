import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/components/users/entity/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InsertCapabilityDto } from './dto/insertCapability.dto';
import { Capability } from './entity/capabilities.entity';
import { InsertCapabilityInUserDto } from './dto/insertCapabilityInUser.dto';
import { WinstonLoggerService } from 'src/services/winston.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User, process.env.DB_NAMESPACE_LOCAL)
    private userRepository: Repository<User>,

    @InjectRepository(Capability, process.env.DB_NAMESPACE_LOCAL)
    private capabilityRepository: Repository<Capability>,

    private winstonLoggerService: WinstonLoggerService,
  ) { }

  async getUser(username: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { username: username },
      });
      if (!user) {
        throw new HttpException('user not found', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      this.winstonLoggerService.error(
        `[users.service.ts][getUser]: ${error.message}`,
      );
      throw error;
    }
  }

  async getCapabilities() {
    try {
      const capabilities = await this.capabilityRepository.find({});
      return capabilities;
    } catch (error) {
      this.winstonLoggerService.error(
        `[users.service.ts][getCapabilities]: ${error.message}`,
      );
      throw error;
    }
  }

  async deleteCapability(username: string, value: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { username: username },
      });
      const index = user.capabilities.findIndex((item) => item.value === value);
      if (index >= 0) {
        user.capabilities.splice(index, 1);
        await this.userRepository.save(user);
      } else {
        throw new HttpException('capabilities not found', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      this.winstonLoggerService.error(
        `[users.service.ts][deleteCapability]: ${error.message}`,
      );
      throw error;
    }
  }

  async insertCapability(insertCapabilityDto: InsertCapabilityDto) {
    try {
      const isCapability = await this.capabilityRepository.findOne({
        where: { value: insertCapabilityDto.name },
      });
      if (isCapability) {
        throw new HttpException(
          'capability already exist',
          HttpStatus.CONFLICT,
        );
      }
      const capability = new Capability();
      capability.value = insertCapabilityDto.name;
      capability.level = 1;
      return await this.capabilityRepository.save(capability);
    } catch (error) {
      this.winstonLoggerService.error(
        `[users.service.ts][insertCapability]: ${error.message}`,
      );
      throw error;
    }
  }

  async insertCapabilityinUser(
    username: string,
    insertCapabilityInUserDto: InsertCapabilityInUserDto,
  ) {
    try {
      const user = await this.userRepository.findOne({
        where: { username: username },
      });
      if (!user) {
        throw new HttpException('user not found', HttpStatus.NOT_FOUND);
      }
      if (user && user.capabilities) {
        for (const cap of user.capabilities) {
          if (cap.value == insertCapabilityInUserDto.name) {
            throw new HttpException(
              'capability already match for user',
              HttpStatus.CONFLICT,
            );
          }
        }
      }
      const capability = await this.capabilityRepository.findOne({
        where: { value: insertCapabilityInUserDto.name },
      });
      if (!capability) {
        throw new HttpException('capability not found', HttpStatus.NOT_FOUND);
      }
      let levelUserCapabilities: number = 1;
      for (const cap of user.capabilities) {
        if (cap.level > levelUserCapabilities) {
          levelUserCapabilities = cap.level;
        }
      }
      if (levelUserCapabilities < capability.level) {
        throw new HttpException(
          'not permission match this capabilities',
          HttpStatus.UNAUTHORIZED,
        );
      }
      if (Object.keys(user.capabilities).length > 0) {
        user.capabilities.push(capability);
      } else {
        user.capabilities = [capability];
      }
      await this.userRepository.save(user);
      return `"${insertCapabilityInUserDto.name}" capability insert in user "${username}"`;
    } catch (error) {
      this.winstonLoggerService.error(
        `[users.service.ts][insertCapabilityinUser]: ${error.message}`,
      );
      throw error;
    }
  }
}
