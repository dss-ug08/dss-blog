import { createPost } from "$lib/server/db.js";
import { getUserFromCookie } from "$lib/server/session.js";

/**
 * Handles the creation of a new post by accepting a request with title and content,
 * then creating a slug from the title, and saving the post to the database. If the
 * user is not authenticated, a 401 Unauthorized response is returned.
 *
 * @param {Object} request - The request object containing the post data.
 * @param {Object} request.body - The request body containing the title and content of the post.
 * @param {string} request.body.title - The title of the new post.
 * @param {string} request.body.content - The content of the new post.
 * @returns {Promise<{status: number, body: {message: string, post?: {id: number, title: string, content: string, slug: string, user_id: number, created_at: string}}}>} - A response object containing the status code and a message indicating the result of the post creation. If successful, the created post object will be included in the response body.
 */
export async function post(request) {
  const { title, content } = request.body;
  const user = await getUserFromCookie(request.locals.sessionId);

  if (user) {
    const slug = createSlug(title);
    const post = await createPost(title, content, slug, user.id);

    if (post) {
      return {
        status: 200,
        body: {
          message: 'Post created successfully.',
          post,
        },
      };
    } else {
      return {
        status: 200,
        body: {
          message: 'No posts currently.',
        },
      };
    }
  } else {
    return {
      status: 401,
      body: {
        message: 'User not found. Please log in to create a post.',
      },
    };
  }
}

