<script>
  import Meta from "$lib/components/Meta.svelte";
  import Card from "$lib/components/Card.svelte";
  /**
   This page displays a search box, and allows users to search for posts.
   Results should be displayed if a query has been provided.
   */
  /** @type {import("./$types").PageData} */
  export let data;

  /** @type {import("./$types").ActionData} */
  export let form;
</script>

<Meta title="Search" />

<main class="container sm m-auto py-5">
  <h2 class="text-4xl mb-5">Search</h2>
  <form method="POST" class="form-control w-full max-w-xs">
    <input name="query" type="text" placeholder={"Search..."}
           value={form?.query ?? ''} class="input input-bordered w-full max-w-xs" />
    <input type="submit" hidden />
  </form>
  {#if form && form?.query}
    {#if (!Array.isArray(form?.posts) || !form?.posts?.length)}
      <Card>
        <p slot="title">No posts found.</p>
      </Card>
    {:else}
      {#each form.posts as post}
        <Card>
          <span slot="title">
            <a href="/posts/{post.slug}">
              <b>{post.title}</b>
            </a>
          </span>

          <p>{post.excerpt}</p>

          <a href="/posts/{post.slug}" class="link link-hover">Read More &rarr;</a>
        </Card>
      {/each}
    {/if}
  {/if}
</main>

<style></style>
