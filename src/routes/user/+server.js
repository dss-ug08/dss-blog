import { error, json, redirect } from '@sveltejs/kit';
import { getUserFromSession } from "$lib/server/db.js";

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, cookies }) {
  const sessionId = cookies.get("sessionid");
  if (!sessionId) throw redirect(302, '/auth/login');

  const user = await getUserFromSession(sessionId);
  if (!user.id) throw redirect(302, '/auth/login');

  throw redirect(302, '/user/profile');
}
