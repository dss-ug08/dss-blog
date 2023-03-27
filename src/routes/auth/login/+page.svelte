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

    throw redirect(307, "/");
  }

  let errorMessage = "";
  let successMessage = "";

  async function handleSubmit() {
    console.log("handleSubmit called");
    const username = usernameInput.value;
    const password = passwordInput.value;
    console.log("username:", username, "password:", password);

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


    if (response.ok) {
      console.log("User has logged in");
      const responseData = await response.json();
      const dataString = responseData.data;
      const data = JSON.parse(dataString);

      console.log("data:", data);

      const returnMessage = data[2];
      const jsonRM = JSON.parse(returnMessage);
      console.log(jsonRM.message);
      console.log();

      successMessage = jsonRM.message;


    } else {
      const error = await response.json();
      console.log("error:", error);
      console.log("error.message:", error.body);
      errorMessage = error.body;
    }

  }


  let usernameInput;
  let passwordInput;

</script>

<main class="container">
  <h2>Login</h2>

  <!-- Add a new element to display successMessage -->
  {#if successMessage}
    <p class="success">{successMessage}</p>
  {/if}

  <!-- Add a new element to display errorMessage -->
  {#if errorMessage}
    <p class="error">{errorMessage}</p>
  {/if}

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

</main>

<style>
  .error {
    color: red;
    margin-bottom: 1rem;
  }
</style>
