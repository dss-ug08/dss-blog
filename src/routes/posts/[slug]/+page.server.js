import { error } from "@sveltejs/kit";
import { getPostBySlug } from "$lib/server/db.js";

/**
 * Loads a post with the given slug from the database. If the post is found, its data is
 * returned as a prop. If the post is not found, a 404 Not Found error is thrown.
 *
 * @param {Object} context - The context object containing the post slug.
 * @param {Object} context.params - The object containing the post slug.
 * @returns {Promise<{props: {data: {post: {id: number, title: string, content: string, slug: string, user_id: number, created_at: string}}}}|Error>} - A response object containing the post data as a prop or an error if the post is not found.
 * @throws {Error} If the post is not found, a 404 Not Found error is thrown.
 */
export async function load({ params }) {
  const post = await getPostBySlug(params.slug);

  if (post) {
    return {
      props: {
        data: { post }
      }
    };
  }
  throw error(404, "Not found");
}
