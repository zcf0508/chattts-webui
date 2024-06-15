<script setup lang="ts">

</script>

<template>
  <el-container>
    <el-header class="w-full h-12 border-0 border-b border-gray-200 border-solid">
      <div
        class="
          container h-full mx-auto
          flex items-center justify-between
        "
      >
        <div class="flex items-center gap-2">
          <span class="font-bold">Chat TTS web-ui</span>
          <ul class="list-none flex items-center gap-1">
            <li>
              <NuxtLink to="/">
                <el-button text>
                  生成
                </el-button>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/tasks">
                <el-button text>
                  任务列表
                </el-button>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/timbre">
                <el-button text>
                  音色列表
                </el-button>
              </NuxtLink>
            </li>
          </ul>
        </div>
        <span>huali</span>
      </div>
    </el-header>
    <el-main>
      <div class="container mx-auto">
        <slot></slot>
      </div>
    </el-main>
  </el-container>
</template>

<style scoped>

</style>
