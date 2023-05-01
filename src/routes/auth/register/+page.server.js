import { error } from "@sveltejs/kit";
import { insertUser } from "$lib/server/db.js";
import { getUserByUsername, getUserByEmail } from "$lib/server/db.js";
import { hashPassword } from "$lib/server/auth.js"; // Import hashPassword function
import querystring from "querystring";

/**
 * If a user already has a session cookie, we should return their user object and
 * redirect them to the homepage.
 *
 * @param {Object} An object returning parameters from the request (params) and an object that allows access to cookies (cookies)
 * @returns {Promise<Object | null>} A user object, or null if not logged in.
 * @type {import("./$types").PageServerLoad}
 */
export async function load({ cookies }) {
  /* Example:
    const user = await db.getUserFromSession(cookies.get('sessionid'));
    return { user };
  */
  return null;
}

/**
 * User registration logic happens here. We should validate form submission data, and if
 * everything is valid, we should create a new user account.
 *
 * @type {import("./$types").Actions}
 */
export const actions = {
  default: async ({ request }) => {

    const body = await request.arrayBuffer();
    const decodedBody = new TextDecoder().decode(body);
    const formData = querystring.parse(decodedBody);
    const { username, email, password } = formData;


    // Check if the user already exists
    const existingUserByUsername = await getUserByUsername(username);
    const existingUserByEmail = await getUserByEmail(email);

    if (existingUserByUsername || existingUserByEmail) {
      return {
        status: 400,
        body: {
          message: "User already exists"
        }
      };
    }

    console.log("Password to hash:", password);

    // Hash the user's password using the imported hashPassword function
    const passwordHash = await hashPassword(password);

    // Insert the new user into the database
    const newUser = await insertUser(username, email, passwordHash);

    // If the user is successfully created, return a success message and status
    if (newUser) {
      return {
        status: 200,
        body: {
          message: "User registered successfully"
        }
      };
    }

    // If there was an error, return an error message and status
    return {
      status: 500,
      body: {
        message: "Error registering user"
      }
    };
  }
};
