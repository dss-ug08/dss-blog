import { error, fail } from "@sveltejs/kit";
import * as Utils from "$lib/server/utils.js";
import * as DB from "$lib/server/db.js";
import * as Auth from "$lib/server/auth.js";

/**
 * @typedef { import("$lib/types").Post } Post
 * @typedef { import("$lib/types").Comment } Comment
 */

/**
 * Loads a post with the given slug from the database. If the post is found, its data is
 * returned, otherwise a 404 Not Found error is thrown.
 *
 * @returns {Promise<{post: Post}>} - A response object containing the post data or an error if the post is not found.
 * @throws {Error} If the post is not found, a 404 Not Found error is thrown.
 * @type {import('./$types').PageServerLoad}
 */
export async function load({ params, cookies }) {
  const debug = new Utils.Debugger("routes:admin:posts:slug:load");
  // Auth check
  try {
    await Auth.checkPermissions(cookies.get('sessionid'), { admin: true});
  } catch (err) {
    debug.error(err);
    throw error(403, "Forbidden");
  }
  // End auth check

  /** @type {Post} */
  try {
    const post = await DB.getPostBySlug(params.slug);

    //TODO: This isn't great, can we clean this up?
    post.author_avatar = await Utils.gravatar(post.author_email);

    return {
      post
    };
    
  } catch (err) {
    throw error(404, "Not Found");
  }
}

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();

    /** @type {Post} */
    const post = {
      title: data.get("title"),
      content: data.get("content"),
      slug: data.get("slug"),
      user_id: data.get("user_id"),
    };

    // Write post to database
    const updatedPost = await DB.updatePost(post.title, post.content, post.slug, post.user_id);

    if (!updatedPost) return fail(500, {success: false, message: "Post could not be updated."});

    return {
      success: true,
      message: "Post updated successfully.",
      updatedPost,
    };
  }
};

