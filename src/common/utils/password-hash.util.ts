import bcrypt from 'bcrypt';

/**
 * Hashes a plain text password using bcrypt.
 * @param plainPassword The password to hash.
 * @param saltOrRounds The number of salt rounds (default: 10).
 * @returns A Promise resolving to the hashed password.
 */
export async function hashPassword(
  plainPassword: string,
  saltOrRounds = 10,
): Promise<string> {
  return bcrypt.hash(plainPassword, saltOrRounds);
}

export const comparePasswordHash = async (
  plain: string,
  hash: string,
): Promise<boolean> => {
  return bcrypt.compare(plain, hash);
};
