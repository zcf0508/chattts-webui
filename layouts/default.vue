<script setup lang="ts">

</script>

<template>
  <el-container>
    <el-header
      class="
        fixed top-0 z-10 w-screen bg-white
        h-12 border-0 border-b border-gray-200 border-solid shadow-sm
      "
    >
      <div
        class="
          container h-full mx-auto
          flex items-center justify-between
        "
      >
        <div class="flex items-center gap-2">
          <span class="font-bold">
            <a href="https://github.com/yihong0618/ChatTTS" class="decoration-none text-dark">
              Chat TTS
            </a>
            web-ui
          </span>
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
        <span>
          <a href="https://huali.cafe/" class="decoration-none text-dark">
            huali
          </a>
        </span>
      </div>
    </el-header>
    <el-main class="w-full mt-12">
      <div class="container mx-auto">
        <slot></slot>
      </div>
    </el-main>
  </el-container>
</template>

<style scoped>

</style>
