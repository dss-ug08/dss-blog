import querystring from "querystring";

import {
  getUserFromSession,
  verifyUserCredentials,
  createSession
} from "$lib/server/db.js";
import { verifyPassword } from "$lib/server/auth";
import { getUserFromCookie } from "$lib/server/session";


// Temp

import * as api from "$lib/api.js";
import { fail, json, redirect } from "@sveltejs/kit";

/**
 * If a user already has a session cookie, we should return their user object and
 * redirect them to the homepage.
 *
 * @param {Object} cookies An object returning parameters from the request (params) and an object that allows access to cookies (cookies)
 * @returns {Promise<Object | null>} A user object, or null if not logged in.
 * @type {import("./$types").PageServerLoad}
 */
export async function load({ locals }) {
  if (locals.user) throw redirect(307, "/");
}

/**
 * Credential verification logic happens here. If a user session is validated, we should
 * return a user session value which can be saved as a cookie on the frontend, and the user
 * should be redirected to their referring page, or the homepage is none is specified.
 *
 * @type {import("./$types").Actions}
 */
export const actions = {

  default: async ({ cookies, request, locals }) => {

    console.log("WEBPAGE >> Login action triggered");

    const data = await request.formData();

    console.log("Webpage: Attempting POST request to API");

    const body = await api.post('auth/login', {

      user: {
        username: data.get('username'),
        password: data.get('password')
      }

    });

    console.log("WEBPAGE >> Response received from API")

    console.log("Webpage: POST sent, API Response:\n", body);


    if (body.errors) {
      return new Response(401
      );
    }


    const session_id = body.headers.get('session-id');
    // API reply
    console.log("Webpage: Authorised\n\tSession ID: ", session_id)

    load()

  }


};


