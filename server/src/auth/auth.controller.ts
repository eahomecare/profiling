import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('signup')
  @HttpCode(HttpStatus.OK)
  async signup(@Body('email') email: string, @Body('password') password: string, @Body('roleName') roleName: string) {
    return this.authService.signup(email, password, roleName);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body('email') email: string, @Body('password') password: string) {
    return this.authService.signin(email, password);
  }
}
