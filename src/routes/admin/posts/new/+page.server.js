import { error, fail } from "@sveltejs/kit";
import * as Utils from "$lib/server/utils.js";
import * as DB from "$lib/server/db.js";
import * as Auth from "$lib/server/auth.js";

/**
 * @typedef { import("$lib/types").Post } Post
 * @typedef { import("$lib/types").Comment } Comment
 */

/**
 * Temporarily - get the current user from the session cookie.
 * //FIXME: Note that the way this works allows anyone to edit any post as another user, if they set the user_id in the form.
 *
 * @returns {Promise<Object>} - A response object 
 * @throws {Error}
 * @type {import('./$types').PageServerLoad}
 */
export async function load({ params, cookies }) {
  const debug = new Utils.Debugger("routes:admin:posts:new:load");
  let user;

  // Auth check
  try {
    user = await Auth.checkPermissions(cookies.get('sessionid'), { admin: true});
  } catch (err) {
    debug.error(err);
    throw error(403, "Forbidden");
  }
  // End auth check

  return {
    user_id: user.id,
  };
}

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();

    /** @type {Post} */
    const post = {
      title: data.get("title"),
      content: data.get("content"),
      user_id: data.get("user_id"),
      slug: Utils.createSlug(data.get("title")),
    };

    // Write post to database
    const createdPost = await DB.createPost(post.title, post.content, post.slug, post.user_id);

    if (!createdPost) return fail(500, {success: false, message: "Post could not be created."});

    return {
      success: true,
      message: "Post created successfully.",
      createdPost,
    };
  }
};

