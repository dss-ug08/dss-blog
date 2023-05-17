import * as DB from "$lib/server/db.js";
import * as TOTP from "$lib/server/2fa.js";
import * as Auth from "$lib/server/auth.js";
import * as Utils from "$lib/server/utils.js";
import { fail, json, redirect } from "@sveltejs/kit";
import dotenv from "dotenv";

dotenv.config();

/**
 * If a user already has a session cookie, we should return their user object and
 * redirect them to the homepage.
 *
 * @returns {Promise<Object | null>} A user object, or null if not logged in.
 * @type {import("./$types").PageServerLoad}
 */
export async function load({ cookies }) {

  const sessionid = cookies.get("sessionid");

  if (!sessionid) return null;

  const user = await DB.getUserFromSession(sessionid);
  if (!user) return null;

  // If the user is already logged in, redirect them to the home page
  throw redirect(302, '/');
}

/**
 * Credential verification logic happens here. If a user session is validated, we should
 * return a user session value which can be saved as a cookie on the frontend, and the user
 * should be redirected to their referring page, or the homepage is none is specified.
 *
 * @type {import("./$types").Actions}
 */
export const actions = {
  default: async ({ request, cookies, getClientAddress }) => {
    //TODO: Return passed form data back to the user if there is an error

    // Get client IP for rate limiting purposes
    const clientAddress = getClientAddress();
    console.warn(`Client IP: ${clientAddress}`);

    // Read data from the form submission
    const data = await request.formData();

    // Recaptcha handling

    const recaptchaToken = data.get("recaptcha-token");
    const google_response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`, {
      method: 'POST',
    });

    const google_response_data = await google_response.json();
    console.log("ReCAPTCHA v2 Status: " + google_response_data.success);

    if (!Utils.disableRecaptcha && google_response_data.success === false) {
      console.dir(google_response_data);
      return fail(401, { success: false, message: "reCAPTCHA verification failed" });
    }
    // End of Recaptcha handling

    // User details verification
    const username = data.get("username");
    const password = data.get("password");
    const totpCode = data.get("code");

    // Verify the submitted user credentials
    const user = await DB.verifyUserCredentials(username, password);

    // TODO: possible security improvements:
    // - rate limiting per IP address
    // - lockout after a certain number of failed attempts of a given username
    // - randomize response time to prevent timing attacks

    // If the user credentials are invalid, return a 401 status with an error message
    if (!user) return fail(401, { success: false, message: "Invalid username or password." });

    // Check 2fa if enabled
    if (await DB.isTwoFactorEnabled(user.id)) {
      const totpSecret = await DB.getUserSecretFromDatabase(user.id);
      if (!totpCode) return fail(401, { success: false, message: "2FA code required." });
      if (!totpSecret) return fail(401, { success: false, message: "2FA secret not found, contact support." });

      const verificationResponse2FA = await TOTP.verify2FAToken(totpSecret, totpCode.toString());

      if (!verificationResponse2FA) return fail(401, { success: false, message: "Invalid 2FA code." });
    }

    // If the credentials are valid, create a session and return the session ID as a cookie
    const sessionId = await DB.createSession(user.id, clientAddress);
    const isSecure = request.headers.get("x-forwarded-proto") === "https";
    cookies.set("sessionid", sessionId, { path: "/", httpOnly: true, sameSite: 'strict', secure: isSecure, maxAge: 60 * 60 * 24 * 30 });

    return json({ success: true, message: "Login successful." });


  }
};
