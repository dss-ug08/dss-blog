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
 * Credential verification logic happens here. If a user session is validated, we should
 * return a user session value which can be saved as a cookie on the frontend, and the user
 * should be redirected to their referring page, or the homepage is none is specified.
 * @type {import('./$types').Actions} 
 */
export const actions = {
  default: async ({ request }) => {
    /* TODO: log user in */
  },
};
