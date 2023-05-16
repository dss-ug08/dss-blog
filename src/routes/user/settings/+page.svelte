<script>
  import Meta from "$lib/components/Meta.svelte";

  /** @type {import("./$types").PageData} */
  export let data;
</script>

<Meta title="Profile" />

<main class="container sm m-auto pb-5">
  <div class="breadcrumbs">
    <ul class="!whitespace-normal">
      <li><a href="/">Home</a></li>
      <li><a href="/user">{data.user.username}</a></li>
      <li><a href="/user/settings">Settings</a></li>
    </ul>
  </div>
  <h1 class="text-4xl pb-3">Settings</h1>
  <p>No settings available.</p>
</main>

<style>
</style>
