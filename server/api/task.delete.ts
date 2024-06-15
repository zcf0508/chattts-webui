import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { rename } from 'node:fs/promises';
import { writeTask } from '~/utils/sqllite/models';
import { chatttsTaskMap } from '~/utils/chattts';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineEventHandler(async (event) => {
  const { id } = await readBody<{
    id: number
  }>(event);

  const task = await writeTask.findByPk(id);

  if (task) {
    task.deleted = 1;
    await task.save();
    if (existsSync(join(__dirname, '../../', 'audios', `${task.savedName}.wav`))) {
      rename(
        join(__dirname, '../../', 'audios', `${task.savedName}.wav`),
        join(__dirname, '../../', 'audios', `_${task.savedName}_${task.id}.wav`),
      ).catch(() => {});
    }
  }

  // 中断任务
  if (chatttsTaskMap.has(id)) {
    chatttsTaskMap.get(id)!.abort();
    chatttsTaskMap.delete(id);
  }

  return true;
});
