import { createReadStream, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const audiosPath = './audios';

export default defineEventHandler(async (event) => {
  const filename = decodeURIComponent(event.context.params?.name || '');

  try {
    if (!filename) { throw createError('missing filename path params'); }

    const filePath = join(__dirname, '../../', audiosPath, filename);

    if (existsSync(filePath)) {
      return sendStream(event, createReadStream(filePath));
    }
    else {
      console.log('文件不存在');
      return null;
    }
  }
  catch (error) {
    return null;
  }
});
