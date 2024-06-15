import { readTimbre, writeTimbre } from '~/utils/sqllite/models';

export default defineEventHandler(async (event) => {
  const { seed, remark } = await readBody<{
    seed: number
    remark: string
  }>(event);

  const hasAddedTinmre = await readTimbre.findOne({
    where: {
      id: seed,
    },
  });

  if (!hasAddedTinmre) {
    await writeTimbre.create({
      id: seed,
      remark,
    });
  }
  else {
    throw createError({
      statusCode: 400,
      message: '音色已经保存',
    });
  }

  return true;
});
