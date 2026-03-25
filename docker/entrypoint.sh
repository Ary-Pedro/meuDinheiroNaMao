#!/bin/sh
set -e

echo "Aguardando banco e aplicando migrations..."
until npx prisma migrate deploy; do
  echo "Banco ainda não disponível. Tentando novamente em 3s..."
  sleep 3
done

echo "Executando seed idempotente..."
npm run prisma:seed

echo "Iniciando aplicação..."
npm run start:docker