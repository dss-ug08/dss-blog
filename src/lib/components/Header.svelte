<script>
  import { onMount } from 'svelte';

  /**
   * @typedef {import("$lib/types").User} User
  */

  /** @type {User} */
  let user;

  let message;

  async function getUserSession() {
    const response = await fetch("/api/auth/session", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    });
    return await response.json();
  }

  onMount(async () => {
    // Check for message in query string
    const params = new URL(document.location).searchParams;
    message = params.get("message");
    setTimeout(()=>message=null, 5000);

    // Get user session if present
    let session = await getUserSession();
    user = session?.user;
  });
</script>

<!-- svelte-ignore a11y-no-noninteractive-tabindex a11y-label-has-associated-control -->
<header class="navbar bg-base-100">
  <div class="navbar-start">
    <div class="dropdown">
      <label tabindex="0" class="btn btn-ghost btn-circle">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
      </label>
      <ul tabindex="0" class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
        <li><a href="/">Home</a></li>
        <li><a href="/posts">Posts</a></li>
        <li><a href="/">About</a></li>
        {#if user?.is_admin}
        <li><a href="/admin">Admin</a></li>
        {/if}
      </ul>
    </div>
  </div>
  <div class="navbar-center">
    <a href="/" class="btn btn-ghost normal-case text-xl">dss-blog</a>
  </div>
  <div class="navbar-end">
    <a href="/search" class="btn btn-ghost btn-circle">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
    </a>
    {#if user}
    <div class="dropdown dropdown-end">
      <label tabindex="0" class="btn btn-ghost btn-circle avatar">
        <div class="w-10 rounded-full">
          <img src={user?.avatar} alt={user.username} />
        </div>
      </label>
      <ul tabindex="0" class="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
        <li><b>Hi, {user?.username}!</b></li>
        <li>
          <a href="/user/profile" class="justify-between">
            Profile
            <span class="badge">New</span>
          </a>
        </li>
        <li><a href="/user/settings">Settings</a></li>
        <li><a href="/auth/logout">Logout</a></li>
      </ul>
    </div>
    {:else}
        <div class="dropdown dropdown-end">
      <label tabindex="0" class="btn btn-ghost btn-circle avatar placeholder">
        <div class="w-10 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464H398.7c-8.9-63.3-63.3-112-129-112H178.3c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z"/></svg>
        </div>
      </label>
      <ul tabindex="0" class="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
      <li><a href="/auth/login">Log in</a></li>
      <li><a href="/auth/register">Register</a></li>
      </ul>
    </div>
    {/if}
  </div>
</header>

{#if message}
<div class="toast toast-end">
  <div class="alert alert-info">
    <div>
      <span>{message}</span>
    </div>
  </div>
</div>
{/if}

<style></style>
