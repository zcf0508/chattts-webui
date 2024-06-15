import { existsSync, mkdirSync } from 'node:fs';
import { execa } from 'execa';

export const chatttsTaskMap = new Map<number, AbortController>();

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

  for await (const line of execa({
    cancelSignal: controller.signal,
    gracefulCancel: true,
  })`chattts "${content.replace('"', '\\\'')}" -o ${audiosPath}/${savedName}.wav --seed ${seed} `) {
    if (line.includes('Generate Done for file')) {
      success?.();
      isSuccessful = true;
    }
  }

  if (!isSuccessful) {
    error?.();
  }

  chatttsTaskMap.delete(id);
}

export default chattts;
