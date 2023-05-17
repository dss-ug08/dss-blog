import { error, fail, redirect } from "@sveltejs/kit";
import * as Utils from "$lib/server/utils.js";
import * as DB from "$lib/server/db.js";
import * as Auth from "$lib/server/auth.js";
import * as TOTP from "$lib/server/2fa";

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
  totpBegin: async ({ request }) => {
    const data = await request.formData();
    const username = await data.get("username")?.toString();
    if (!username) return fail(400, { success: false, message: "Username cannot be empty." });

    /** @type {User} */
    const user = await DB.getUserByUsername(username);
    if (!user) return fail(400, { success: false, message: "User not found." });

    const totpSecret = await TOTP.generate2FASecret(user.username);
    const qr = await TOTP.generate2FAQrCode(totpSecret.otpauth_url);

    return { 
      stage: 1,
      totp: {
        secret: totpSecret,
        qr: qr
      }
    };
  },
  totpVerify: async ({ request }) => {
    const data = await request.formData();
    const totpSecret = await data.get("secret")?.toString();
    if (!totpSecret) return fail(400, { success: false, message: "TOTP secret cannot be empty." });
    const username = await data.get("username")?.toString();
    if (!username) return fail(400, { success: false, message: "Username cannot be empty.", stage: 1, totp: totpSecret });

    /** @type {User} */
    const user = await DB.getUserByUsername(username);
    if (!user) return fail(400, { success: false, message: "User not found.", stage: 1, totp: totpSecret });

    const code = await data.get("code")?.toString();
    if (!code) return fail(400, { success: false, message: "TOTP code cannot be empty.", stage: 1, totp: totpSecret });

    const success = await TOTP.verify2FAToken(totpSecret, code);
    if (!success) return fail(400, { success: false, message: "TOTP code invalid.", stage: 1, totp: totpSecret });

    await DB.saveUserSecretInDatabase(user.id, totpSecret);

    return { 
      stage: 2,
      success: true
    };
  },
};
