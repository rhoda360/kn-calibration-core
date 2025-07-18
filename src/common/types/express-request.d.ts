import { Request } from 'express';
import { CurrentUser } from '../auth/types/current-user';

export interface AuthenticatedRequest extends Request {
  user: CurrentUser;
}
