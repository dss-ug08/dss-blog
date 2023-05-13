<script>
  /** @type string */
  export let imgSrc;
  /** @type string */
  export let imgAlt;
  /** @type number */
  export let width;
</script>

<div class="card {width ? `w-${width}` : ''} bg-base-100 shadow-xl">
  {#if imgSrc}
    <figure><img src={imgSrc} alt={imgAlt} /></figure>
  {/if}
  <div class="card-body">
    <h2 class="card-title"><slot name="title"></slot></h2>
    <slot></slot>
    <div class="card-actions justify-end">
      <slot name="buttons"></slot>
    </div>
  </div>
</div>

<style></style>
