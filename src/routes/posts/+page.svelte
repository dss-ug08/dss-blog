<script>
  import Meta from "$lib/components/Meta.svelte";
  import { error } from "$lib/error.js";

  /*
    This page displays a list of all posts. It should ideally be paginated.
    Individual posts are in the `[slug]` subdirectory, where `[slug] is provided
    by the url browsed to by the user.
    */
  /** @type {import("./$types").PageData} */
  export let data;
</script>

<Meta title="All Posts"/>

<main class="container">

    <h2>All Posts</h2>
    {#if (!Array.isArray(data.posts) || !data.posts.length)}
      <p>No posts found.</p>
    {/if}
    {#each data.posts as post}
      <a href="/posts/{post.slug}"><b>{post.title}</b></a>
      <p>{post.excerpt}</p>
    {/each}

  <!--TODO: pagination-->
</main>

<style></style>
