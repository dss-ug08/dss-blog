import { error } from "@sveltejs/kit";
import { getPosts } from "$lib/server/db.js";

/**
 * @typedef {import ('$lib/types').Post} Post
 */

/**
 * Here, we load posts from the database to be displayed on the page.
 * TODO: potentially hide posts marked as drafts from non-admin users.
 *
 * @returns {Promise<{posts: Array<Post>}>} An array of posts containing the post's title, excerpt, and slug.
 * @type {import('./$types').PageServerLoad}
 */
export async function load({ params }) {
  const posts = await getPosts();

  //TODO: This is expensive - we should generate this on post creation/update.
  for (let post of posts) {
    // If post content is greater than max, truncate and add ellipsis, otherwise return untouched.
    let maxLength = 100;
    post.excerpt = post.content.length > maxLength ? post.content.substring(0, maxLength) + '…' : post.content;
  }

  return {
    posts,
  };
}
