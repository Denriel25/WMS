#!/usr/bin/env pwsh
# Library LINK - Quick Start Server Script

Write-Host "`n╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║      Library LINK - Admin Dashboard Server            ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# Check if Deno is installed
Write-Host "Checking for Deno..." -ForegroundColor Yellow
$denoCheck = deno --version 2>&1 | Select-Object -First 1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Deno found: $denoCheck" -ForegroundColor Green
} else {
    Write-Host "✗ Deno not found!" -ForegroundColor Red
    Write-Host "Please install Deno from https://deno.land" -ForegroundColor Yellow
    Exit 1
}

# Start the server
Write-Host "`nStarting backend server..." -ForegroundColor Yellow
Write-Host "────────────────────────────────────────────────────────" -ForegroundColor Gray

try {
    deno run --allow-net index.html
} catch {
    Write-Host "`n✗ Error starting server" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Exit 1
}
