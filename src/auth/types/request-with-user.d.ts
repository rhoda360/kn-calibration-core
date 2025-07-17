import { Request } from 'express';
import { UserRole } from 'generated/prisma';

export interface RequestWithUser extends Request {
  user: {
    id: string;
    role: UserRole;
  };
}
