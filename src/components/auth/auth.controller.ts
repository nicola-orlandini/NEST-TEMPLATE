import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';
import { Public } from 'src/decorators/public.decorator';
import { RegisterDto } from './dto/register.dto';
import { Role, Roles } from '../../decorators/autorization.decorator';
import { Throttle } from '@nestjs/throttler';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Autenticazione')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ description: 'Login di autenticazione' })
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @Public()
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @ApiOperation({ description: 'Crea un utente nuovo' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token ottenuto dalla login',
  })
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('register')
  @Roles(Role.SuperAdmin)
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(
      registerDto.username,
      registerDto.password,
    );
  }
}
