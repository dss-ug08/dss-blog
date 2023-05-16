import { error, json } from '@sveltejs/kit';
import * as DB from "$lib/server/db.js";
import * as Utils from "$lib/server/utils.js";

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, cookies }) {
  const sessionId = cookies.get("sessionid");
  if (!sessionId) throw error(401, "Unauthorized");

  const user = await DB.getUserFromSession(sessionId);
  if (!user.id) throw error(401, "Unauthorized");

  //TODO: super heavy to generate for each page, should be done once and cached
  user.avatar = Utils.gravatar(user.email);

  return json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.is_admin,
      avatar: user.avatar,
    }
  });
}

//TODO: this is duplicated by, and may be moved to, the /auth/logout route
/** @type {import('./$types').RequestHandler}*/
export async function DELETE({ url, cookies }) {
  const sessionId = cookies.get("sessionid");
  if (!sessionId) throw error(401, "Unauthorized");

  const user = await DB.getUserFromSession(sessionId);
  if (!user.id) throw error(401, "Unauthorized");

  cookies.delete("sessionid", { path: "/" });

  return json({
    message: "Logged out successfully."
  });
}
