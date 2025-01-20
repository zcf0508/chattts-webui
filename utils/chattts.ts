import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { Buffer } from 'node:buffer';
import process from 'node:process';

const CHATTTS_URL = process.env.CHATTTS_URL || 'http://127.0.0.1:5000';
const MELO_URL = process.env.MELO_URL || 'http://127.0.0.1:5001';

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
    const response = await fetch(`${CHATTTS_URL}/synthesize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: processContent(content),
        seed,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error('ChatTTS service error');
    }

    const audioData = await response.json();
    const audioBuffer = new Uint8Array(Buffer.from(audioData.audio, 'hex'));
    writeFileSync(`${audiosPath}/${savedName}.wav`, audioBuffer);

    success?.();
    isSuccessful = true;
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

  const audiosPath = './audios';
  if (!existsSync(audiosPath)) {
    mkdirSync(audiosPath, { recursive: true });
  }

  try {
    const response = await fetch(`${MELO_URL}/clone`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: processContent(content),
        reference: reference.replace('./resources/', ''),
        seed,
        savedName,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error('MeloTTS service error');
    }

    success?.();
    isSuccessful = true;
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
