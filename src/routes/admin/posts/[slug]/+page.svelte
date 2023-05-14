<script>
  import Meta from "$lib/components/Meta.svelte";
  import { onMount } from "svelte";

  export let data;
  export let form;

  onMount(async () => {
    //TODO: fucked
    /*
    const EasyMDE = (await import("easymde")).default;
    const easyMDE = new EasyMDE({
      element: document.getElementById("content"),
      toolbar: [
        "bold",
        "italic",
        "heading",
        "|",
        "quote",
        "unordered-list",
        "ordered-list",
        "|",
        "link",
        "image",
        "|",
        "preview",
        "side-by-side",
        "fullscreen",
        "|",
        "guide",
      ],
    });
    */
  });
</script>

<Meta title="Edit Post: {data.post.id}" />

<main class="container sm m-auto p-5">
  <h1 class="text-4xl mb-5">Edit Post: {data.post.slug}</h1>

  {#if form?.message}
    <div class={form?.success ? 'text-success' : 'text-error'}>{form?.message}</div>
  {/if}

  <form method="POST">
    <div class="form-control w-full">
      <label class="label" for="title">
        <span class="label-text">Title</span>
      </label>
      <input id="title" name="title" type="text" required class="input input-bordered w-full" value={data.post.title} />
    </div>
    <div class="form-control w-full">
      <label class="label" for="content">
        <span class="label-text">Content</span>
      </label>
      <textarea id="content" name="content" required class="textarea textarea-bordered w-full h-[25rem]" value={data.post.content} />
    </div>
    <div class="form-control w-full mt-5">
      <button type="submit" class="btn btn-primary">Update Post</button>
    </div>
  </form>

  <a href="/admin/posts" class="btn btn-ghost mt-5">Back</a>
</main>

<style></style>
