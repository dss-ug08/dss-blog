<script>
    import '@picocss/pico';
    import '$lib/css/global.css';
</script>

<header></header>
<slot></slot>
<footer></footer>


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