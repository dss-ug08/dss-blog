<script>
  import Meta from "$lib/components/Meta.svelte";
  import Card from "$lib/components/Card.svelte";
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

    <h2 class="text-2xl">All Posts</h2>
    {#if (!Array.isArray(data.posts) || !data.posts.length)}
      <p>No posts found.</p>
    {/if}
    {#each data.posts as post}
      <Card>
        <span slot="title">
          <a href="/posts/{post.slug}">
            <b>{post.title}</b>
          </a>
        </span>

        <p>{post.excerpt}</p>

        <!--
        <span slot="buttons">
          <a href="/posts/{post.slug}" class="btn btn-primary">Read More</a>
        </span>
        -->
      </Card>
    {/each}

  <!--TODO: pagination-->
</main>

<style></style>
