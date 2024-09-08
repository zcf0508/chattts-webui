import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import type { Buffer } from 'node:buffer';

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event);

  const reference = formData?.find(item => item.name === 'file');

  const resoucesPath = './resources';

  if (!existsSync(resoucesPath)) {
    mkdirSync(resoucesPath, { recursive: true });
  }
  if (reference) {
    let savePath = `${resoucesPath}/${reference.filename}`;

    if (existsSync(savePath)) {
      savePath = `${resoucesPath}/${Date.now()}-${reference.filename}`;
    }

    writeFileSync(savePath, reference.data as Buffer);
    return savePath;
  }
  else {
    throw createError({
      statusCode: 400,
      message: '文件保存失败',
    });
  }
});
