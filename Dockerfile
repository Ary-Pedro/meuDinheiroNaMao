FROM node:22-bookworm-slim

ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build

RUN chmod +x docker/entrypoint.sh

EXPOSE 3000

CMD ["./docker/entrypoint.sh"]