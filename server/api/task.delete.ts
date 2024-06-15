import { writeTask } from '~/utils/sqllite/models';

export default defineEventHandler(async (event) => {
  const { id } = await readBody<{
    id: number
  }>(event);

  const task = await writeTask.findByPk(id);

  await task?.destroy();

  return true;
});
