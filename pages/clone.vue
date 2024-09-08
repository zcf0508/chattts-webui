<script setup lang="ts">
import { StorageSerializers } from '@vueuse/core';
import { type UploadFile, type UploadInstance, type UploadProps, type UploadRawFile, type UploadUserFile, genFileId } from 'element-plus';

const form = useLocalStorage('clone-form', {
  content: '',
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

async function addTask() {
  if (!form.value.content || !referenceFile.value) {
    return;
  }

  try {
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
      <el-form-item label="音色种子" required>
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
      <el-form-item label="保存名称">
        <el-input v-model="form.savedName" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addTask">
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
