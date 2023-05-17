<script>
  import Meta from "$lib/components/Meta.svelte";

  // Start of ReCAPTCHA
  import { Recaptcha } from "svelte-recaptcha-v2";

  let recaptchaToken = null;
  const googleRecaptchaSiteKey = "6LerhtAlAAAAACXtKyaot2ADSs2daLaWcfXSvcT2";
  const onCaptchaReady = (event) => {
    console.log("recaptcha init has completed.");
    /*
     │You can enable your form button here.
     */
  };

  const onCaptchaSuccess = (event) => {
    console.log("reCaptcha success");
    recaptchaToken = event.detail.token;

    const hiddenField = document.getElementById('recaptcha-token');
    if (hiddenField) hiddenField.value = recaptchaToken;

  };

  const onCaptchaError = (event) => {
    console.log("recaptcha init has failed.");
    /*
     │Usually due to incorrect siteKey.
     |Make sure you have the correct siteKey..
     */
  };

  const onCaptchaExpire = (event) => {
    console.log("recaptcha api has expired");
    /*
     │Normally, you wouldn't need to do anything.
     │Recaptcha should reinit itself automatically.
     */
  };

  const onCaptchaOpen = (event) => {
    console.log("Issued user Challenge");
    /*
     │This fires when the puzzle frame pops.
     */
  };

  const onCaptchaClose = (event) => {
    console.log("google decided to challange the user");
    /*
     │This fires when the puzzle frame closes.
     │Usually happens when the user clicks outside
     |the modal frame.
     */
  };

  // End of ReCAPTCHA


  /*
    This page is where a user can provide credentials to create a new account.
    The user should then be redirected to the login page.
    TODO: Email verification? If so, prompt user to open their emails instead,
    and add a page which redirects to login which is linked from the email.
    @see https://kit.svelte.dev/docs/form-actions
    */
  import { redirect } from '@sveltejs/kit';

  /** @type {import('./$types').PageData} */
  export let data;

  /** @type {import('./$types').ActionData} */
  export let form;
</script>

<Meta title="Register" />

<main class="container m-auto flex flex-col items-center my-5">
  <h2 class="text-4xl mb-5">Register</h2>
  
  {#if form?.message}
    <div class={form?.success ? 'text-success' : 'text-error'}>{form?.message}</div>
  {/if}

  <form method="POST">
    <div class="form-control w-full max-w-xs">
      <label class="label" for="username">
        <span class="label-text">Username</span>
      </label>
      <input id="username" name="username" type="text" required class="input input-bordered w-full max-w-xs" />
    </div>
    <div class="form-control w-full max-w-xs">
      <label class="label" for="email">
        <span class="label-text">Email</span>
      </label>
      <input id="email" name="email" type="email" required class="input input-bordered w-full max-w-xs" />
    </div>
    <div class="form-control w-full max-w-xs">
      <label class="label" for="password">
        <span class="label-text">Password</span>
      </label>
      <input id="password" name="password" type="password" required class="input input-bordered w-full max-w-xs" />
    </div>

    <div class="pt-4">
      <Recaptcha
        sitekey={googleRecaptchaSiteKey}
        badge={"top"}
        size={"v2"}
        on:success={onCaptchaSuccess}
        on:error={onCaptchaError}
        on:expired={onCaptchaExpire}
        on:close={onCaptchaClose}
        on:ready={onCaptchaReady} />
    </div>

    <div class="form-control w-full max-w-xs mt-5">
      <button type="submit" class="btn btn-primary">Create account</button>
    </div>

    <input type="hidden" id="recaptcha-token" name="recaptcha-token" />
  </form>
</main>

<style></style>
