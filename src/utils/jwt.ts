import { JwtService } from '@nestjs/jwt';

type TPayload = {
  sub: string;
  name: string;
  iat: number;
  exp: number;
};

export function decodeToken(token: string): TPayload {
  const jwtService = new JwtService();
  const payload = jwtService.decode(token);
  return payload;
}
