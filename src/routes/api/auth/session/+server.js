import { error, json } from '@sveltejs/kit';
import { getUserFromSession } from "$lib/server/db.js";

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, cookies }) {
  const sessionId = cookies.get("sessionid");
  const user = await getUserFromSession(sessionId);
    return json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.is_admin
      }
    });
}
