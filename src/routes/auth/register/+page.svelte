<script>
  /* 
    This page is where a user can provide credentials to create a new account.
    The user should then be redirected to the login page.
    TODO: Email verification? If so, prompt user to open their emails instead,
    and add a page which redirects to login which is linked from the email.
    @see https://kit.svelte.dev/docs/form-actions
    */
  import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageData} */
export let data;

/** @type {import('./$types').ActionData} */
export let form;

if (data.user) {
  // If the user is already logged in, redirect them to the home page
  throw redirect(307, '/');
}
</script>

<main class="container">
  <h2>Register</h2>

  <form method="POST">
    <label>
      Username
      <input name="username" type="text" />
    </label>
    <label>
      Password
      <input name="password" type="password" />
    </label>
    <button>Create account</button>
  </form>

</main>

<style></style>
