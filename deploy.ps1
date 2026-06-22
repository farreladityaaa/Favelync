# Favelync - Push to GitHub & Auto-Deploy to Vercel
# Run this script anytime you make changes in your workspace
# Usage: Right-click -> "Run with PowerShell"

$workspace = "C:\Windows\System32\my-app"
$gitRepo   = "C:\Users\ASUS\my-app"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Favelync - Sync & Deploy" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Copy latest files from workspace to git repo
Write-Host "[1/3] Copying latest changes from workspace..." -ForegroundColor Yellow
robocopy $workspace $gitRepo /E /XD node_modules .next .git /XF "*.tsbuildinfo" "package.json" "package-lock.json" /NFL /NDL /NJH /NJS | Out-Null
Write-Host "      Done." -ForegroundColor Green

# Step 2: Stage and commit
Write-Host "[2/3] Committing changes..." -ForegroundColor Yellow
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
git -C $gitRepo add .
$status = git -C $gitRepo status --short
if ($status) {
    git -C $gitRepo commit -m "update: $timestamp"
    Write-Host "      Committed: $timestamp" -ForegroundColor Green
} else {
    Write-Host "      No changes to commit." -ForegroundColor Gray
}

# Step 3: Push to GitHub (triggers Vercel auto-deploy)
Write-Host "[3/3] Pushing to GitHub..." -ForegroundColor Yellow
git -C $gitRepo push 2>&1 | Out-Null
Write-Host "      Pushed! Vercel will redeploy in ~1-2 minutes." -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  All done! Check your app at:" -ForegroundColor Cyan
Write-Host "  https://favelync.vercel.app" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Read-Host "Press Enter to close"
