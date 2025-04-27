import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RefreshToken } from 'src/users/schemas/refreshToken.schema';
import { User } from 'src/users/schemas/user.schema';
import { decodeToken } from 'src/utils/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectModel(RefreshToken.name) private refreshTokenModel: Model<RefreshToken>,
  ) {}

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.usersService.findOneByEmail(email);
    if (user) {
      const isValid = await this.usersService.isValidPassword(pass, user.password);
      if (isValid) {
        return user;
      }
    }
    return null;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);

    if (!user) throw new UnauthorizedException('Invalid credentials');
    const existingRefreshToken = await this.refreshTokenModel.findOne({ userId: user.id });

    if (existingRefreshToken) {
      throw new UnauthorizedException('User already logged in.');
    }
    const payload = { sub: user.id, name: user.name };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      expiresIn: '15m',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      expiresIn: '7d',
    });
    const decodedToken = decodeToken(refreshToken);
    await this.refreshTokenModel.create({
      userId: user.id,
      name: user.name,
      token: refreshToken,
      iat: new Date(decodedToken.iat * 1000),
      exp: new Date(decodedToken.exp * 1000),
      createAt: new Date(),
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(refreshToken: string) {
    return this.refreshTokenModel.deleteOne({ token: refreshToken });
  }
}
