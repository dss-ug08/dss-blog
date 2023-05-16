import { error } from "@sveltejs/kit";
import * as DB from "$lib/server/db.js";
import * as Utils from "$lib/server/utils.js";
import * as Auth from "$lib/server/auth.js";

/**
 * Retrieves stats from the database for display on the admin dashboard.
 *
 * @returns {Promise<{stats: {users: number, posts: number, comments: number}}>} The stats object.
 * @type {import('./$types').PageServerLoad}
 */
export async function load({ params, cookies }) {
  const debug = new Utils.Debugger("routes:admin:posts:slug:load");
  // Auth check
  try {
    await Auth.checkPermissions(cookies.get('sessionid'), { admin: true});
  } catch (err) {
    debug.error(err);
    throw error(403, "Forbidden");
  }
  // End auth check

  const stats = await DB.getStats();

  console.dir(stats);

  return {
    stats,
  };
}
