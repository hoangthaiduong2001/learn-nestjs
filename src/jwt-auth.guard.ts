import { ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { MY_PUBLIC_KEY, MY_ROLE_KEY } from './constants/public.constant';
import { User, UserRole } from './users/schemas/user.schema';

@Injectable()
export class GqlJwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(MY_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }
    const can = await super.canActivate(context);
    if (!can) return false;

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(MY_ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;

    const request = this.getRequest(context);
    const user: User = request.user;

    if (!user) return false;

    if (user.role === UserRole.ADMIN) return true;

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(`Role user is not allowed`);
    }

    return requiredRoles.includes(user.role);
  }
}
