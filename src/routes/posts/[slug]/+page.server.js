import { error } from "@sveltejs/kit";
import { marked } from "marked";
import * as Utils from "$lib/server/utils.js";
import { getPostBySlug, getCommentsByPostId } from "$lib/server/db.js";

/**
 * @typedef { import("$lib/types").Post } Post
 */

/**
 * Loads a post with the given slug from the database. If the post is found, its data is
 * returned, otherwise a 404 Not Found error is thrown.
 *
 * @returns {Promise<{post: Post}>} - A response object containing the post data or an error if the post is not found.
 * @throws {Error} If the post is not found, a 404 Not Found error is thrown.
 * @type {import('./$types').PageServerLoad}
 */
export async function load({ params }) {
  /** @type {Post} */
  try {
    const post = await getPostBySlug(params.slug);
    const comments = await getCommentsByPostId(post.id);


    post.content = await Utils.sanitizeHTML(
      await marked.parse(post.content, {
        async: true,
        breaks: true,
        gfm: true,
      })
      );

    return {
      post,
      comments
    };
    
  } catch (err) {
    throw error(404, "Not Found");
  }
}
