import { error } from "@sveltejs/kit";
import * as DB from "$lib/server/db.js";
import * as Auth from "$lib/server/auth.js";
import * as Utils from "$lib/server/utils.js";

/**
 * @typedef {import('$lib/types').User} User
 */

/**
 * Load users from the database for the admin users page.
 *
 * @returns {Promise<{users: ArrayLike<User>}>} An array of users.
 * @type {import('../$types').PageServerLoad}
 */
export async function load({ params, cookies }) {
  const debug = new Utils.Debugger("routes:admin:users:load");
  // Auth check
  try {
    await Auth.checkPermissions(cookies.get('sessionid'), { admin: true});
  } catch (err) {
    debug.error(err);
    throw error(403, "Forbidden");
  }
  // End auth check

  const users = await DB.getUsers({});

  for (let user of users) {
    user.avatar = Utils.gravatar(user.email);
  }

  return {
    users,
    /*
    users: [
      {
        id: 1,
        username: "testuser",
        email: "testuser@example.com",
        avatar: "https://daisyui.com/tailwind-css-component-profile-2@56w.png",
        created_at: "2021-08-01 00:00:00",
        updated_at: "2021-08-01 00:00:00",
        is_admin: true,
      }
    ]
    */
  };
}
