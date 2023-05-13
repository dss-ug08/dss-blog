import { error } from "@sveltejs/kit";
import * as DB from "$lib/server/db.js";
import * as Utils from "$lib/server/utils.js";

/**
 * Here, we search through posts in the database based on a provided search term.
 * Careful consideration needs to be made regarding the speed of this operation,
 * and it might be prudent to add a timeout. Additionally, we should be careful
 * not to expose posts which the user does not have permission to view.
 *
 * @returns {Promise<{posts: Array, query: String}>} An array of posts matching the search term, and the search term itself.
 * @type {import("./$types").Actions}
 */
export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    if (!data.has("query")) throw error(400, "No search query provided.");

    // @ts-ignore - handled above
    const posts = await DB.getPosts({ slug: data.get("query") });

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
      query: data.get("query") // So we can display the user's search term persistently on the form
    };
  }
};
