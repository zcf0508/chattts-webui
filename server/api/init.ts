import { existsSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readSequelize, writeSequelize } from '~/utils/sqllite/models';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineEventHandler(async () => {
  if (!existsSync(join(__dirname, '../../', 'chattts.db'))) {
    writeFileSync(join(__dirname, '../../', 'chattts.db'), '');
  }

  await readSequelize.sync();
  await writeSequelize.sync();
  return true;
});
