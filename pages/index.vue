<script setup lang="ts">
const { data: tasks, execute } = useFetch('/api/tasks');

async function addTask() {
  await useFetch('/api/task', {
    method: 'POST',
    body: {
      content: '早上好啊',
      seed: 22123,
      savedName: 'testaaa',
    },
  });
  execute();
}

async function deleteTask(id: number) {
  await useFetch('/api/task', {
    method: 'DELETE',
    body: {
      id,
    },
  });
  execute();
}
</script>

<template>
  <div>
    {{ tasks }}
    <div v-for="{ id, status } in tasks" :key="id" class="flex">
      <span>{{ id }}-{{ status }}</span>
      <Button @click="deleteTask(id)">
        删除
      </Button>
    </div>
    <Button @click="addTask">
      添加任务
    </Button>
  </div>
</template>

<style scoped>

</style>
