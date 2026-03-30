# syntax=docker/dockerfile:1.7

FROM node:22-bookworm-slim AS base

ENV NEXT_TELEMETRY_DISABLED=1 \
    NPM_CONFIG_UPDATE_NOTIFIER=false \
    PRISMA_HIDE_UPDATE_MESSAGE=1
WORKDIR /app

RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

FROM base AS deps

COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder

COPY package.json package-lock.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY node_modules/.prisma ./node_modules/.prisma
COPY src ./src
COPY prisma ./prisma
COPY docker ./docker
COPY next.config.ts ./
COPY next-env.d.ts ./
COPY tsconfig.json ./
COPY prisma.config.ts ./
COPY postcss.config.mjs ./
COPY eslint.config.mjs ./
RUN npm run build:docker

FROM base AS runner

COPY package.json package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/docker ./docker

RUN chmod +x docker/entrypoint.sh

EXPOSE 3000

CMD ["/bin/sh", "./docker/entrypoint.sh"]
