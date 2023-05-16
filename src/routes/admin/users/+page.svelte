<script>
  import Meta from "$lib/components/Meta.svelte";

  export let data;
</script>

<Meta title="User Management" />

<main class="container sm flex flex-col items-center m-auto p-5">
  <h1 class="text-4xl mb-5">User Management</h1>
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
          <th>User</th>
          <th>Last Updated</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {#each data.users as user}
          <tr>
            <th>
              <label>
                <input type="checkbox" class="checkbox" />
              </label>
            </th>
            <td>
              <div class="flex items-center space-x-3">
                <div class="avatar">
                  <div class="mask mask-squircle w-12 h-12">
                    <img src={user.avatar} alt={user.username} />
                  </div>
                </div>
                <div>
                  <div class="font-bold">{user.username}</div>
                  <div class="text-sm opacity-50">{user.is_admin ? 'Admin' : 'User'}</div>
                </div>
              </div>
            </td>
            <td>{new Date(user.updated_at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "medium", hour12: true })}</td>
            <th>
              <button class="btn btn-primary btn-xs btn-disabled">Edit</button>
              <button class="btn btn-error btn-xs btn-disabled">Delete</button>
            </th>
          </tr>
        {/each}
      <!-- foot -->
      <tfoot>
        <tr>
          <th></th>
          <th>User</th>
          <th>Last Updated</th>
          <th></th>
        </tr>
      </tfoot>
      
    </table>
    <a href="/admin" class="btn btn-outline mt-5">Back</a>
  </div>
</main>

<style></style>
