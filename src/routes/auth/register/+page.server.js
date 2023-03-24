import { error } from "@sveltejs/kit";

/** 
 * If a user already has a session cookie, we should return their user object and
 * redirect them to the homepage.
 * 
 * @param {Object} An object returning parameters from the request (params) and an object that allows access to cookies (cookies)
 * @returns {Promise<Object | null>} A user object, or null if not logged in.
 * @type {import('./$types').PageServerLoad}
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
 * @type {import('./$types').Actions}
*/
export const actions = {
  default: async ({ request }) => {
    /* TODO: register user */
  },
};
