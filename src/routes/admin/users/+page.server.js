import { error } from "@sveltejs/kit";
import * as DB from "$lib/server/db.js";
import * as Utils from "$lib/server/utils.js";

/**
 * @typedef {import('./$types').User} User
 */

/**
 * Load users from the database for the admin users page.
 *
 * @returns {Promise<ArrayLike<User>>} An array of users.
 * @type {import('../$types').PageServerLoad}
 */
export async function load({ params }) {
  return {
    users: [
      {
        id: 1,
        username: "testuser",
        email: "testuser@example.com",
        avatarurl: "https://daisyui.com/tailwind-css-component-profile-2@56w.png",
        updated_at: "2021-08-01 00:00:00",
        is_admin: true,
      }
    ]
  };
}