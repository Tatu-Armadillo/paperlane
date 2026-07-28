import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // @Post('register')
  // @ApiOperation({ summary: 'Register a new user' })
  // @ApiResponse({ status: 201, description: 'User successfully registered' })
  // @ApiResponse({ status: 409, description: 'Username already exists' })
  // async register(@Body() registerDto: RegisterDto) {
  //   return this.authService.register(registerDto);
  // }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // @Get('me')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Get current user' })
  // @ApiResponse({ status: 200, description: 'User data returned' })
  // @ApiResponse({ status: 401, description: 'Unauthorized' })
  // async getMe(@Request() req) {
  //   const user = { ...req.user };
  //   delete user.password;
  //   return user;
  // }
}
