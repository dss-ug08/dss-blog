<script>
  import { onMount } from 'svelte';
  let user;

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
    let session = await getUserSession();
    user = session.user;
  });
</script>

<header>
  <nav>
    <ul>
      <li><a href="/" class="contrast"><strong>dss-blog</strong></a></li>
      <!---->
      <li><a href="/posts">Posts</a></li>
      <li><a href="/search">Search</a></li>
    </ul>
    <ul>
      {user?.username}
      <!--TODO: display user menu if user is logged in already-->
      {#if !user}
        <li><a href="/auth/login" role="button">Log in</a></li>
        <li>
          <a href="/auth/register" role="button" class="secondary">Register</a>
        </li>
      {:else}
        <li><a href="/auth/logout" role="button">Log out</a></li>
      {/if}
    </ul>
  </nav>
  <hr />
</header>

<style>
  header {
    width: 100%;
    margin-right: auto;
    margin-left: auto;
    padding: 0 var(--block-spacing-horizontal);
  }
</style>
