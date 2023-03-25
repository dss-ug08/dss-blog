<script>
  /* 
    This page is where a user can provide credentials to get a login session.
    Authentication-only pages should be redirected here if no user session exists.
    @see https://kit.svelte.dev/docs/form-actions
    */
  import { redirect } from "@sveltejs/kit";

  /** @type {import("./$types").PageData} */
  export let data;

  /** @type {import("./$types").ActionData} */
  export let form;

  if (data.user) {
    // If the user is already logged in, redirect them to the home page
    throw redirect(307, "/");
  }

  let errorMessage = "";
</script>

<main class="container">
  <h2>Login</h2>

  <form method="POST" use:form action="">
    {#if errorMessage}
      <div class="error">{errorMessage}</div>
    {/if}
    <label>
      Username
      <input name="username" type="text" />
    </label>
    <label>
      Password
      <input name="password" type="password" />
    </label>
    <button>Log in</button>
  </form>
</main>

<style>
  .error {
    color: red;
    margin-bottom: 1rem;
  }
</style>
