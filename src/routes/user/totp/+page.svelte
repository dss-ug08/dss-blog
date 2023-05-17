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

<Meta title="Two-Factor Authentication" />

<main class="container sm m-auto pb-5">
  <div class="breadcrumbs">
    <ul class="!whitespace-normal">
      <li><a href="/">Home</a></li>
      <li><a href="/user">{data.user.username}</a></li>
      <li><a href="/user/totp">Two-Factor Authentication</a></li>
    </ul>
  </div>
  <h1 class="text-4xl pb-3">Two-Factor Authentication - {data.user.username}</h1>
  
  {#if form?.message}
    <div class={form?.success ? 'text-success' : 'text-error'}>{form?.message}</div>
  {/if}

  <h3 class="text-2xl pb-2">TOTP</h3>
  <section class="px-3">
    {#if !form}
      <!-- Stage 0: Display current status -->
      {#if data.user.is_2fa_enabled}
        <p>Two-Factor Authentication is enabled.</p>
        <form method="POST" action="?/disable">
          <input type="hidden" name="username" value={data.user.username} />
          <button class="btn btn-error">Disable</button>
        </form>
      {:else}
        <p>Two-Factor Authentication is disabled.</p>
        <form method="POST" action="?/totpBegin">
          <input type="hidden" name="username" value={data.user.username} />
          <button class="btn btn-success">Enable</button>
        </form>
      {/if}
    {:else if form.stage === 1}
        <p>Scan the following QR code with your authenticator app, and enter the code it generates below to verify.</p>
        <img src={form.totp.qr} alt="QR Code" />
        <form method="POST" action="?/totpVerify">
          <input type="hidden" name="username" value={data.user.username} />
          <input type="hidden" name="secret" value={form.totp.secret} />
          <label class="label" for="code">
            <span class="label-text">Code</span>
          </label>
          <input type="text" name="code" id="code" class="input input-bordered w-64" minlength="6" maxlength="6" inputmode="numeric" pattern="\d*"/>
        </form>
    {:else if form.stage === 2}
        <p>Two-Factor Authentication was enabled successfully.</p>
        <a href="/user/profile" class="btn btn-success">Return to Profile</a>
    {/if}
  </section>
</main>

<style>
</style>
