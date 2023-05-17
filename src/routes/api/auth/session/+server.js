import { error, json } from '@sveltejs/kit';
import * as DB from "$lib/server/db.js";
import * as Utils from "$lib/server/utils.js";

/**
 * @typedef { import("$lib/types").User } User
 */

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, cookies }) {
  const sessionId = cookies.get("sessionid");
  if (!sessionId) throw error(401, "Unauthorized");

  /** @type {User} */
  const user = await DB.getUserFromSession(sessionId);
  if (!user.id) throw error(401, "Unauthorized");

  //TODO: super heavy to generate for each page, should be done once and cached
  user.avatar = Utils.gravatar(user.email);

  return json({
    /** @type {User} */
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      is_admin: user.is_admin,
      avatar: user.avatar,
      created_at: user.created_at,
      updated_at: user.updated_at,
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
