<script setup lang="ts">
import { statusLabel } from '~/utils';

const { data: tasks, execute } = useFetch('/api/tasks');

let timer: NodeJS.Timeout | undefined;
watchEffect(() => {
  if (timer === undefined && tasks.value?.find(task => task.status === 1)) {
    timer = setInterval(() => {
      execute();
    }, 1000);
  }
  else if (!tasks.value?.find(task => task.status === 1)) {
    timer && clearInterval(timer);
    timer = undefined;
  }
});

onBeforeUnmount(() => {
  timer && clearInterval(timer);
  timer = undefined;
});

type Task = ((typeof tasks.value) & object)[0];

async function deleteTask(id: number) {
  await $fetch('/api/task', {
    method: 'DELETE',
    body: {
      id,
    },
  });
  execute();
}

function downloadAudio(savedName: string) {
  window.open(`/audios/${savedName}.wav`);
}

function saveTimbre(task: Task) {
  ElMessageBox.prompt('请添加音色备注', '提示', {
    confirmButtonText: '提交',
    cancelButtonText: '取消',
  })
    .then(async ({ value }) => {
      await $fetch('/api/timbre', {
        method: 'post',
        body: {
          seed: task.seed,
          remark: value,
        },
      });
      ElMessage.success('添加成功');
    })
    .catch(() => {});
}
</script>

<template>
  <div>
    <el-table :data="tasks || []" style="width: 100%">
      <!-- <el-table-column prop="id" label="Id" width="180" /> -->
      <el-table-column prop="content" label="内容" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }:{row: Task}">
          {{ statusLabel(row.status) }}
        </template>
      </el-table-column>
      <el-table-column prop="seed" label="音色种子" width="100" />
      <el-table-column prop="savedName" label="文件名" width="100" />
      <el-table-column label="音频" width="400" align="center">
        <template #default="{ row }:{row: Task}">
          <audio
            v-if="row.status === 2"
            controls
            :src="`/audios/${row.savedName}.wav`"
            preload="none"
          ></audio>
          <span v-else-if="row.status === 1" class="i-eos-icons:bubble-loading size-8"></span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }:{row: Task}">
          <div class="flex items-center gap-1">
            <el-button v-if="row.status === 2" @click="downloadAudio(row.savedName)">
              下载
            </el-button>
            <el-button v-if="row.status === 2" @click="saveTimbre(row)">
              保存音色
            </el-button>
            <el-button type="danger" @click="deleteTask(row.id)">
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
