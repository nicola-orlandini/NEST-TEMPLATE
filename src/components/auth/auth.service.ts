import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/components/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entity/users.entity';
import * as bcrypt from 'bcrypt';
import { Capability } from 'src/components/users/entity/capabilities.entity';
import { WinstonLoggerService } from 'src/services/winston.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Capability, process.env.DB_NAMESPACE)
    private capabilityRepository: Repository<Capability>,
    @InjectRepository(User, process.env.DB_NAMESPACE)
    private userRepository: Repository<User>,
    private usersService: UsersService,
    private jwtService: JwtService,
    private winstonLoggerService: WinstonLoggerService,
  ) {}

  async signIn(username: string, pass: string): Promise<any> {
    try {
      if (!username || !pass) {
        throw new HttpException('credenziali mancanti', HttpStatus.NOT_FOUND);
      }
      const user = await this.usersService.getUser(username);
      if (!bcrypt.compare(pass, user?.password)) {
        throw new HttpException('credenziali errate', HttpStatus.UNAUTHORIZED);
      }
      const payload = {
        uuid: user.uuid,
        username: user.username,
        capabilities: user.capabilities,
      };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      this.winstonLoggerService.error(
        `[auth.service.ts][signIn]: ${error.message}`,
      );
      throw error;
    }
  }

  async register(username: string, pass: string): Promise<any> {
    try {
      const capability = await this.capabilityRepository.findOne({
        where: { value: 'user' },
      });
      const hashedPassword = await bcrypt.hash(pass, 10);
      const newUser = this.userRepository.create({
        username: username,
        password: hashedPassword,
        capabilities: [capability],
      });
      return await this.userRepository.save(newUser);
    } catch (error) {
      this.winstonLoggerService.error(
        `[auth.service.ts][register]: ${error.message}`,
      );
      throw error;
    }
  }
}
