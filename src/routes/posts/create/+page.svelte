<script>
  import { goto } from "$app/navigation";

  let title = "";
  let content = "";
  let errorMessage = "";

  async function handleSubmit() {
    const response = await fetch("/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title, content })
    });

    if (response.ok) {
      const { post } = await response.json();
      // Redirect to the newly created post
      await goto(`/posts/${post.slug}`);
    } else {
      const { message } = await response.json();
      errorMessage = message;
    }
  }


</script>

<main class="container">
  {#if errorMessage}
    <div class="alert alert-danger">
      {errorMessage}
    </div>
  {/if}
  <h1>Create a new post</h1>
  <form on:submit|preventDefault={handleSubmit}>
    <label for="title">Title:</label>
    <input id="title" type="text" bind:value={title} required />
    <label for="content">Content:</label>
    <textarea id="content" bind:value={content} required></textarea>
    <button type="submit">Create Post</button>
  </form>
</main>
