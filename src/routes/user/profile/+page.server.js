import { error, fail, redirect } from "@sveltejs/kit";
import * as Utils from "$lib/server/utils.js";
import * as DB from "$lib/server/db.js";
import * as Auth from "$lib/server/auth.js";

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

  user.is_2fa_enabled = await DB.isTwoFactorEnabled(user.id);
  user.avatar = await Utils.gravatar(user.email);

  return {
    user
  }
}

/** @type {import('./$types').Actions} */
export const actions = {
  username: async ({ request, cookies }) => {
    // Get existing details
    const sessionid = cookies.get("sessionid");
    const user = await DB.getUserFromSession(sessionid);

    // Get new details
    const data = await request.formData();
    const newUsername = data.get("username")?.toString();
    if (!newUsername) return fail(400, { success: false, message: "Username cannot be empty." });

    const possiblyExistingUser = await DB.getUserByUsername(newUsername);
    if (possiblyExistingUser) return fail(400, { success: false, message: "Username invalid or already taken." });

    await DB.modifyUser(user.id, newUsername, undefined, undefined);
    //TODO: catch errors here

    return { success: true, message: "Username updated successfully." };
  },
  email: async ({ request, cookies }) => {
    // Get existing details
    const sessionid = cookies.get("sessionid");
    const user = await DB.getUserFromSession(sessionid);

    // Get new details
    const data = await request.formData();
    const newEmail = data.get("email")?.toString();
    if (!newEmail) return fail(400, { success: false, message: "Email cannot be empty." });

    if (!newEmail.includes("@")) return fail(400, { success: false, message: "Email invalid or already used." });

    const possiblyExistingEmail = await DB.getUserByEmail(newEmail);
    if (possiblyExistingEmail) return fail(400, { success: false, message: "Email invalid or already used." });

    await DB.modifyUser(user.id, undefined, newEmail, undefined);
    //TODO: catch errors here

    return { success: true, message: "Email updated successfully." };
  },
  password: async ({ request, cookies }) => {
    // Get existing details
    const sessionid = cookies.get("sessionid");
    const user = await DB.getUserFromSession(sessionid);

    // Get new details
    const data = await request.formData();
    const newPassword = data.get("password")?.toString();
    if (!newPassword) return fail(400, { success: false, message: "Password cannot be empty." });

    const newPasswordHash = await Auth.hashPassword(newPassword);

    await DB.modifyUser(user.id, undefined, undefined, newPasswordHash);
    //TODO: catch errors here

    return { success: true, message: "Password updated successfully." };
  },
  deleteAccount: async ({ request, cookies }) => {
    const sessionid = cookies.get("sessionid");
    const user = await DB.getUserFromSession(sessionid);

    // TODO: if user is the last admin, prevent deletion

    const success = await DB.deleteUser(user.id);
    if (!success) return fail(500, { success: false, message: "Failed to delete account." });

    //return { success: true, message: "Account deleted successfully." };
    throw redirect(302, "/?message=Account+deleted+successfully.");
  }
};
