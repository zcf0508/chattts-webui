<script setup>
const { data: inited } = useFetch('/api/init');
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage v-if="inited" />
    </NuxtLayout>
  </div>
</template>

<style>
body{
  margin: 0;
  padding: 0;
}
</style>
