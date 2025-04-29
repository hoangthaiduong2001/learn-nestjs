import { JwtService } from '@nestjs/jwt';
import { UserRole } from 'src/users/schemas/user.schema';

type TPayload = {
  sub: string;
  name: string;
  role: UserRole;
  iat: number;
  exp: number;
};

export function decodeToken(token: string): TPayload {
  const jwtService = new JwtService();
  const payload = jwtService.decode(token);
  return payload;
}
