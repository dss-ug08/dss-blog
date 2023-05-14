/** @type {import('./$types').LayoutServerLoad} */
export function load({ locals }) {
  return {
    user: {
      id: locals.user.id,
      username: locals.user.username,
      email: locals.user.email,
      isAdmin: locals.user.isAdmin
    }
  };
}
