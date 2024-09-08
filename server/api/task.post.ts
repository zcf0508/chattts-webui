import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import chattts, { chatttsClone } from '~/utils/chattts';

import { readTask, writeTask } from '~/utils/sqllite/models';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineEventHandler(async (event) => {
  const { content, seed = -1, reference = '', savedName: _savedName } = await readBody<{
    content: string
    savedName: string
    seed?: number
    reference?: string
  }>(event);

  let savedName = _savedName.replaceAll(' ', '_');

  if (savedName) {
    const hasSameNameTask = await readTask.findOne({ where: { savedName, deleted: 0 } });

    if (
      existsSync(join(__dirname, '../../', 'audios', `${savedName}.wav`))
      || hasSameNameTask
    ) {
      throw createError({
        statusCode: 400,
        message: '文件名已经存在',
      });
    }
  }

  const hasUnfinishedTask = await readTask.findOne({ where: { deleted: 0, status: 1 } });

  if (hasUnfinishedTask) {
    throw createError({
      statusCode: 400,
      message: '已经有一个任务在进行中，请稍后再试',
    });
  }

  const task = await writeTask.create({ content, status: 0, seed, reference, savedName, deleted: 0 });

  if (!savedName) {
    savedName = savedName || `未命名音频_${task.id}`;
    task.savedName = savedName;
    task.save();
  }

  try {
    if (reference) {
      chatttsClone({
        id: task.id,
        content: content.replaceAll('\n', '').trim(),
        reference,
        savedName,
      }, () => {
        task.status = 2;
        task.save();
      }, () => {
        task.status = -1;
        task.save();
      });

      task.status = 1;
      task.save();
    }
    else if (seed > 0) {
      chattts({ id: task.id, content: content.replaceAll('\n', '').trim(), seed, savedName }, () => {
        task.status = 2;
        task.save();
      }, () => {
        task.status = -1;
        task.save();
      });

      task.status = 1;
      task.save();
    }
  }
  catch (e) {
    console.error(e);
    task.status = -1;
    task.save();
  }

  return task.toJSON();
});
