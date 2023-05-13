import { error } from "@sveltejs/kit";
import * as DB from "$lib/server/db.js";
import * as Utils from "$lib/server/utils.js";

/**
 * Retrieves stats from the database for display on the admin dashboard.
 *
 * @returns {Promise<{stats: {users: number, posts: number, comments: number}}>} The stats object.
 * @type {import('./$types').PageServerLoad}
 */
export async function load({ params }) {
  const stats = await DB.getStats();

  console.dir(stats);

  return {
    stats,
  };
}
