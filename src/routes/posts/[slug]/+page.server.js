import { error } from "@sveltejs/kit";
import { marked } from "marked";
import * as Utils from "$lib/server/utils.js";
import * as DB from "$lib/server/db.js";

/**
 * @typedef { import("$lib/types").Post } Post
 * @typedef { import("$lib/types").Comment } Comment
 */

/**
 * Loads a post with the given slug from the database. If the post is found, its data is
 * returned, otherwise a 404 Not Found error is thrown.
 *
 * @returns {Promise<{post: Post, comments: ArrayLike<Comment>}>} - A response object containing the post data or an error if the post is not found.
 * @throws {Error} If the post is not found, a 404 Not Found error is thrown.
 * @type {import('./$types').PageServerLoad}
 */
export async function load({ params }) {
  /** @type {Post} */
  try {
    const post = await DB.getPostBySlug(params.slug);
    const comments = await DB.getCommentsForPostId(post.id);
    
    post.excerpt = Utils.truncateExcerpt(post.content);
    post.content = await Utils.sanitizeHTML(
      await marked.parse(post.content, {
        async: true,
        breaks: true,
        gfm: true,
      })
    );

    //TODO: This isn't great, can we clean this up?
    post.author_avatar = await Utils.gravatar(post.author_email);

    return {
      post,
      comments
    };
    
  } catch (err) {
    throw error(404, "Not Found");
  }
}
