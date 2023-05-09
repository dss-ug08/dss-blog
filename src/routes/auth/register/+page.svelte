<script>
  import Meta from "$lib/components/Meta.svelte";
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

  let errorMessage = "";
  let successMessage = "";

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

    const response = await fetch("/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded" // Change the Content-Type here
      },
      body: new URLSearchParams({ username, email, password }) // Use URLSearchParams to format the data correctly
    });

    if (response.ok) {
      successMessage = "User registered successfully";
      throw redirect(307, "/login");
    } else {
      const resp = await response.json();
      errorMessage = resp.error.message;
    }
  }

</script>

<Meta title="Register" />

<main class="container">
  <h2>Register</h2>
  {#if errorMessage}
    <p class="error">{errorMessage}</p>
  {/if}
  {#if successMessage}
    <p class="success">{successMessage}</p>
  {:else}
    <form on:submit|preventDefault="{handleSubmit}">
      <label>
        Username
        <input name="username" type="text" required />
      </label>
      <label>
        Email
        <input name="email" type="email" required />
      </label>
      <label>
        Password
        <input name="password" type="password" required />
      </label>
      <button>Create account</button>
    </form>
  {/if}
</main>

<style>
  .error {
    color: red;
    margin-bottom: 1rem;
  }
  .success {
    color: green;
    margin-bottom: 1rem;
  }
</style>
