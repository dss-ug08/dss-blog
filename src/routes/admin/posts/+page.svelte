<script>
  import Meta from "$lib/components/Meta.svelte";

  export let data;

  function deletePost(slug) {
    const confirmed = confirm("Are you sure you want to delete this post?");
    if (confirmed) {
      fetch(`/admin/posts/${slug}`, {
        method: "DELETE",
      })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          window.location.reload();
        } else {
          alert(res.message);
        }
      });
    }
  }
</script>

<Meta title="Post Management" />

<main class="container sm flex flex-col items-center m-auto p-5">
  <h1 class="text-4xl mb-5">Post Management</h1>
  <div class="overflow-x-auto w-full">
    <table class="table w-full">
      <!-- head -->
      <thead>
        <tr>
          <th>
            <label>
              <input type="checkbox" class="checkbox" />
            </label>
          </th>
          <th>Post</th>
          <th>Author</th>
          <th>Last Updated</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {#each data.posts as post}
          <tr>
            <th>
              <label>
                <input type="checkbox" class="checkbox" />
              </label>
            </th>
            <td>
              <a href="/posts/{post.slug}">
                {post.title}
              </a>
              <br/>
              <span class="text-xs">{post.excerpt}</span>
            </td>
            <td>
              <div class="flex items-center space-x-3">
                <div class="avatar">
                  <div class="mask mask-circle w-12 h-12">
                    <img src={post.author_avatar} alt={post.author_username} />
                  </div>
                </div>
                <div>
                  <div class="font-bold">{post.author_username}</div>
                  <div class="text-sm opacity-50">{post?.author_is_admin ? 'Admin' : 'User'}</div>
                </div>
              </div>
            </td>
            <td>{new Date(post.updated_at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "medium", hour12: true })}</td>
            <th>
              <a class="btn btn-primary btn-xs" href="/admin/posts/{post.slug}">Edit</a>
              <button class="btn btn-error btn-xs" on:click={() => deletePost(post.slug)}>Delete</button>
            </th>
          </tr>
        {/each}
      <!-- foot -->
      <tfoot>
        <tr>
          <th></th>
          <th>Post</th>
          <th>Author</th>
          <th>Last Updated</th>
          <th></th>
        </tr>
      </tfoot>
      
    </table>
    <a href="/admin" class="btn btn-outline mt-5">Back</a>
    <a href="/admin/posts/new/" class="btn btn-success mt-5">New</a>
  </div>
</main>

<style></style>
