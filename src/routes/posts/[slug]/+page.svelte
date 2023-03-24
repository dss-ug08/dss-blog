<script>
  /* 
    This page displays an individual post based on its slug.
    The slug is the unique identifier for the post, and is used to generate the URL.
    The actual data is loaded in +page.server.js, and passed to this component as a prop.
    @see https://kit.svelte.dev/docs/load#using-url-data
  */
  /** @type {import('./$types').PageData} */
  export let data;
</script>

<main class="container">
  <nav aria-label="breadcrumb">
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/posts">Posts</a></li>
      <li>{data.post.title}</li>
    </ul>
  </nav>

  <h3>{data.post.title}</h3>
  <p>
    {data.post.content}
  </p>
  <!--TODO: for development purposes, show the slug of the post here.-->
  <small>Post slug: <i>{data.post.slug}</i></small>
</main>

<style>
  small {
    color: var(--muted-color);
  }
</style>
