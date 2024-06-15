import { Op } from 'sequelize';
import { readTask, readTimbre } from '~/utils/sqllite/models';

export default defineEventHandler(async () => {
  const timbres = await readTimbre.findAll({
    order: [
      ['id', 'DESC'],
    ],
  });

  const seeds = timbres.map(t => t.id);

  const tasks = await readTask.findAll({
    where: {
      seed: {
        [Op.in]: seeds,
      },
      deleted: 0,
    },
    group: 'seed',
  });

  return timbres.map((timbre) => {
    return {
      ...timbre.toJSON(),
      example: tasks.find(t => t.seed === timbre.id)?.savedName,
    };
  });
});
