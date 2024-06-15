FROM python:3.11-buster As base
WORKDIR /app
RUN apt-get update && apt-get install -y \
    libgomp1 curl  
RUN pip install torch torchaudio --extra-index-url https://download.pytorch.org/whl/cpu
RUN pip install chattts-fork

# install nodejs
RUN curl -fsSL https://deb.nodesource.com/setup_20.x -o nodesource_setup.sh
RUN bash nodesource_setup.sh
RUN apt-get install -y nodejs

ENV PORT=3615
EXPOSE 3615
VOLUME [ "/app/audios", "/app/chattts.db" ]

RUN chattts "哈哈" -o test.wav --seed 222

FROM node:20-buster As builder
WORKDIR /app
RUN npm install pnpm -g
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY . .
RUN pnpm run build

FROM base As runner
COPY --from=builder /app/.output  ./.output
COPY --from=builder /app/package.json  ./package.json
COPY --from=builder /app/node_modules  ./node_modules

CMD ["node", ".output/server/index.mjs"]