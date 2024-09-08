import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { Buffer } from 'node:buffer';
import { execa } from 'execa';

export const chatttsTaskMap = new Map<number, AbortController>();

function processContent(content: string) {
  // 1. 移除换行
  content = content.replaceAll(/\n/g, ',');
  // 2. 移除标点
  content = content.replaceAll(/["'“”‘’《》[\]【】]/g, '');
  // 3. 替换中文标点
  content = content.replaceAll('，', ',');
  content = content.replaceAll('、', ',');
  content = content.replaceAll('；', ',');
  content = content.replaceAll('。', '.');
  content = content.replaceAll('！', '!');
  content = content.replaceAll('？', '?');
  content = content.replaceAll('：', ':');

  return content;
}

async function chattts({
  id,
  content,
  seed,
  savedName,
}: {
  id: number
  content: string
  seed: number
  savedName: string
}, success?: () => void, error?: () => void) {
  let isSuccessful = false;

  const controller = new AbortController();

  chatttsTaskMap.set(id, controller);

  const audiosPath = './audios';

  if (!existsSync(audiosPath)) {
    mkdirSync(audiosPath, { recursive: true });
  }
  try {
    for await (const line of execa({
      cancelSignal: controller.signal,
      gracefulCancel: true,
    })`chattts "${processContent(content)}" -o ${audiosPath}/${savedName}.wav --seed ${seed} `) {
      if (line.includes('Generate Done for file')) {
        success?.();
        isSuccessful = true;
      }
    }

    if (!isSuccessful) {
      error?.();
    }
  }
  catch (e) {
    console.error(e);
    error?.();
  }
  finally {
    chatttsTaskMap.delete(id);
  }
}

export async function chatttsClone({
  id,
  content,
  reference,
  seed,
  savedName,
}: {
  id: number
  content: string
  reference: string
  seed: number
  savedName: string
}, success?: () => void, error?: () => void) {
  let isSuccessful = false;

  const controller = new AbortController();

  chatttsTaskMap.set(id, controller);

  // clone audio
  const audiosPath = './audios';

  if (!existsSync(audiosPath)) {
    mkdirSync(audiosPath, { recursive: true });
  }
  try {
    for await (const line of execa({
      cancelSignal: controller.signal,
      gracefulCancel: true,
    })`python ./chattts_clone.py "${processContent(content)}" -r ${reference} -o ${audiosPath}/${savedName}.wav --seed ${seed} `) {
      if (line.includes('Generate Done for file')) {
        success?.();
        isSuccessful = true;
      }
    }

    if (!isSuccessful) {
      error?.();
    }
  }
  catch (e) {
    console.error(e);
    error?.();
  }
  finally {
    chatttsTaskMap.delete(id);
  }
}

export default chattts;
