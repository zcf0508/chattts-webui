import { readTask } from '~/utils/sqllite/models';

export default defineEventHandler(async () => {
  const tasks = await readTask.findAll();
  return tasks.map(task => task.toJSON());
});
