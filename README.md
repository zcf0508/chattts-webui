# Chattts web-ui

## Installation

```bash
python -m venv venv
source venv/bin/activate
pip install chattts-fork

pnpm install
```

## Usage

```bash
pnpm run build
node .output/server/index.mjs
```

## Development

```bash
pnpm run dev
```
## Docker

```bash
# cpu
docker build -t chattts-webui .
docker run -v ./audios:/app/audios -v ./chattts.db:/app/chattts.db -p 3615:3615 chattts-webui

# gpu
docker build -f ./Dockerfile.cuda -t chattts-webui-gpu .
docker run -v ./audios:/app/audios -v ./chattts.db:/app/chattts.db -p 3615:3615 chattts-webui-gpu
```
