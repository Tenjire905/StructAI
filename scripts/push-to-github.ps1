$ErrorActionPreference = "Stop"
$log = "C:\Users\Hotspot\Neuer Ordner\StructAI\push-log.txt"
$src = "C:\Users\Hotspot\Neuer Ordner\StructAI"
$dst = "C:\Users\Hotspot\Neuer Ordner\StructAI-push"

function Log($msg) {
  $line = "$(Get-Date -Format o) $msg"
  Add-Content -Path $log -Value $line
  Write-Output $line
}

try {
  Log "START"
  if (Test-Path $dst) {
    Remove-Item -Recurse -Force $dst
    Log "Removed old clone"
  }
  git clone https://github.com/Tenjire905/StructAI.git $dst
  Log "Clone OK"
  robocopy $src $dst /E /XD node_modules .expo dist reference-app .git push-log.txt scripts /NFL /NDL /NJH /NJS | Out-Null
  Log "Robocopy OK"
  Set-Location $dst
  git add -A
  git reset HEAD .env .env.local 2>$null
  $status = git status --short
  Log "STATUS: $status"
  if (-not $status) {
    Log "Nothing to commit"
    exit 0
  }
  git commit -m "Orchestrator v2.1: premium UI library, P0 task queue, budget workflow"
  $hash = git rev-parse HEAD
  Log "COMMIT: $hash"
  git push origin main
  Log "PUSH OK: https://github.com/Tenjire905/StructAI/commit/$hash"
} catch {
  Log "ERROR: $_"
  exit 1
}
