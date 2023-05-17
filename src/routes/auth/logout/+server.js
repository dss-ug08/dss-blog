import { error, redirect, json } from '@sveltejs/kit';
import * as DB from "$lib/server/db.js";

/** @type {import('./$types').RequestHandler}*/
export async function GET({ url, cookies }) {
  const sessionId = cookies.get("sessionid");
  if (!sessionId) throw error(401, "Unauthorized");

  const user = await DB.getUserFromSession(sessionId);
  if (!user.id) throw error(401, "Unauthorized");

  await DB.destroySession(sessionId);
  cookies.delete("sessionid", { path: "/" });

  throw redirect(302, "/?message=Logged out successfully.");
}
