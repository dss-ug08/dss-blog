<script>
  import { error } from "$lib/error.js";

  /*
    This page displays a list of all posts. It should ideally be paginated.
    Individual posts are in the `[slug]` subdirectory, where `[slug] is provided
    by the url browsed to by the user.
    */
  /** @type {import("./$types").PageData} */
  export let data;
</script>

<main class="container">

  {#if Array.isArray(data.posts)}
    <h2>All Posts</h2>
    {#each data.posts as post}
      <a href="/posts/{post.slug}"><b>{post.title}</b></a>
      <p>{post.excerpt}</p>
    {/each}
  {:else}
    <h2>No posts currently.</h2>
  {/if}


  <!--TODO: pagination-->
</main>

<style></style>
