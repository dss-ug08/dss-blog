import { error, fail } from "@sveltejs/kit";
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

/** @type {import('./$types').Actions} */
export const actions = {
  toggleAdmin: async ({ request }) => {
    const data = await request.formData();
    const username = await data.get("username");

    /** @type {User} */
    const user = await DB.getUserByUsername(username);
    if (!user) return fail(400, {success: false, message: `User ${username} not found.`});

    const wasAdmin = user.is_admin;

    const success = await DB.setAdmin(user.username, !wasAdmin);
    if (!success) return fail (500, {success: false, message: `Failed to set admin status for user ${user.username}.`});

    return { success: true, message: `User ${user.username} is ${wasAdmin ? 'no longer' : 'now'} an admin.`};
  },
  deleteAccount: async ({ request }) => {
    const data = await request.formData();
    const username = await data.get("username");

    /** @type {User} */
    const user = await DB.getUserByUsername(username);
    if (!user) return fail(400, {success: false, message: `User ${username} not found.`});

    // TODO: if user is the last admin, prevent deletion

    const success = await DB.deleteUser(user.id);
    if (!success) return fail(500, { success: false, message: "Failed to delete account." });

    return { success: true, message: "Account deleted successfully." };
  }
};
