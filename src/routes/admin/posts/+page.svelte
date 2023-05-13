<script>
  import Meta from "$lib/components/Meta.svelte";

  export let data;
</script>

<Meta title="Admin Dashboard" />

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
              {post.title}
              <br/>
              <!--FIXME: DANGER possible xss, need to sanitize-->
              <span class="text-xs">{@html post.content.substring(0, 55) + "&hellip;"}</span>
            </td>
            <td>
              <div class="flex items-center space-x-3">
                <div class="avatar">
                  <div class="mask mask-squircle w-12 h-12">
                    <img src={data.authors[0].avatarurl} alt={data.authors[0].username} />
                  </div>
                </div>
                <div>
                  <div class="font-bold">{data.authors[0].username}</div>
                  <div class="text-sm opacity-50">{data.authors[0].is_admin ? 'Admin' : 'User'}</div>
                </div>
              </div>
            </td>
            <td>{new Date(post.updated_at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "medium", hour12: true })}</td>
            <th>
              <button class="btn btn-primary btn-xs">Edit</button>
              <button class="btn btn-error btn-xs">Delete</button>
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
  </div>
</main>

<style></style>
