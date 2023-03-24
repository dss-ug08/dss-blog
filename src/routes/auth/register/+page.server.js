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
        User registration logic happens here. We should validate form submission data, and if
        everything is valid, we should create a new user account.
     */
  default: async ({ request }) => {
    /* TODO: register user */
  }
}
