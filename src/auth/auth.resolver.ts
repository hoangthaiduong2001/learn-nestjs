import { UnauthorizedException } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthResponse } from './dto/auth-response';
import { LoginInput } from './dto/login.input';
import { LogoutResponse } from './dto/logout-response';
import { RefreshTokenResponse } from './dto/refreshToken-response';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async login(@Args('loginInput') loginInput: LoginInput): Promise<AuthResponse> {
    const data = await this.authService.login(loginInput.email, loginInput.password);
    return {
      message: 'Login successfully',
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    };
  }

  @Mutation(() => LogoutResponse)
  async logout(@Args('refreshToken') refreshToken: string): Promise<LogoutResponse> {
    const result = await this.authService.logout(refreshToken);
    if (result.deletedCount === 0) {
      throw new UnauthorizedException('Invalid refresh token or already logged out.');
    }
    return {
      message: 'Logout successfully',
    };
  }

  @Mutation(() => RefreshTokenResponse)
  async refreshToken(@Args('refreshToken') refreshToken: string): Promise<RefreshTokenResponse> {
    const { accessToken, newRefreshToken } = await this.authService.refreshToken(refreshToken);
    return {
      message: 'Refresh token successfully',
      accessToken,
      refreshToken: newRefreshToken,
    };
  }
}
