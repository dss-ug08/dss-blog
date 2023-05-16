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
export async function load({ params }) {
  /** @type {User} */
  const user = {
    id: 1,
    username: "testuser",
    email: "someone@example.com",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_admin: false,
    avatar: await Utils.gravatar("jack@mawersoft.co.uk"),
  };

  return {
    user
  }
}
