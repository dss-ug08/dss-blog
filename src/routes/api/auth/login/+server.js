import { error, fail } from "@sveltejs/kit";
import { createSession, verifyUserCredentials } from "$lib/server/db.js";

export async function POST({ request, events, cookies }) {

  let resp = await request.json();
  let user_credentials = resp.user;
  // DEBUG

  console.log("\nINTERNAL API >> Login API Reached");

  let username = user_credentials.username;
  let password = user_credentials.password;

  console.log(
    "Username: ", username,
    "\nPassword:", password);

  console.log("Verifying with database. . .");
  const resp_userdata = await verifyUserCredentials(
    username, password);


  if (!resp_userdata) {
    console.log("ERROR: User unverified");
    return new Response(401, {
      headers: {
        status: 401,
        message: "Invalid Username or Password"
      }
    });
  }

  console.log("\nUser verified");

  // TODO: Temp fix for IP
  let clientIP = "192.168.0.101";

  const sessionId = await createSession(resp_userdata.id, clientIP);


  // Cookies setting
  cookies.set('sessionid', sessionId, { path: "/" });

  // Valid login and session created
  return new Response(200, {
    headers:{
      'Content-Type': 'application/json',
      'session-id': `${sessionId}`
    }
  });

  // DEBUG

}
