<script>
  export let screen = false;
</script>

<div class="hero {screen ? 'min-h-screen' : 'py-20'} bg-base-200">
  <div class="hero-content text-center">
    <div class="max-w-md">
      <h1 class="text-4xl font-bold">
        <slot name="title"></slot>
      </h1>

      <div class="py-6">
        <slot></slot>
      </div>

      <slot name="buttons"></slot>
    </div>
  </div>
</div>

<style></style>
