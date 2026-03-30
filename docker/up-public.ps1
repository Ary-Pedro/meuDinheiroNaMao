param(
  [switch]$Build,
  [switch]$VerboseDocker
)

$ErrorActionPreference = 'Stop'

$composeArgs = @('--profile', 'public', 'up', '-d')
if ($Build) {
  $composeArgs += '--build'
}
$precleanArgs = @('--profile', 'public', 'down', '--remove-orphans')

if ($VerboseDocker) {
  Write-Host '[docker] limpando estado anterior...' -ForegroundColor DarkCyan
  & docker compose @precleanArgs | Out-Null
} else {
  & $env:ComSpec /d /c "docker compose $($precleanArgs -join ' ') >nul 2>&1"
}

Write-Host '[docker] subindo app + tunnel...' -ForegroundColor Cyan
$composeOutput = $null
if ($VerboseDocker) {
  & docker compose @composeArgs
} else {
  $composeCommand = "docker compose $($composeArgs -join ' ') 2>&1"
  $composeOutput = (& $env:ComSpec /d /c $composeCommand | Out-String)
}

if ($LASTEXITCODE -ne 0) {
  if (-not $VerboseDocker -and $composeOutput) {
    $composeOutput | Write-Host
  }
  exit $LASTEXITCODE
}

$localUrl = if ($env:APP_LOCAL_URL) { $env:APP_LOCAL_URL.TrimEnd('/') } else { 'http://localhost:3000' }
$localFinanceUrl = "$localUrl/finance"
$cloudflareUrl = $null
$deadline = (Get-Date).AddMinutes(2)
$pattern = 'https://(?!api\.)[-a-z0-9]+\.trycloudflare\.com'
$tunnelError = $null

Write-Host '[docker] aguardando URL publica do Cloudflare...' -ForegroundColor Cyan
while ((Get-Date) -lt $deadline -and -not $cloudflareUrl) {
  $logs = & docker compose logs tunnel --no-color --tail 80 2>$null
  if ($LASTEXITCODE -ne 0) {
    Start-Sleep -Seconds 2
    continue
  }

  $match = [regex]::Match(($logs -join "`n"), $pattern)
  if ($match.Success) {
    $cloudflareUrl = $match.Value
    break
  }

  $errorMatch = [regex]::Match(($logs -join "`n"), 'failed to request quick Tunnel: .+')
  if ($errorMatch.Success) {
    $tunnelError = $errorMatch.Value
  }

  Start-Sleep -Seconds 2
}

Write-Host ''
Write-Host '===============================' -ForegroundColor Green
Write-Host "Local HTTP      : $localUrl" -ForegroundColor Green
Write-Host "Local /finance  : $localFinanceUrl" -ForegroundColor Green
if ($cloudflareUrl) {
  Write-Host "Cloudflare      : $cloudflareUrl" -ForegroundColor Green
  Write-Host "Cloudflare/fin. : $cloudflareUrl/finance" -ForegroundColor Green
} else {
  Write-Host 'Cloudflare      : ainda nao encontrado no log' -ForegroundColor Yellow
  if ($tunnelError) {
    Write-Host "Tunnel erro     : $tunnelError" -ForegroundColor Yellow
  }
  Write-Host 'Veja: docker compose logs -f tunnel' -ForegroundColor Yellow
}
Write-Host '===============================' -ForegroundColor Green
