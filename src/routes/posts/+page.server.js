import { error } from "@sveltejs/kit";

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  /* 
        Here, we load posts from the database to be displayed on the page.
        TODO: potentially hide posts marked as drafts from non-admin users.
     */
}
