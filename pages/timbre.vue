<script setup lang="ts">
import { StorageSerializers } from '@vueuse/core';

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
</script>

<template>
  <div>
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
