import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readSequelize, writeSequelize } from '~/utils/sqllite/models';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineEventHandler(async () => {
  const dbDir = join(__dirname, '../../', './db');
  const dbFilePath = join(dbDir, 'chattts.db');
  if (!existsSync(dbDir)) {
    mkdirSync(dbDir, { recursive: true });
  }
  if (!existsSync(dbFilePath)) {
    writeFileSync(dbFilePath, '');
  }

  await readSequelize.sync();
  await writeSequelize.sync();
  return true;
});
