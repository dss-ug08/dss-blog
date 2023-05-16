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
      <li><a href="/user/profile">Profile</a></li>
    </ul>
  </div>
  <h1 class="text-4xl pb-3">Profile - {data.user.username}</h1>

  <h3 class="text-2xl pb-2">Basic Information</h3>
  <section class="px-3">
    <img src={data.user.avatar} alt={data.user.username} />
    <p>
      Username: {data.user.username} <a href="" class="btn btn-ghost">Edit</a>
    </p>
    <p>Email: {data.user.email} <a href="" class="btn btn-ghost">Edit</a></p>
  </section>

  <h3 class="text-2xl pb-2">Security Info</h3>
  <section class="px-3">
    <p>Password: xxx <a href="" class="btn btn-ghost">Edit</a></p>
    <p>Two-Factor Authentication: {data.user.is_2fa_enabled?'Enabled':'Disabled'} <a href="" class="btn btn-ghost">Manage Two-Factor Authentication</a></p>
  </section>

  <h3 class="text-2xl pb-2">Settings</h3>
  <section class="px-3">
    <a href="/user/settings" class="btn btn-primary">View Settings</a>
  </section>

  <h3 class="text-2xl pb-2">Danger Zone</h3>
  <section class="px-3">
    <a href="" class="btn btn-error">Delete Account</a>
  </section>
</main>

<style>
</style>
