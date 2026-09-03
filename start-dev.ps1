# Refresh environment PATH in current PowerShell session
$env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User") + ";C:\Program Files\nodejs"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Starting Synapses Investments Development Server...    " -ForegroundColor Green
Write-Host "  URL: http://localhost:3000                             " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

& "C:\Program Files\nodejs\npm.cmd" run dev
