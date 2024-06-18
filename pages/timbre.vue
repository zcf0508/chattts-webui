<script setup lang="ts">
import { utils, writeFileXLSX } from 'xlsx';
import { StorageSerializers } from '@vueuse/core';
import dayjs from 'dayjs';
import { ca } from 'element-plus/es/locales.mjs';

const { data: timbres, execute } = useFetch('/api/timbres');
type Timbre = ((typeof timbres.value) & object)[0];

async function deleteTimbre(id: number) {
  await $fetch('/api/timbre', {
    method: 'DELETE',
    body: {
      id,
    },
  });
  execute();
}

const form = useLocalStorage('form', {
  content: '',
  seed: 0,
  savedName: '',
}, {
  serializer: StorageSerializers.object,
});

function ApplyTimbre(seed: number) {
  form.value.seed = seed;
  navigateTo('/');
}

function shareTimbre() {
  // 导出成表格，并下载，仅保留 seed 和 remark
  const rows = timbres.value?.map(({ id: seed, remark }) => ({ seed, remark }));
  if (rows) {
    const worksheet = utils.json_to_sheet(rows);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet);
    writeFileXLSX(workbook, `timbres_${dayjs().format('YYYY-MM-DD_HH:mm:ss')}.csv`, {
      bookType: 'csv',
      bookSST: false,
      type: 'file',
    });
  }
}

const { fileInputRef, data, uploadFile, onFileChange, error } = useReadCsv<{
  seed: number
  remark: string
}>();

watch(() => [data.value.length, error.value] as const, async ([val, err]) => {
  if (!val) {
    return;
  }
  if (err) {
    return ElMessage.error(err);
  }
  try {
    await $fetch('/api/timbres', {
      method: 'POST',
      body: data.value,
    });
    ElMessage.success('导入成功');
    execute();
  }
  catch (e) {
    ElMessage.error('导入失败');
  }
  finally {
    data.value = [];
  }
});
</script>

<template>
  <div>
    <input
      ref="fileInputRef"
      type="file"
      style="display: none"
      @change="onFileChange"
    >
    <div class="my-2 flex flex-row-reverse">
      <div class="flex gap-2">
        <el-button @click="uploadFile">
          导入
        </el-button>
        <el-button @click="shareTimbre">
          导出
        </el-button>
      </div>
    </div>
    <el-table :data="timbres || []" style="width: 100%">
      <el-table-column prop="id" label="音色种子" width="100" />
      <el-table-column prop="remark" label="备注" />
      <el-table-column label="试听" width="400" align="center">
        <template #default="{ row }:{row: Timbre}">
          <audio
            v-if="row.example"
            controls
            :src="`/audios/${row.example}.wav`"
            preload="none"
          ></audio>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }:{row: Timbre}">
          <div class="flex items-center gap-1">
            <el-button type="primary" @click="ApplyTimbre(row.id)">
              使用
            </el-button>
            <el-button type="danger" @click="deleteTimbre(row.id)">
              删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>

</style>
