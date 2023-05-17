<script>
  import Meta from "$lib/components/Meta.svelte";
  /* 
    This page is where a user can provide credentials to get a login session.
    Authentication-only pages should be redirected here if no user session exists.
    @see https://kit.svelte.dev/docs/form-actions
    */

  /** @type {import("./$types").PageData} */
  export let data;

  /** @type {import("./$types").ActionData} */
  export let form;
</script>

<Meta title="Login" />

<main class="container m-auto flex flex-col items-center my-5">
  <h2 class="text-4xl mb-5">Login</h2>
  
  {#if form?.message}
    <div class={form?.success ? 'text-success' : 'text-error'}>{form?.message}</div>
  {/if}

  <form method="POST">
    <div class="form-control w-full max-w-xs">
      <label class="label" for="username">
        <span class="label-text">Username</span>
      </label>
      <input id="username" name="username" type="text" class="input input-bordered w-full max-w-xs" required />
    </div>
    <div class="form-control w-full max-w-xs">
      <label for="password">
        <span class="label-text">Password</span>
      </label>
      <input id="password" name="password" type="password" class="input input-bordered w-full max-w-xs" required />
    </div>
    <div class="form-control w-full max-w-xs">
      <label for="code">
        <span class="label-text">TOTP Code (if enabled)</span>
      </label>
      <input type="text" name="code" id="code" class="input input-bordered w-full" minlength="6" maxlength="6" inputmode="numeric" pattern="\d*" />
    </div>
    <div class="form-control w-full max-w-xs mt-5">
      <button type="submit" class="btn btn-primary">Log in</button>
    </div>
  </form>

</main>

<style></style>
