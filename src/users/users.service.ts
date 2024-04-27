import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/users/entity/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InsertCapabilityDto } from './dto/insertCapability.dto';
import { Capability } from './entity/capabilities.entity';
import { InsertCapabilityInUserDto } from './dto/insertCapabilityInUser.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User, process.env.DB_NAMESPACE_LOCAL)
        private userRepository: Repository<User>,

        @InjectRepository(Capability, process.env.DB_NAMESPACE_LOCAL)
        private capabilityRepository: Repository<Capability>

    ) { }

    async getUser(username: string) {
        const user = await this.userRepository.findOne({ where: { username: username } });
        if (!user) {
            throw new HttpException('user not found', HttpStatus.NOT_FOUND);
        }
        return user;
    }

    async getCapabilities() {
        const capabilities = await this.capabilityRepository.find({});
        return capabilities;
    }

    async deleteCapability(username: string, value: string) {
        const user = await this.userRepository.findOne({ where: { username: username } });
        const index = user.capabilities.findIndex(item => item.value === value);
        if (index >= 0) {
            user.capabilities.splice(index, 1);
            await this.userRepository.save(user);
        } else {
            throw new HttpException('capabilities not found', HttpStatus.NOT_FOUND);
        }
    }

    async insertCapability(insertCapabilityDto: InsertCapabilityDto) {
        const isCapability = await this.capabilityRepository.findOne({ where: { value: insertCapabilityDto.value } });
        if (isCapability) {
            throw new HttpException('capability already exist', HttpStatus.CONFLICT);
        }
        const capability = new Capability();
        capability.value = insertCapabilityDto.value;
        capability.level = 1;
        return await this.capabilityRepository.save(capability);
    }

    async insertCapabilityinUser(username: string, insertCapabilityInUserDto: InsertCapabilityInUserDto) {
        const user = await this.userRepository.findOne({ where: { username: username } });
        if (!user) {
            throw new HttpException('user not found', HttpStatus.NOT_FOUND);
        }
        if (user && user.capabilities) {
            for (const cap of user.capabilities) {
                if (cap.value == insertCapabilityInUserDto.value) {
                    throw new HttpException('capability already match for user', HttpStatus.CONFLICT);
                }
            }
        }
        const capability = await this.capabilityRepository.findOne({ where: { value: insertCapabilityInUserDto.value } });
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
            throw new HttpException('not permission match this capabilities', HttpStatus.UNAUTHORIZED);
        }
        if (Object.keys(user.capabilities).length > 0) {
            user.capabilities.push(capability);
        } else {
            user.capabilities = [capability];
        }
        await this.userRepository.save(user);
        return `"${insertCapabilityInUserDto.value}" capability insert in user "${username}"`;
    }
}
