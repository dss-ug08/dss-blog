<script>
  import Header from "$lib/components/Header.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import "@picocss/pico";
  import "$lib/app.css";
</script>

<Header />

<!--
    <slot> is a special element which puts any content provided when calling a component inside it.
    In the context of a layout file, this is where the page contents is inserted.
-->
<slot></slot>

<Footer />

<style>
</style>
