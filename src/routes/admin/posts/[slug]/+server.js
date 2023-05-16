import { json } from '@sveltejs/kit';
import * as DB from '$lib/server/db.js';

/**
 * 
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function DELETE({ request, params, cookies }) {
  // Get post slug to delete
  const slug = params.slug;

  // Basic auth check
  const sessionid = cookies.get('sessionid');
  if (!sessionid) return json({ success: false, message: "Unauthorized" }, { status: 401 });
  const user = await DB.getUserFromSession(sessionid);
  if (!user) return json({ success: false, message: "Unauthorized" }, { status: 401 });
  if (!user.is_admin) return json({ success: false, message: "Unauthorized" }, { status: 401 });

  // Delete post from database
  try {
    const deletedPost = await DB.deletePostBySlug(slug);
    return json({ success: true, message: "Post deleted successfully." });
  } catch (err) {
    console.error(err);
    return json({ success: false, message: "Post could not be deleted." }, { status: 500 });
  }
}
