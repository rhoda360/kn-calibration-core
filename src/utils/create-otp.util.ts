import { randomInt } from 'crypto';

export function generateOTP(): string {
  const random = randomInt(100000, 999999); // 6-digit number
  return `${random}`;
}
