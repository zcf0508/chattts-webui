from flask import Flask, request, jsonify
import ChatTTS
import numpy as np
import wave
import io

app = Flask(__name__)

chat = ChatTTS.Chat()
try:
    chat.load_models()
except Exception as e:
    print("The model maybe broke will load again")
    chat.load_models(force_redownload=True)

@app.route("/synthesize", methods=["POST"])
def synthesize():
    try:
        data = request.get_json()
        if not data or "text" not in data:
            return jsonify({"error": "Missing text parameter"}), 400
            
        text = data["text"]
        seed = data.get("seed", None)

        # 合成语音
        texts = [text]
        if seed:
            r = chat.sample_random_speaker(seed=seed)
            params_infer_code = {
                "spk_emb": r,  # add sampled speaker
                "temperature": 0.3,  # using custom temperature
                "top_P": 0.7,  # top P decode
                "top_K": 20,  # top K decode
            }
            wavs = chat.infer(texts, use_decoder=True, params_infer_code=params_infer_code)
        else:
            wavs = chat.infer(texts, use_decoder=True)

        # 处理音频格式
        audio_data = np.array(wavs[0], dtype=np.float32)
        sample_rate = 24000
        audio_data = (audio_data * 32767).astype(np.int16)

        # 写入内存缓冲区
        buf = io.BytesIO()
        with wave.open(buf, "wb") as wf:
            wf.setnchannels(1)  # Mono channel
            wf.setsampwidth(2)  # 2 bytes per sample
            wf.setframerate(sample_rate)
            wf.writeframes(audio_data.tobytes())
        
        buf.seek(0)
        return jsonify({"audio": buf.read().hex()})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)