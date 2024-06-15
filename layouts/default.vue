<script setup lang="ts">

</script>

<template>
  <div>
    <header class="w-full h-12 border-0 border-b border-gray-200 border-solid">
      <div
        class="
          container h-full mx-auto
          flex items-center justify-between
        "
      >
        <span class="font-bold">Chat TTS web-ui</span>
        <span>huali</span>
      </div>
    </header>
    <div class="w-full pt-4">
      <div class="container mx-auto">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
