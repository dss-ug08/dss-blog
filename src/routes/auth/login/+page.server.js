import { error } from "@sveltejs/kit";

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  /* 
        Credential verification logic happens here. If a user session is validated, we should
        return a user session value which can be saved as a cookie on the frontend, and the user
        should be redirected to their referring page, or the homepage is none is specified.
     */
}
