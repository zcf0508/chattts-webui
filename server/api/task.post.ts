import { writeTask } from '~/utils/sqllite/models';

export default defineEventHandler(async (event) => {
  const { content, seed, savedName } = await readBody<{
    content: string
    seed: number
    savedName: string
  }>(event);

  const task = await writeTask.create({ content, status: 0, seed, savedName });

  return task.toJSON();
});
