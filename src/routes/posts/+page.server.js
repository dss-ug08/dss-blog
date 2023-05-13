import { error } from "@sveltejs/kit";
import * as DB from "$lib/server/db.js";
import * as Utils from "$lib/server/utils.js";

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
  // For pagination we can use after: id and limit: num
  // e.g. const posts = await DB.getPosts({after: lastID, limit: 5});
  // where lastID is the ID of the last post on the previous page.
  const posts = await DB.getPosts();

  // Truncate long post titles
  for (let post of posts) {
    if (post.title.length > Utils.maxTitleExcerptLength) post.title = Utils.truncateTitle(post.title);
  }

  // Generate excerpt for each post
  //TODO: This is expensive - we should generate this on post creation/update.
  for (let post of posts) {
    // If post content is greater than max, truncate and add ellipsis, otherwise return untouched.
    post.excerpt = Utils.truncateExcerpt(
      Utils.mdToPlaintext(post.content)
    );
  }

  return {
    posts,
  };
}
