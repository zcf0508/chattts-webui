<script setup lang="ts">
import { StorageSerializers } from '@vueuse/core';

const form = useLocalStorage('form', {
  content: '',
  seed: 0,
  savedName: '',
}, {
  serializer: StorageSerializers.object,
});

function clearForm() {
  form.value.content = '';
  form.value.seed = 0;
  form.value.savedName = '';
}

async function addTask() {
  if (!form.value.content) {
    return;
  }

  const { error } = await useFetch('/api/task', {
    method: 'POST',
    body: form.value,
  });
  if (!error.value) {
    navigateTo('/tasks');
  }
  else {
    ElMessage.error(`${error.value.data.message}`);
  }
}
</script>

<template>
  <div class="max-w-[500px] mx-auto">
    <el-form :label-width="80">
      <el-form-item label="内容" required>
        <el-input
          v-model="form.content"
          type="textarea"
          :autosize="{ minRows: 2 }"
        />
      </el-form-item>
      <el-form-item label="音色种子" required>
        <div class="w-full flex items-center gap-2">
          <el-input-number v-model="form.seed" class="w-full!" />
          <span
            class="i-game-icons:rolling-dices size-[1.5rem] text-gray-6 cursor-pointer"
            @click="() => {
              form.seed = Math.floor(Math.random() * 100000000);
            }"
          ></span>
        </div>
      </el-form-item>
      <el-form-item label="保存名称">
        <el-input v-model="form.savedName" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addTask">
          添加任务
        </el-button>
        <el-button @click="clearForm">
          重置
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>

</style>
