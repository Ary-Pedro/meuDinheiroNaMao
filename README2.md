# README 2 - subir ambiente local e público

## Pré-requisitos
- Docker Desktop ativo
- Node.js 22+ (opcional, só para `npm run docker:public`)

## Arquivos de ambiente
Os arquivos `.env` e `.env.example` estão alinhados com estas chaves:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/carteira?schema=public"
DEMO_USER_EMAIL="demo@carteira.local"
DEMO_USER_NAME="Usuario Demo"
APP_LOCAL_URL="http://localhost:3000"
```

## Subir ambiente local
Para subir só app + banco:

```powershell
docker compose up --build -d
```

Verificar status:

```powershell
docker compose ps
```

Abrir no navegador:

- app: `http://localhost:3000`
- finance: `http://localhost:3000/finance`

## Subir ambiente público com Cloudflare Quick Tunnel
### Opção 1 - PowerShell limpo

```powershell
.\docker\up-public.ps1 -Build
```

Saída esperada:

```text
[docker] subindo app + tunnel...
[docker] aguardando URL publica do Cloudflare...

===============================
Local HTTP      : http://localhost:3000
Local /finance  : http://localhost:3000/finance
Cloudflare      : https://xxxxx.trycloudflare.com
Cloudflare/fin. : https://xxxxx.trycloudflare.com/finance
===============================
```

### Opção 2 - Node / npm

```powershell
npm run docker:public
```

## Derrubar ambiente
Sem apagar volume:

```powershell
docker compose --profile public down --remove-orphans
```

Apagando volume do Postgres:

```powershell
docker compose --profile public down -v --remove-orphans
```

## Logs úteis
```powershell
docker compose logs -f app
docker compose logs -f tunnel
docker compose logs -f postgres
```

## Observações
- O endereço `http://app:3000` é interno do Docker e não deve ser usado no navegador.
- O link `trycloudflare.com` é real, mas muda a cada nova subida do Quick Tunnel.
- Se precisar de URL fixa, troque Quick Tunnel por Named Tunnel com domínio próprio.


para subir sem mudar o tunel `docker compose up -d --build --no-deps app`