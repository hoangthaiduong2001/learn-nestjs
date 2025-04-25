import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthResponse } from './dto/auth-response';
import { LoginInput } from './dto/login.input';

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
}
