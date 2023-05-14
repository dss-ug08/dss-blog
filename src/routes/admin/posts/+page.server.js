import { error } from "@sveltejs/kit";
import * as DB from "$lib/server/db.js";
import * as Utils from "$lib/server/utils.js";

/**
 * @typedef {import('$lib/types').Post} Post
 * @typedef {import('$lib/types').User} User
 */

/**
 * Load posts and authors from the database for the admin posts page.
 *
 * @returns {Promise<{posts: ArrayLike<Post>}>} An array of posts and their authors.
 * @type {import('../$types').PageServerLoad}
 */
export async function load({ params }) {
  const posts = await DB.getPosts({ withAuthor: true });

  for (let post of posts) {
    post.title = Utils.truncateTitle(post.title);
    post.excerpt = Utils.truncateExcerpt(Utils.mdToPlaintext(post.content), { limit: 100, byWords: false });
    //TODO: this isn't great, can we clean this up?
    post.author_avatar = Utils.gravatar(post.author_email);
  }

  return {
    posts,
    /*
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
    ]*/
  };
}
