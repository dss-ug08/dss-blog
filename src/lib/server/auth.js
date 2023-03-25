import bcrypt from "bcrypt";

export async function verifyPassword(password, passwordHash) {
  try {
    return await bcrypt.compare(password, passwordHash);
  } catch (error) {
    console.error("Error verifying password:", error);
    return false;
  }
}
