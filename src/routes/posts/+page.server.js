import { error } from "@sveltejs/kit";

/** 
 * Here, we load posts from the database to be displayed on the page.
 * TODO: potentially hide posts marked as drafts from non-admin users.
 * 
 * @returns {Promise<{posts: Array<{title: String, excerpt: String, slug: String}>}>} An array of posts containing the post's title, excerpt, and slug.
 * @type {import('./$types').PageServerLoad}
*/
export async function load({ params }) {
  return {
    // For demonstration purposes, we'll just return a dummy value.
    posts: [
      {
        title: "Hello world!",
        excerpt: "This is a dummy post.",
        slug: "test",
      },
    ],
  };
}
