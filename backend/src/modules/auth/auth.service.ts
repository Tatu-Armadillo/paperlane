import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../users/user.service';
import { RegisterDto, LoginDto } from './auth.dto';
import { UserEntity } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ user: UserEntity; access_token: string }> {
    const { name, username, password } = registerDto;
    
    const existingUser = await this.userService.findByUsername(username);
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userService.create(name, username, hashedPassword);

    const payload = { sub: user.id, username: user.username };
    const access_token = this.jwtService.sign(payload);

    delete user.password;
    return { user, access_token };
  }

  async login(loginDto: LoginDto): Promise<{ user: UserEntity; access_token: string }> {
    const { username, password } = loginDto;
    
    const user = await this.userService.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, username: user.username };
    const access_token = this.jwtService.sign(payload);

    delete user.password;
    return { user, access_token };
  }

  async validateUser(userId: string): Promise<UserEntity> {
    return this.userService.findById(userId);
  }
}
