<script>
  //TODO: Get this from server-side
  const siteName = 'dss-blog';
  const siteDesc = "dss-blog is an example blog site built with SvelteKit designed with Secure Software Development principles in mind.";

  /** @type {string} */
  export let title;
  /** @type {string} */
  export let titleTemplate = `%s | ${siteName}`;
  /** @type {string} */
  export let description = siteDesc;

  /** @type {string} */
  $: composedTitle = title ? titleTemplate.replace(/%s/g, title) : siteName;
</script>

<svelte:head>
  <title>{composedTitle}</title>

  <!-- Standard Meta Tags -->
  <meta name="theme-color" content="#FFFFFF">
  {#if description}
  <meta name="description" content={description} />
  {/if}

  <!-- OpenGraph -->
  <meta content={composedTitle} property="og:title">
  <meta content={siteName} property="og:site_name">
  {#if description}
  <meta content={description} property="og:description">
  {/if}
  <!--<meta content='https://discordapp.com/assets/ba74954dde74ff40a32ff58069e78c36.png' property='og:image'>-->
</svelte:head>
