<script>
  import Meta from "$lib/components/Meta.svelte";
  /**
   This page displays a search box, and allows users to search for posts.
   Results should be displayed if a query has been provided.
   */
  /** @type {import("./$types").PageData} */
  export let data;

  /** @type {import("./$types").ActionData} */
  export let form;
</script>

<Meta title="Search" />

<main class="container">
  <h2>Search</h2>
  <form method="POST">
    <input name="query" type="text" placeholder={"Search..."}
           value={form?.query ?? ''} />
    <input type="submit" hidden />
  </form>
</main>

<style></style>
