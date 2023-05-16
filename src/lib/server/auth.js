import bcrypt from "bcrypt";

import * as DB from "./db";
import * as Utils from "./utils";

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

/**
 * Looks up a given session ID into a user object, validating the session, and returning the user object.
 * 
 * @param {string} [sessionid] - The session ID to look up.
 * @param {object} [options] - Options for the permissions check.
 * @param {boolean} [options.admin] - Whether or not to check if a user is an admin.
 * @throws {Error} If the session ID is missing, invalid, or expired, or if the user does not have the requested permissions.
 * @returns {Promise<object>} The user object.
 */
export async function checkPermissions(sessionid, {admin=false}={}) {
  const debug = new Utils.Debugger("server:auth:checkPermissions");
  debug.log(`Checking permissions for session ID:  ${sessionid}`);
  
  //const sessionid = cookies.get("sessionid");
  // Did we get a session ID?
  if (!sessionid) throw new Error("Session ID was missing or invalid");
  debug.log(`ID exists.`);

  // Is the session ID still valid?
  if (await DB.hasSessionExpired(sessionid)) {
    DB.destroySession(sessionid);
    throw new Error("Session has expired");
  }
  debug.log("Session is still valid.");

  // Is the session ID actually associated with a user?
  const user = await DB.getUserFromSession(sessionid);
  if (!user) throw new Error("Session ID was not associated with a user");
  debug.log("Session ID is associated with a user.");

  // If we're checking for admin permissions, is the user an admin?
  if (admin && !user.is_admin) throw new Error("User does not have permission to access this page");
  debug.log("User has permission to access this page.");

  // If we passed all the checks, return the user object.
  debug.log(`Approving access for session id ${sessionid} for user ${user.username}`);
  return user;
}
