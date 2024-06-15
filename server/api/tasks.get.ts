import { readTask } from '~/utils/sqllite/models';

export default defineEventHandler(async () => {
  const tasks = await readTask.findAll({
    where: {
      deleted: 0,
    },
    order: [
      ['id', 'DESC'],
    ],
  });
  return tasks.map(task => task.toJSON());
});
