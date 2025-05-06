/**
 * Generates a random password of specified length
 * @param length The length of the password to generate
 * @returns A random password string
 */
export function generateRandomPassword(length: number = 10): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
  let password = '';
  
  // Ensure we have at least one of each character type
  password += charset.charAt(Math.floor(Math.random() * 26)); // lowercase
  password += charset.charAt(26 + Math.floor(Math.random() * 26)); // uppercase
  password += charset.charAt(52 + Math.floor(Math.random() * 10)); // number
  password += charset.charAt(62 + Math.floor(Math.random() * 12)); // special char
  
  // Fill the rest of the password
  for (let i = 4; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  
  // Shuffle the password characters
  return password.split('').sort(() => Math.random() - 0.5).join('');
}
