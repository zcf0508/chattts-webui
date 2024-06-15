import { writeTimbre } from '~/utils/sqllite/models';

export default defineEventHandler(async (event) => {
  const { id } = await readBody<{
    id: number
  }>(event);

  const hasAddedTinmre = await writeTimbre.findOne({
    where: {
      id,
    },
  });

  if (hasAddedTinmre) {
    await hasAddedTinmre.destroy();
  }

  return true;
});
