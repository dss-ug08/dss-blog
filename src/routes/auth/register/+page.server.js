import { fail, redirect } from "@sveltejs/kit";
import * as DB from "$lib/server/db.js";
import { hashPassword } from "$lib/server/auth.js";

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
  throw redirect(307, '/');
}

/**
 * User registration logic happens here. We should validate form submission data, and if
 * everything is valid, we should create a new user account.
 *
 * @type {import("./$types").Actions}
 */
export const actions = {
  default: async ({ request }) => {
    //TODO: Return passed form data back to the user if there is an error

    // Set a standard error message to avoid leaking specific error information
    const standardErrorMessage = "Your account could not be created. Make sure your account doesn't already exist, and your details meet all of the requirements.";

    // Read data from the form submission
    const data = await request.formData();
    const username = data.get("username");
    const email = data.get("email");
    const password = data.get("password");

    // Check if the user already exists, and return an error if they do
    const existingUserByUsername = await DB.getUserByUsername(username);
    const existingUserByEmail = await DB.getUserByEmail(email);
    if (existingUserByUsername || existingUserByEmail) {
      console.error(`User ${username} (${email}) could not be created: already exists`);
      return fail(400, { success: false, message: standardErrorMessage });
    }

    // Hash the user's password and add them to the database
    const passwordHash = await hashPassword(password);
    const newUser = await DB.insertUser(username, email, passwordHash);

    // TODO: I'd rather throw an error inside insertUser if we fail to add the user, because returning null feels unintuitive

    // If the user is successfully created, return a success message and status
    if (newUser) {
      console.log(`User ${username} (${email}) created successfully`);
      return {
        success: true,
        message: "Your account has been created successfully."
      };
    }

    // If there was an error, return an error message and status
    return fail(500, { success: false, message: standardErrorMessage });
  },
};
