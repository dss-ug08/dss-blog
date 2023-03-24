import { error } from "@sveltejs/kit";

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {
  /*
    If a user already has a session cookie, we should return their user object and
    redirect them to the homepage.
  */
  /* Example:
    const user = await db.getUserFromSession(cookies.get('sessionid'));
    return { user };
  */
}

/** @type {import('./$types').Actions} */
export const actions = {
  /* 
        Credential verification logic happens here. If a user session is validated, we should
        return a user session value which can be saved as a cookie on the frontend, and the user
        should be redirected to their referring page, or the homepage is none is specified.
     */
  default: async ({ request }) => {
    /* TODO: log user in */
  }
}
