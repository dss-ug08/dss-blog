import * as DB from "$lib/server/db.js";
import { verifyPassword } from "$lib/server/auth";
import { getUserFromCookie } from "$lib/server/session";
import { fail, json, redirect } from "@sveltejs/kit";

/**
 * If a user already has a session cookie, we should return their user object and
 * redirect them to the homepage.
 *
 * @returns {Promise<Object | null>} A user object, or null if not logged in.
 * @type {import("./$types").PageServerLoad}
 */
export async function load({ cookies }) {
  const sessionid = cookies.get("sessionid");
  if (!sessionid) return null;

  const user = await DB.getUserFromSession(sessionid);
  if (!user) return null;

  // If the user is already logged in, redirect them to the home page
  throw redirect(307, '/');
}

/**
 * Credential verification logic happens here. If a user session is validated, we should
 * return a user session value which can be saved as a cookie on the frontend, and the user
 * should be redirected to their referring page, or the homepage is none is specified.
 *
 * @type {import("./$types").Actions}
 */
export const actions = {
  default: async ({ request, cookies }) => {
    //TODO: Return passed form data back to the user if there is an error

    // Set a standard error message to avoid leaking specific error information
    const standardErrorMessage = "Your account could not be created. Make sure your account doesn't already exist, and your details meet all of the requirements.";

    // Read data from the form submission
    const data = await request.formData();
    const username = data.get("username");
    const password = data.get("password");

    // Verify the submitted user credentials
    const user = await DB.verifyUserCredentials(username, password);

    // TODO: possible security improvements:
    // - rate limiting per IP address
    // - lockout after a certain number of failed attempts of a given username
    // - randomize response time to prevent timing attacks

    // If the user credentials are invalid, return a 401 status with an error message
    if (!user) return fail(401, { success: false, message: "Invalid username or password." });

    // If the credentials are valid, create a session and return the session ID as a cookie
    const sessionId = await DB.createSession(user.id);
    const isSecure = request.headers.get("x-forwarded-proto") === "https";
    cookies.set("sessionid", sessionId, { path: "/", httpOnly: true, sameSite: 'strict', secure: isSecure, maxAge: 60 * 60 * 24 * 30 });

    return json({ success: true, message: "Login successful." });

  }
};


