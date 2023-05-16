import { error } from "@sveltejs/kit";
import * as Utils from "$lib/server/utils.js";
import * as DB from "$lib/server/db.js";

/**
 * @typedef { import("$lib/types").User } User
 */

/**
 * 
 *
 * @returns {Promise<>} - 
 * @throws {Error} 
 * @type {import('./$types').PageServerLoad}
 */
export async function load({ params, cookies }) {
  const sessionid = cookies.get("sessionid");
  if (!sessionid) return null;

  /** @type {User} */
  const user = await DB.getUserFromSession(sessionid);
  if (!user) return null;

  user.avatar = await Utils.gravatar(user.email);

  return {
    user
  }
}
