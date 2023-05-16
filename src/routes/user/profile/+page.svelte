<script>
  import Meta from "$lib/components/Meta.svelte";

  /** @type {import("./$types").PageData} */
  export let data;

  /** @type {import("./$types").ActionData} */
  export let form;

  function onDeleteAccountPressed(event) {
    // Doing it this way allows the user to still delete if JS is disabled,
    // albeit with no confirmation.

    // If the user confirms, let the event continue
    if (confirm('Are you sure you want to delete your account? This is irreversible!')) alert('deleted');

    // Otherwise cancel the event!
    event.preventDefault();
  }
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
  
  {#if form?.message}
    <div class={form?.success ? 'text-success' : 'text-error'}>{form?.message}</div>
  {/if}

  <h3 class="text-2xl pb-2">Basic Information</h3>
  <section class="px-3">
    <img src={data.user.avatar} alt={data.user.username} />
    <form method="POST" action="?/username">
      <label class="label" for="username">
        <span class="label-text">Username</span>
      </label>
      <input type="text" value={data.user.username} name="username" id="username" class="input input-bordered w-64" />
      <button class="btn btn-ghost">Edit</button>
    </form>
    <form method="POST" action="?/email">
      <label class="label" for="email">
        <span class="label-text">Email</span>
      </label>
      <input type="email" value={data.user.email} name="email" id="email" class="input input-bordered w-64" />
      <button class="btn btn-ghost">Edit</button>
    </form>
  </section>

  <h3 class="text-2xl pb-2">Security Info</h3>
  <section class="px-3">
    <form method="POST" action="?/password">
      <label class="label" for="password">
        <span class="label-text">Password</span>
      </label>
      <input type="password" name="password" id="password" placeholder="********" class="input input-bordered w-64" />
      <button class="btn btn-ghost">Update</button>
    </form>
    <p>
      <label class="label" for="two-factor">
        <span class="label-text">Two-Factor Authentication</span>
      </label>
      <input id="two-factor" type="checkbox" disabled checked={data.user.is_2fa_enabled} class="checkbox checkbox-lg" /> <b>{data.user.is_2fa_enabled ? 'Enabled' : 'Disabled'}</b> <a href="" class="btn btn-ghost btn-sm" id="two-factor">Manage Two-Factor Authentication</a>
    </p>
  </section>

  <h3 class="text-2xl pb-2">Settings</h3>
  <section class="px-3">
    <a href="/user/settings" class="btn btn-primary">View Settings</a>
  </section>

  <h3 class="text-2xl pb-2">Danger Zone</h3>
  <section class="px-3">
    <form method="POST" action="?/deleteAccount">
      <!--TODO: add deletion confirmation-->
      <button class="btn btn-error">Delete Account</button>
    </form>
  </section>
</main>

<style>
</style>
