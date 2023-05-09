<script>
  import { onMount } from "svelte";

  import Meta from "$lib/components/Meta.svelte";
</script>

<Meta title="Home"/>

<main class="container">
  <h2>Welcome to dss-blog!</h2>
  <p>
    Here are some links to pages, for ease of development:<br />
    <a href="/auth/login">Login</a><br />
    <a href="/auth/register">Register</a><br />
    <a href="/search">Search</a><br />
    <a href="/posts">Posts</a><br />
    <a href="/posts/test">Test Post</a><br />
  </p>
</main>

<style></style>
