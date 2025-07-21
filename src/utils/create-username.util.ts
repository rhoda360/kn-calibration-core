import { randomInt } from 'crypto';

export function generateUserName(prefix: string): string {
  const random = randomInt(10000000, 99999999); // 8-digit number
  return `${prefix}-${random}`;
}
