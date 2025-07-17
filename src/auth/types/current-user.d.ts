import { UserRole } from 'generated/prisma';

export type CurrentUser = {
  id: string;
  role: UserRole;
};
