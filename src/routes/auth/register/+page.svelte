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

<main class="container m-auto flex flex-col items-center my-5">
  <h2 class="text-4xl mb-5">Register</h2>
  
  {#if successMessage || errorMessage}
    <p class="success">{successMessage}</p>
    <p class="error">{errorMessage}</p>
  {/if}

  <form on:submit|preventDefault="{handleSubmit}">
    <div class="form-control w-full max-w-xs">
      <label class="label" for="username">
        <span class="label-text">Username</span>
      </label>
      <input id="username" name="username" type="text" required class="input input-bordered w-full max-w-xs" />
    </div>
    <div class="form-control w-full max-w-xs">
      <label class="label" for="email">
        <span class="label-text">Email</span>
      </label>
      <input id="email" name="email" type="email" required class="input input-bordered w-full max-w-xs" />
    </div>
    <div class="form-control w-full max-w-xs">
      <label class="label" for="password">
        <span class="label-text">Password</span>
      </label>
      <input id="password" name="password" type="password" required class="input input-bordered w-full max-w-xs" />
    </div>
    <div class="form-control w-full max-w-xs mt-5">
      <button type="submit" class="btn btn-primary">Create account</button>
    </div>
  </form>
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
