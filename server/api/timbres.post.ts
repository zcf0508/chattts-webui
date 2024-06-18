import { writeTimbre } from '~/utils/sqllite/models';

export default defineEventHandler(async (event) => {
  let timbresData = await readBody<Array<{
    seed: number
    remark: string
  }>>(event);

  // 去除已经存在的数据
  const existTimbres = await writeTimbre.findAll({
    where: {
      id: timbresData.map(t => t.seed),
    },
  });
  const existTimbreMap = new Map(existTimbres.map(t => [t.id, t]));

  timbresData = timbresData.filter(t => !existTimbreMap.has(t.seed));

  await writeTimbre.bulkCreate(timbresData.map(t => ({
    id: t.seed,
    remark: t.remark,
  })));

  return true;
});
