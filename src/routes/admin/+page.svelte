<script>
  import Meta from "$lib/components/Meta.svelte";

  export let data;
</script>

<Meta title="Admin Dashboard" />

<main class="container sm flex flex-col items-center m-auto">
  <h1 class="text-4xl mb-5">Admin Dashboard</h1>
  <div class="stats stats-vertical lg:stats-horizontal shadow m-auto my-5">
  
    <div class="stat place-items-center">
      <div class="stat-title">Posts</div>
      <div class="stat-value">{data.stats.posts}</div>
      <div class="stat-desc"></div>
    </div>
    
    <div class="stat place-items-center">
      <div class="stat-title">Users</div>
      <div class="stat-value">{data.stats.users}</div>
      <div class="stat-desc text-secondary"></div>
    </div>
    
    <div class="stat place-items-center">
      <div class="stat-title">Comments</div>
      <div class="stat-value">{data.stats.comments}</div>
      <div class="stat-desc"></div>
    </div>
    
  </div>
  <div class="buttoncontainer">
    <h3 class="text-2xl mb-5">Blog Management</h3>
    <a class="btn btn-primary" href="/admin/posts">Manage Posts</a>
    <a class="btn btn-primary" href="/admin/users">Manage Users</a>
    <a class="btn btn-primary btn-disabled" href="/admin/comments">Manage Comments</a>
  </div>
</main>

<style></style>
