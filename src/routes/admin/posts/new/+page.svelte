<script>
  import Meta from "$lib/components/Meta.svelte";

  export let data;
  export let form;
</script>

<Meta title="Create Post" />

<main class="container sm m-auto p-5">
  <h1 class="text-4xl mb-5">Create Post</h1>

  {#if form?.message}
    <div class={form?.success ? 'text-success' : 'text-error'}>{form?.message}{@html form?.success ? ` <a href="/posts/${form?.createdPost?.slug}">View Post &rarr;</a>` : ''}</div>
  {/if}

  <form method="POST">
    <div class="form-control w-full">
      <label class="label" for="title">
        <span class="label-text">Title</span>
      </label>
      <input id="title" name="title" type="text" required class="input input-bordered w-full"/>
    </div>
    <!--TODO: Author picker?-->
    <input type="hidden" id="user_id" name="user_id" value={data?.user_id} />
    <!--/-->
    <div class="form-control w-full">
      <label class="label" for="content">
        <span class="label-text">Content</span>
      </label>
      <textarea id="content" name="content" required class="textarea textarea-bordered w-full h-[25rem]" />
    </div>
    <div class="form-control w-full mt-5">
      <button type="submit" class="btn btn-primary">Create Post</button>
    </div>
  </form>

  <a href="/admin/posts" class="btn btn-ghost mt-5">Back</a>
</main>

<style></style>
