<script>
  import Meta from "$lib/components/Meta.svelte";
  import Hero from "$lib/components/Hero.svelte";

  import { onMount } from "svelte";
</script>

<Meta title="Home"/>

<main>
  <Hero screen={true}>
    <span slot="title">Welcome to dss-blog!</span>

    <p>
      <b>dss-blog is an example blog site built with SvelteKit designed with Secure Software Development principles in mind.</b><br />
      Here are some links to pages, for ease of development:
    </p>

    <span slot="buttons">
      <a href="/auth/login" class="btn btn-primary">Login</a>
      <a href="/auth/register" class="btn btn-primary">Register</a>
      <a href="/search" class="btn btn-primary">Search</a>
      <a href="/posts" class="btn btn-primary">Posts</a>
      <a href="/posts/markdowntest" class="btn btn-primary">Test Post</a>
    </span>
  </Hero>
</main>

<style></style>
