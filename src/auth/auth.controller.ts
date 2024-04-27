import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { RegisterDto } from './dto/register.dto';
import { Role, Roles } from './decorators/autorization.decorator';
import { SkipThrottle } from '@nestjs/throttler';
// import { SkipThrottle, Throttle, ThrottlerGuard } from '@nestjs/throttler';

@SkipThrottle()
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }
    
    @SkipThrottle({ default: false })
    @Public()
    @Post('login')
    signIn(@Body() signInDto: SignInDto) {
        return this.authService.signIn(signInDto.username, signInDto.password);
    }

    @Post('register')
    @Roles(Role.SuperAdmin)
    register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto.username, registerDto.password);
    }
}
