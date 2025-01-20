from flask import Flask, request, jsonify
import requests
import os
import torch
from openvoice import se_extractor
from openvoice.api import ToneColorConverter
from melo.api import TTS

app = Flask(__name__)


RESOURCES_DIR = os.getenv('RESOURCES_DIR', '../../resources')
OUTPUT_DIR = os.getenv('OUTPUT_DIR', '../../audios')
os.makedirs(OUTPUT_DIR, exist_ok=True)
CHATTTS_URL = os.getenv('CHATTTS_URL', 'http://127.0.0.1:5000')
CHECKPOINTS_DIR = os.getenv('CHECKPOINTS_DIR', '../../checkpoints_v2')
ckpt_converter = os.path.join(CHECKPOINTS_DIR, 'converter')

device = "cuda:0" if torch.cuda.is_available() else "cpu"

tone_color_converter = ToneColorConverter(f'{ckpt_converter}/config.json', device=device)
tone_color_converter.load_ckpt(f'{ckpt_converter}/checkpoint.pth')

@app.route("/clone", methods=["POST"])
def clone_voice():
    try:
        data = request.get_json()
        if not data or "text" not in data or "reference" not in data or "savedName" not in data:
            return jsonify({"error": "Missing required parameters"}), 400
            
        text = data["text"]
        reference = data["reference"]
        seed = data.get("seed", None)
        saved_name = f"{data['savedName']}.wav"

        # 1. 调用chattts服务生成基础音频
        chattts_url = f"{CHATTTS_URL}/synthesize"
        response = requests.post(chattts_url, json={
            "text": text,
            "seed": seed
        })
        
        if response.status_code != 200:
            return jsonify({"error": "ChatTTS service error"}), 500
            
        # 2. 处理音频克隆
        src_path = os.path.join(OUTPUT_DIR, f"temp_{saved_name}")
        save_path = os.path.join(OUTPUT_DIR, saved_name)
        
        # 保存chattts生成的音频
        audio_data = bytes.fromhex(response.json()["audio"])
        with open(src_path, "wb") as f:
            f.write(audio_data)
        
        # 执行克隆逻辑
        reference_path = os.path.join(RESOURCES_DIR, reference)
        target_se, _ = se_extractor.get_se(reference_path, tone_color_converter, vad=False)
        model = TTS(language="ZH", device=device)
        speaker_ids = model.hps.data.spk2id

        for speaker_key in speaker_ids.keys():
            speaker_id = speaker_ids[speaker_key]
            speaker_key = speaker_key.lower().replace('_', '-')

            source_se = torch.load(os.path.join(CHECKPOINTS_DIR, 'base_speakers/ses', f'{speaker_key}.pth'), map_location=device)
            model.tts_to_file(text, speaker_id, src_path, speed=1.0)

            source_se, _ = se_extractor.get_se(src_path, tone_color_converter, target_dir='processed', vad=True)
            print(save_path)
            # 运行音色转换
            encode_message = "@MyShell"
            tone_color_converter.convert(
                audio_src_path=src_path,
                src_se=source_se,
                tgt_se=target_se,
                output_path=save_path,
                message=encode_message
            )

        # 清理临时文件
        if os.path.exists(src_path):
            os.remove(src_path)
        
        print(saved_name)
        
        return jsonify({"audio": saved_name})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)