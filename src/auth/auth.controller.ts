import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { RegisterDto } from './dto/register.dto';
import { Role, Roles } from './decorators/autorization.decorator';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

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
