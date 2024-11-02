import os
import torch
import argparse

os.environ['HTTP_PROXY'] = 'http://127.0.0.1:7890'
os.environ['HTTPS_PROXY'] = 'http://127.0.0.1:7890'

from openvoice import se_extractor
from openvoice.api import ToneColorConverter

from melo.api import TTS


ckpt_converter = 'checkpoints_v2/converter'
device = "cuda:0" if torch.cuda.is_available() else "cpu"
output_dir = 'audios'

tone_color_converter = ToneColorConverter(f'{ckpt_converter}/config.json', device=device)
tone_color_converter.load_ckpt(f'{ckpt_converter}/checkpoint.pth')

os.makedirs(output_dir, exist_ok=True)


# Speed is adjustable
speed = 1.0

def run(reference_speaker: str, save_path:str, text: str, seed: int):
  '''
  reference_speaker: This is the voice you want to clone
  save_path: The path to save the output audio
  '''

  src_path = save_path.replace('.wav', '_tmp.wav')

  target_se, _ = se_extractor.get_se(reference_speaker, tone_color_converter, vad=False)

  model = TTS(language="ZH", device=device)
  speaker_ids = model.hps.data.spk2id

  for speaker_key in speaker_ids.keys():
    speaker_id = speaker_ids[speaker_key]
    speaker_key = speaker_key.lower().replace('_', '-')

    source_se = torch.load(f'checkpoints_v2/base_speakers/ses/{speaker_key}.pth', map_location=device)
    model.tts_to_file(text, speaker_id, src_path, speed=speed)

    source_se, _ = se_extractor.get_se(src_path, tone_color_converter, target_dir='processed', vad=True)

    # Run the tone color converter
    encode_message = "@MyShell"
    tone_color_converter.convert(
        audio_src_path=src_path, 
        src_se=source_se, 
        tgt_se=target_se, 
        output_path=save_path,
        message=encode_message)

  os.remove(src_path)
  print("Generate Done for file")


if __name__ == '__main__':
  ap = argparse.ArgumentParser(description="Your text to tts")
  ap.add_argument("text", type=str, help="Your text")
  ap.add_argument(
      "-o", "--out-file", help="out file name", default="", dest="out_file"
  )
  ap.add_argument(
      "-s", "--seed", help="seed", type=int, dest="seed"
  )
  ap.add_argument(
      "-r", "--reference", help="reference speaker", default=None, dest="reference"
  )

  args = ap.parse_args()

  text = args.text
  save_path = args.out_file
  reference_speaker = args.reference
  seed = args.seed

  print(f"reference_speaker, {reference_speaker}")
  print(f"seed, {seed}")
  print(f"save_path, {save_path}")
  print(f"text, {text}")

  run(reference_speaker, save_path, text, seed)
