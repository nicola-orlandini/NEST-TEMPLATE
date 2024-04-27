import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entity/users.entity';
import * as bcrypt from 'bcrypt';
import { Capability } from 'src/users/entity/capabilities.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Capability, process.env.DB_NAMESPACE_LOCAL)
        private capabilityRepository: Repository<Capability>,
        @InjectRepository(User, process.env.DB_NAMESPACE_LOCAL)
        private userRepository: Repository<User>,
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async signIn(username: string, pass: string): Promise<any> {
        const user = await this.usersService.getUser(username);
        if (!bcrypt.compare(pass, user?.password)) {
            throw new UnauthorizedException();
        }
        const payload = { uuid: user.uuid, username: user.username, capabilities: user.capabilities };
        return {
            access_token: await this.jwtService.signAsync(payload)
        };
    }

    async register(username: string, pass: string): Promise<any> {
        const capability = await this.capabilityRepository.findOne({ where: { value: 'user' } });
        const hashedPassword = await bcrypt.hash(pass, 10);
        const newUser = this.userRepository.create({ username: username, password: hashedPassword, capabilities: [capability] });
        return await this.userRepository.save(newUser);
    }
}
