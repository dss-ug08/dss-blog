import querystring from "querystring";

import {
  getUserFromSession,
  verifyUserCredentials,
  createSession
} from "$lib/server/db.js";
import { verifyPassword } from "$lib/server/auth";
import { getUserFromCookie } from "$lib/server/session";

/**
 * If a user already has a session cookie, we should return their user object and
 * redirect them to the homepage.
 *
 * @param {Object} An object returning parameters from the request (params) and an object that allows access to cookies (cookies)
 * @returns {Promise<Object | null>} A user object, or null if not logged in.
 * @type {import("./$types").PageServerLoad}
 */
export async function load({ cookies }) {
  const sessionId = cookies.get("sessionid");
  const user = await getUserFromSession(sessionId);
  return { user };
}

/**
 * Credential verification logic happens here. If a user session is validated, we should
 * return a user session value which can be saved as a cookie on the frontend, and the user
 * should be redirected to their referring page, or the homepage is none is specified.
 * @type {import("./$types").Actions}
 */
export const actions = {
  default: async ({ request, context }) => {
    const body = await request.arrayBuffer();
    const decodedBody = new TextDecoder().decode(body);
    const formData = querystring.parse(decodedBody);
    const { username, password } = formData;

    const user = await verifyUserCredentials(username, password);

    if (!user) {
      return {
        status: 401,
        body: JSON.stringify({ message: "Invalid username or password" }),
        headers: {
          "Content-Type": "application/json"
        }
      };
    }

    const sessionId = await createSession(user.id);

    return {
      status: 200,
      body: JSON.stringify({ message: "User logged in successfully" }),
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": `sessionid=${sessionId}; Path=/; HttpOnly`
      }
    };
  }
};
