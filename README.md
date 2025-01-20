# ChatTTS WebUI

基于 Docker 的语音合成和声音克隆 Web 应用。

## 项目结构

该项目包含三个主要服务：

1. webui (端口: 3615)
   - 前端 Web 界面
   - 基于 Nuxt.js

2. chattts (端口: 5000)
   - 语音合成服务
   - 基于 FastAPI
   - 使用 ChatTTS 模型

3. melo (端口: 5001)
   - 声音克隆服务
   - 基于 FastAPI
   - 使用 OpenVoice 和 MeloTTS

## 目录要求

在启动服务之前，请确保以下目录结构存在：

```
checkpoints_v2/
├── converter/
│   ├── config.json
│   └── checkpoint.pth
└── base_speakers/
    └── ses/
        └── [speaker-files].pth
```

## 运行要求

1. Docker 和 Docker Compose
2. NVIDIA GPU 支持（用于 melo 服务）
3. CUDA 11.8 和 cuDNN 8

## 如何运行

1. 准备必要的模型文件和目录结构

2. 构建并启动所有服务：
```bash
docker-compose up --build
```

3. 访问 Web 界面：
```
http://localhost:3615
```

## 服务说明

### WebUI 服务
- 提供 Web 界面
- 处理用户请求
- 管理音频文件和数据库

### ChatTTS 服务
- 提供基础语音合成功能
- REST API 端点：
  - POST /synthesize
    - 参数：text (文本), seed (种子值)
    - 返回：audio (音频数据，十六进制格式)

### Melo 服务
- 提供声音克隆功能
- 依赖 ChatTTS 服务
- REST API 端点：
  - POST /clone
    - 参数：text (文本), reference (参考音频), seed (种子值)
    - 返回：audio (生成的音频文件路径)

## 卷挂载

- `./audios`: 音频文件存储
- `./checkpoints_v2`: 模型文件
- `./chattts.db`: 数据库文件
