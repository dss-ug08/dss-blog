<script>
  import { onMount } from "svelte";

  import Meta from "$lib/components/Meta.svelte";
</script>

<Meta title="Home"/>

<main>
  <div class="hero min-h-screen bg-base-200">
    <div class="hero-content text-center">
      <div class="max-w-md">
        <h1 class="text-5xl font-bold">Welcome to dss-blog!</h1>
        <p class="py-6">
          <a href="/auth/login">Login</a><br />
          <a href="/auth/register">Register</a><br />
          <a href="/search">Search</a><br />
          <a href="/posts">Posts</a><br />
          <a href="/posts/test">Test Post</a><br />
        </p>
        <!--<button class="btn btn-primary">Get Started</button>-->
      </div>
    </div>
  </div>
</main>

<style></style>
