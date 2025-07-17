// src/common/types/express-request.ts
import { Request } from 'express';
import { CurrentUser } from 'src/auth/types/current-user';

export interface AuthenticatedRequest extends Request {
  user: CurrentUser;
}
