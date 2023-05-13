import { error } from "@sveltejs/kit";
import * as DB from "$lib/server/db.js";
import * as Utils from "$lib/server/utils.js";

/**
 * //TODO
 *
 * @returns {} //TODO
 * @type {import('./$types').PageServerLoad}
 */
export async function load({ params }) {
  const stats = await DB.getStats();

  console.dir(stats);

  return {
    stats,
  };
}
