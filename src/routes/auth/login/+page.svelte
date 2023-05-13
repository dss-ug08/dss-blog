<script>
  import Meta from "$lib/components/Meta.svelte";
  /* 
    This page is where a user can provide credentials to get a login session.
    Authentication-only pages should be redirected here if no user session exists.
    @see https://kit.svelte.dev/docs/form-actions
    */
  import { redirect } from "@sveltejs/kit";
  import { goto } from "$app/navigation";

  /** @type {import("./$types").PageData} */
  export let data;

  /** @type {import("./$types").ActionData} */
  export let form;


  if (data.user) {
    console.log("Logged in already");
    goto("/");
  }


  // Handle Form submission by user
  async function handleSubmit() {
    const username = usernameInput.value;
    const password = passwordInput.value;

    // Send POST request to server with provided credentials
    const response = await fetch("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        username: username,
        password: password
      })
    });

    // Server response OK = Handle the login successfully
    if (response.ok) {
      console.log("User has logged in");
      const responseData = await response.json();

      const dataString = responseData.data;
      data = JSON.parse(dataString);

      const returnMessage = data[2];
      const jsonRM = JSON.parse(returnMessage);
      console.log(jsonRM.message);

      successMessage = jsonRM.message;

      // Redirect user to the homepage after a successful login
      // TODO: Add to user variable the user's class/info
      await goto('/');

    } else {
      // If the server response is not ok, display an error message.
      const error = await response.json();
      console.log("error:", error);
      console.log("error.message:", error.body);
      errorMessage = error.body;
    }

  }

  // Variables to set error/success messages to display
  let errorMessage = "";
  let successMessage = "";

  // Variables for username/password field
  let usernameInput;
  let passwordInput;


</script>

<Meta title="Login" />

<main class="container m-auto flex flex-col items-center my-5">
  <h2 class="text-4xl mb-5">Login</h2>
  
  {#if successMessage || errorMessage}
    <p class="success">{successMessage}</p>
    <p class="error">{errorMessage}</p>
  {/if}

  <form on:submit|preventDefault={handleSubmit}>
    <div class="form-control w-full max-w-xs">
      <label class="label" for="username">
        <span class="label-text">Username</span>
      </label>
      <input id="username" name="username" type="text" class="input input-bordered w-full max-w-xs" bind:this="{usernameInput}" />
    </div>
    <div class="form-control w-full max-w-xs">
      <label for="password">
        <span class="label-text">Password</span>
      </label>
      <input id="password" name="password" type="password" class="input input-bordered w-full max-w-xs" bind:this="{passwordInput}" />
    </div>
    <div class="form-control w-full max-w-xs mt-5">
      <button type="submit" class="btn btn-primary">Log in</button>
    </div>
  </form>

</main>

<style>
  .error {
    color: red;
    margin-bottom: 1rem;
  }
</style>
