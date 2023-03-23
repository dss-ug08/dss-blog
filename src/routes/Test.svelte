<script>
    import {onMount} from "svelte";

    export let target = "World";
    onMount(async () => {
        console.log("Hello, World!");
    });
</script>

<div class="test">
    <h1>Hello, {target}!</h1>
</div>

<style>
</style>