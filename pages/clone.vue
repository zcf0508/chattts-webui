<script setup lang="ts">
import { StorageSerializers } from '@vueuse/core';
import { type UploadFile, type UploadInstance, type UploadProps, type UploadRawFile, type UploadUserFile, genFileId } from 'element-plus';
import { fi } from 'element-plus/es/locales.mjs';

const form = useLocalStorage('clone-form', {
  content: '',
  seed: 0,
  savedName: '',
}, {
  serializer: StorageSerializers.object,
});

const uploadList = ref<UploadUserFile[]>([]);

const referenceFile = computed(() => uploadList.value[0]?.raw);
const referenceFileURL = computed(() => referenceFile.value
  ? URL.createObjectURL(referenceFile.value)
  : '');

function clearForm() {
  form.value.content = '';
  form.value.seed = 0;
  form.value.savedName = '';

  uploadList.value = [];
}

const upload = ref<UploadInstance>();

function handleFileChange(_: UploadFile, fileList: UploadFile[]) {
  uploadList.value = fileList;
}

const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value?.clearFiles();
  uploadList.value = [];
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  upload.value!.handleStart(file);
};

const loading = ref(false);

async function addTask() {
  if (!form.value.content || !referenceFile.value) {
    return;
  }

  try {
    loading.value = true;

    const formData = new FormData();
    formData.append('file', referenceFile.value);

    const reference = await $fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    await $fetch('/api/task', {
      method: 'POST',
      body: {
        ...form.value,
        reference,
      },
    });
    navigateTo('/tasks');
  }
  catch (e: any) {
    ElMessage.error(`${e.data.message || e}`);
  }
  finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="max-w-[640px] mx-auto">
    <el-form :label-width="80">
      <el-form-item label="内容" required>
        <el-input
          v-model="form.content"
          type="textarea"
          :autosize="{ minRows: 3 }"
        />
      </el-form-item>
      <el-form-item label="音色源" required>
        <el-upload
          ref="upload"
          v-model:file-list="uploadList"
          :on-change="handleFileChange"
          :on-exceed="handleExceed"
          show-file-list
          :multiple="false"
          :limit="1"
          :auto-upload="false"
          accept=".wav"
        >
          <el-button type="primary">
            选择文件
          </el-button>
        </el-upload>
        <!-- 试听 -->
        <audio
          v-if="referenceFile"
          :key="referenceFile.name"
          controls
          :src="referenceFileURL"
          preload="none"
        ></audio>
      </el-form-item>
      <el-form-item label="语音种子" required>
        <div class="w-full flex items-center gap-2">
          <el-input-number v-model="form.seed" class="w-full!" :min="0" />
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
        <el-button type="primary" :disabled="loading" @click="addTask">
          开始任务
        </el-button>
        <el-button @click="clearForm">
          清空
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>

</style>
