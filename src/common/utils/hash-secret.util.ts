import * as argon2 from 'argon2';
export const hashSecret = async (password: string): Promise<string> => {
  return await argon2.hash(password);
};
