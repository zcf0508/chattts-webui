import { readSequelize, writeSequelize } from '~/utils/sqllite/models';

export default defineEventHandler(async () => {
  await readSequelize.sync();
  await writeSequelize.sync();
  return true;
});
