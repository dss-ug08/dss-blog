<script>
  import Meta from "$lib/components/Meta.svelte";
  /* 
    This page is where a user can provide credentials to get a login session.
    Authentication-only pages should be redirected here if no user session exists.
    @see https://kit.svelte.dev/docs/form-actions
    */

  import { Recaptcha } from "svelte-recaptcha-v2";


  // --- Start of recaptcha stuff

  let recaptchaToken = null;

  /*
   │Recaptcha: svelte <Recaptcha> component.
   │recaptcha: google method, gives you recaptcha.execute().
   │observer: allows you to track captcha state across components.
   */
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


  // --- End of recaptcha stuff

  /** @type {import("./$types").PageData} */
  export let data;

  /** @type {import("./$types").ActionData} */
  export let form;
</script>

<Meta title="Login" />

<main class="container m-auto flex flex-col items-center my-5">
  <h2 class="text-4xl mb-5">Login</h2>

  {#if form?.message}
    <div
      class={form?.success ? 'text-success' : 'text-error'}>{form?.message}</div>
  {/if}

  <form method="POST">
    <div class="form-control w-full max-w-xs">
      <label class="label" for="username">
        <span class="label-text">Username</span>
      </label>
      <input id="username" name="username" type="text"
             class="input input-bordered w-full max-w-xs" required />
    </div>
    <div class="form-control w-full max-w-xs">
      <label for="password">
        <span class="label-text">Password</span>
      </label>
      <input id="password" name="password" type="password"
             class="input input-bordered w-full max-w-xs" required />
    </div>
    <div class="form-control w-full max-w-xs">
      <label for="code">
        <span class="label-text">TOTP Code (if enabled)</span>
      </label>
      <input type="text" name="code" id="code"
             class="input input-bordered w-full" minlength="6" maxlength="6"
             inputmode="numeric" pattern="\d*" />
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
      <button type="submit" class="btn btn-primary">Log in</button>
    </div>

    <input type="hidden" id="recaptcha-token" name="recaptcha-token" />
  </form>

</main>

<style></style>
