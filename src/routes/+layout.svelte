<script>
    import '@picocss/pico';
    import '$lib/css/global.css';
</script>

<header>
    <!--This is where a navbar should go-->
    <h1>dss-blog</h1>
</header>

<!--
    <slot> is a special element which puts any content provided when calling a component inside it.
    In the context of a layout file, this is where the page contents is inserted.
-->
<slot></slot>

<footer>
    <!--This is where you would put the footer-->
    <small>Copyright &copy; Jack Mawer et al.</small>
</footer>


<style>
    header,
    slot,
    footer {
        width: 100%;
        margin-right: auto;
        margin-left: auto;
        padding: var(--block-spacing-vertical) 0;
    }
</style>