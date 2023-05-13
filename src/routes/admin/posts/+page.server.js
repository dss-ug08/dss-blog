import { error } from "@sveltejs/kit";
import * as DB from "$lib/server/db.js";
import * as Utils from "$lib/server/utils.js";

/**
 * @typedef {import('./$types').Post} Post
 * @typedef {import('./$types').User} User
 */

/**
 * Load posts and users from the database for the admin posts page.
 *
 * @returns {Promise<{posts: ArrayLike<Post>, authors: ArrayLike<User>}>} An array of posts and users.
 * @type {import('../$types').PageServerLoad}
 */
export async function load({ params }) {
  return {
    posts: [
      {
        id: 1,
        title: "Post Title",
        content: "This is an example of a post, with some content that's hopefully long enough to be truncated.",
        slug: "post-slug",
        user_id: 1,
        created_at: "2021-08-01 00:00:00",
        updated_at: "2021-08-01 00:00:00"
      }
    ],
    authors: [
      {
        id: 1,
        username: "testuser",
        email: "testuser@example.com",
        avatarurl: "https://daisyui.com/tailwind-css-component-profile-2@56w.png",
        is_admin: true,
      }
    ]
  };
}
