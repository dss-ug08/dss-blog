import { error } from "@sveltejs/kit";

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

    /* TODO: search posts */

    return {
      posts: [
        /* an array of posts */
      ],
      query: data.get("query") // So we can display the user's search term persistently on the form
    };
  }
};
