import { error } from "@sveltejs/kit";

/** 
 * This code should load an individual post's data from the database, and return it to the
 * frontend. If the post is not found, we should return an error which will be handled by
 * the +error.svelte component.
 * 
 * @returns {Promise<{post: {title: String, content: String, slug: String}}>} A post object containing the post's title, content, and slug.
 * @type {import('./$types').PageServerLoad}
*/
export async function load({ params }) {
  /*
    Code for handling posts could look something like this:
      import getPostFromDatabase from '$lib/server/db.js';

      const post = await getPostFromDatabase(params.slug);
 
      if (post) {
        return post;
      }
    
      throw error(404, 'Not found');
  */
  return {
    // For demonstration purposes, we'll just return a dummy post.
    post: {
      title: "Hello world!",
      content: "This is a dummy post.",
      slug: params.slug,
    },
  };
}