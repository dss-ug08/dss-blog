import {
  createSession,
  destroySession,
  getUserFromSession,
  verifyUserCredentials
} from "$lib/server/db";


/**
 * loginUser function takes the user's username and password, verifies the credentials,
 * and creates a new session for the user if the credentials are valid.
 *
 * @param {string} username - The user's username.
 * @param {string} password - The user's password.
 * @returns {Promise<{sessionId: string, user: Object}>} - If successful, returns an object containing the sessionId and user object.
 * @throws {Error} If credentials are invalid.
 */
export async function loginUser(username, password) {
  // Verify user credentials and get the user from the database
  const user = await verifyUserCredentials(username, password);

  if (user) {
    const sessionId = await createSession(user);

    return {
      sessionId,
      user
    };
  } else {
    throw new Error("Invalid credentials");
  }
}

/**
 * logoutUser function takes a sessionId and destroys the session associated with it.
 *
 * @param {string} sessionId - The sessionId to be destroyed.
 * @returns {Promise<void>} - Resolves when the session has been destroyed.
 */
export async function logoutUser(sessionId) {
  await destroySession(sessionId);
}

/**
 * getUserFromCookie function takes a cookieValue (sessionId) and retrieves the associated user information.
 *
 * @param {string} cookieValue - The sessionId stored in the cookie.
 * @returns {Promise<Object|null>} - Returns the user object associated with the sessionId or null if no such user is found.
 */
export async function getUserFromCookie(cookieValue) {
  // Get the user from the session cookie
  return await getUserFromSession(cookieValue);
}
