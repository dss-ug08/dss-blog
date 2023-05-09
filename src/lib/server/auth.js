import bcrypt from "bcrypt";

/**
 * verifyPassword function takes a plain-text password and a hashed password, and checks if they match.
 *
 * @param {string} password - The plain-text password provided by the user.
 * @param {string} passwordHash - The hashed password stored in the database.
 * @returns {Promise<boolean>} - Returns true if the plain-text password matches the hashed password, otherwise false.
 * @throws {Error} If there is an error during the password comparison process.
 */
export async function verifyPassword(password, passwordHash) {
  try {
    return await bcrypt.compare(password, passwordHash);
  } catch (error) {
    console.error("Error verifying password:", error);
    return false;
  }
}

/**
 * hashPassword function takes a plain-text password and generates a hashed password using bcrypt.
 *
 * @param {string} password - The plain-text password provided by the user.
 * @returns {Promise<string>} - Returns the hashed password.
 * @throws {Error} If there is an error during the password hashing process.
 */
export async function hashPassword(password) {
  try {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    console.error("Error hashing password:", error);
    throw error;
  }
}
