# Update Cursor stable via api2.cursor.sh
# Closes Cursor, then silent-installs to the detected install folder.

$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

function Get-CursorInstallDir {
  if ($env:CURSOR_INSTALL_DIR -and (Test-Path $env:CURSOR_INSTALL_DIR)) {
    return (Resolve-Path $env:CURSOR_INSTALL_DIR).Path
  }
  $cmd = Get-Command cursor -ErrorAction SilentlyContinue
  if (-not $cmd) { return $null }
  # ...\cursor\resources\app\bin\cursor.cmd -> install root is 3 levels up from bin
  $binDir = Split-Path $cmd.Source -Parent
  return (Resolve-Path (Join-Path $binDir '..\..\..')).Path
}

$installDir = Get-CursorInstallDir
$productJson = if ($installDir) { Join-Path $installDir 'resources\app\product.json' } else { $null }

if (-not $productJson -or -not (Test-Path -LiteralPath $productJson)) {
  Write-Error "Cursor not found. Set CURSOR_INSTALL_DIR or ensure 'cursor' is on PATH."
}

$current = Get-Content -LiteralPath $productJson -Raw | ConvertFrom-Json
$ver = $current.version
$commit = $current.commit
$api = "https://api2.cursor.sh/updates/api/update/win32-x64-user/cursor/$ver/$commit/stable"
Write-Host "Install: $installDir"
Write-Host "Current: $ver ($commit)"
Write-Host "Checking updates..."

$update = Invoke-RestMethod -Uri $api -Method Get -TimeoutSec 30
if (-not $update.version -or $update.version -eq $ver) {
  Write-Host "Up to date (stable $ver)."
  exit 0
}

Write-Host "Available: $($update.version)"
$installer = Join-Path $env:TEMP "CursorUserSetup-x64-$($update.version).exe"
if (-not (Test-Path -LiteralPath $installer)) {
  Write-Host "Downloading..."
  Invoke-WebRequest -Uri $update.url -OutFile $installer -UseBasicParsing
}

Write-Host "Closing Cursor..."
Get-Process -Name 'Cursor','cursor' -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 3

$log = Join-Path $env:TEMP "cursor-install-$($update.version).log"
# Inno Setup: path with spaces MUST be quoted or only "D:\Даник" is used (see install log).
$dirArg = '/DIR="{0}"' -f $installDir
$args = @(
  '/VERYSILENT', '/SUPPRESSMSGBOXES', '/NORESTART',
  $dirArg, "/LOG=$log",
  '/CLOSEAPPLICATIONS', '/FORCECLOSEAPPLICATIONS'
)
Write-Host "Installing to $installDir ..."
$p = Start-Process -FilePath $installer -ArgumentList $args -PassThru -Wait
Write-Host "Exit code: $($p.ExitCode)"
if (Test-Path -LiteralPath $log) { Get-Content -LiteralPath $log -Tail 20 }

$new = Get-Content -LiteralPath $productJson -Raw | ConvertFrom-Json
Write-Host "After install: $($new.version)"
if ($new.version -ne $update.version -and $installDir -match ' ') {
  $truncated = ($installDir -split ' ', 2)[0]
  $wrongJson = Join-Path $truncated 'resources\app\product.json'
  if (Test-Path -LiteralPath $wrongJson) {
    $w = Get-Content -LiteralPath $wrongJson -Raw | ConvertFrom-Json
    if ($w.version -eq $update.version) {
      Write-Host ""
      Write-Host "WARNING: $update.version was installed to $truncated (path had a space)."
      Write-Host "New Cursor: $(Join-Path $truncated 'Cursor.exe')"
      Write-Host "Old Cursor: $(Join-Path $installDir 'Cursor.exe') ($ver)"
      Write-Host "Open the NEW path, or close Cursor and run this script again (DIR quoting is fixed)."
    }
  }
}
Write-Host "Start: $(Join-Path $installDir 'Cursor.exe')"
