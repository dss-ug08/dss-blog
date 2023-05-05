<script>
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
    console.log("handleSubmit called");
    const username = usernameInput.value;
    const password = passwordInput.value;
    console.log("username:", username, "password:", password);

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

    console.log("response:", response);
    console.log("response status:", response.status);


    // Server response OK = Handle the login successfully
    if (response.ok) {
      console.log("User has logged in");
      const responseData = await response.json();

      const dataString = responseData.data;
      data = JSON.parse(dataString);

      console.log("data:", data);

      const returnMessage = data[2];
      const jsonRM = JSON.parse(returnMessage);
      console.log(jsonRM.message);
      console.log();

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

<main class="container">
  <h2>Login</h2>
  <!-- Add a new element to display successMessage -->
  {#if successMessage || errorMessage}
    <p class="success">{successMessage}</p>
    <p class="error">{errorMessage}</p>

  {:else}
    <form on:submit|preventDefault={handleSubmit}>
      <label>
        Username
        <input name="username" type="text" bind:this="{usernameInput}" />
      </label>
      <label>
        Password
        <input name="password" type="password" bind:this="{passwordInput}" />
      </label>
      <button type="submit">Log in</button>
    </form>
  {/if}

</main>

<style>
  .error {
    color: red;
    margin-bottom: 1rem;
  }
</style>
