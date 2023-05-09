<script>
  import Meta from "$lib/components/Meta.svelte";
  /**
   This page is shown when an error occurs within the application. The primary concerns are 404 pages, especially
   for the case of missing posts, and 500 pages for internal server errors. Potentially 401 and 403 unauthorized
   errors for posts which aren't visible to the current user/public.
   */
  import { page } from "$app/stores";
</script>

<Meta title="Error {$page.status}" description="Something went wrong while loading this page. Please check back later." />

<main class="container">
  <h2>Error {$page.status}: {$page.error?.message}</h2>
  <p>Something went wrong while loading the page you were looking for.</p>
  <a href="/" role="button">Go Home</a>
</main>


<style></style>
