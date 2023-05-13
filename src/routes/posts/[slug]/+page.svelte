<script>
  import Meta from "$lib/components/Meta.svelte";
  /**
   This page displays an individual post based on its slug.
   The slug is the unique identifier for the post, and is used to generate the URL.
   The actual data is loaded in +page.server.js, and passed to this component as a variable.
   @see https://kit.svelte.dev/docs/load#using-url-data
   */
  /** @type {import("./$types").PageData} */
  export let data;
</script>

<Meta title={data.post.title} description={data.post.excerpt} />

<main class="container sm m-auto">
  <div class="breadcrumbs">
    <ul class="!whitespace-normal"> <!--TODO: breadcrumb should truncate title when it gets too big-->
      <li><a href="/">Home</a></li>
      <li><a href="/posts">Posts</a></li>
      <li>{data.post.title}</li>
    </ul>
  </div>

  <div class="postheader pb-5">
    <h1 class="text-5xl font-extrabold pb-5">{data.post.title}</h1>

    <span class="author flex gap-1">
      <div class="avatar placeholder">
        <div class="bg-neutral-focus text-neutral-content rounded-full w-12">
          <span>AU</span>
        </div>
      </div>
      <p>
        <!--TODO: add author name and image-->
        <b>Author Name</b><br />
        <small
          >Posted on: {new Date(data.post.created_at).toLocaleString()}</small
        >
      </p>
    </span>
  </div>

  <p class="prose max-w-none">
    <!-- This is fine because the server sanitizes the output before it reaches us -->
    {@html data.post.content}
  </p>
  <!--TODO: for development purposes, show the slug of the post here.-->
  <small>Post slug: <i>{data.post.slug}</i></small>
</main>

<!-- Comments --->
<!--TODO: tailwind update-->
<section class="container sm m-auto my-10">
  <h4 class="text-lg underline">Comments</h4>

  {#if data.comments != null && data.comments.length > 0}
    {#each data.comments as comment}
      <div>
        <p>{comment.content}</p>
        <!-- Display additional information like the creation date -->
        <small
          >Commented on: {new Date(comment.created_at).toLocaleString()}</small
        >
      </div>
    {/each}
  {:else}
    <p>No comments found for this post.</p>
  {/if}
</section>

<style>
  small {
    color: var(--muted-color);
  }

  /* Auto center images */
  :global(.prose img) {
    margin: auto;
  }
</style>
