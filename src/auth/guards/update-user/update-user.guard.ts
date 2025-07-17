import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { UserRole } from 'generated/prisma';

@Injectable()
export class UpdateUserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // from JWT
    const targetUserId = request.params.id; // ID of user to update

    const isSelf = user.id === targetUserId;
    const isAdmin =
      user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ADMIN;

    // Allow access if the user is trying to update their own profile
    if (isSelf || isAdmin) {
      return true;
    }

    throw new ForbiddenException('You are not allowed to update this user.');
  }
}
