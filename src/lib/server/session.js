import { createSession, destroySession, getUserFromSession } from "$lib/server/db";

// Create a session
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

// Destroy the session
export async function logoutUser(sessionId) {
  await destroySession(sessionId);
}

export async function getUserFromCookie(cookieValue) {
  // Get the user from the session cookie
  return await getUserFromSession(cookieValue);
}
