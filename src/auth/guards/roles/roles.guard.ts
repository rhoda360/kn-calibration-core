import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { ROLES_KEY } from 'src/common/decorators/role.decorator';
import { AuthenticatedRequest } from 'src/common/types/express-request';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const authorizedRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!authorizedRoles || authorizedRoles.length === 0) {
      return true; // No roles specified = allow access
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user) return false;

    const hasAuthorizedRole = authorizedRoles.some(
      (role) => role === user.role,
    );
    return hasAuthorizedRole;
  }
}
