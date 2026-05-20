# Local static HTTP server (no Node/Python required).
param([int]$Port = 3000)

$Root = Split-Path $PSScriptRoot -Parent

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://127.0.0.1:$Port/")
$listener.Start()

Write-Host ""
Write-Host "  PharmConsilium local server" -ForegroundColor Cyan
Write-Host "  http://127.0.0.1:$Port/" -ForegroundColor Green
Write-Host "  Root: $Root" -ForegroundColor DarkGray
Write-Host "  Stop: Ctrl+C" -ForegroundColor DarkGray
Write-Host ""

$mime = @{
  ".html" = "text/html; charset=utf-8"
  ".htm"  = "text/html; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".js"   = "application/javascript; charset=utf-8"
  ".jsx"  = "application/javascript; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".svg"  = "image/svg+xml"
  ".png"  = "image/png"
  ".jpg"  = "image/jpeg"
  ".jpeg" = "image/jpeg"
  ".webp" = "image/webp"
  ".ico"  = "image/x-icon"
  ".woff" = "font/woff"
  ".woff2" = "font/woff2"
  ".txt"  = "text/plain; charset=utf-8"
  ".xml"  = "application/xml; charset=utf-8"
}

function Get-LocalPath([string]$urlPath) {
  $p = [Uri]::UnescapeDataString($urlPath.TrimStart("/"))
  if ([string]::IsNullOrWhiteSpace($p)) { $p = "index.html" }
  $full = [IO.Path]::GetFullPath((Join-Path $Root $p))
  $rootFull = [IO.Path]::GetFullPath($Root)
  if (-not $full.StartsWith($rootFull, [StringComparison]::OrdinalIgnoreCase)) {
    return $null
  }
  if (Test-Path $full -PathType Container) {
    $idx = Join-Path $full "index.html"
    if (Test-Path $idx) { return $idx }
    return $null
  }
  if (Test-Path $full -PathType Leaf) { return $full }
  return $null
}

try {
  while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $res = $ctx.Response
    $path = Get-LocalPath $ctx.Request.Url.AbsolutePath

    if (-not $path) {
      $res.StatusCode = 404
      $body = [Text.Encoding]::UTF8.GetBytes("404 Not Found")
      $res.ContentType = "text/plain; charset=utf-8"
    } else {
      $body = [IO.File]::ReadAllBytes($path)
      $ext = [IO.Path]::GetExtension($path).ToLowerInvariant()
      $res.StatusCode = 200
      $res.ContentType = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { "application/octet-stream" }
    }

    $res.ContentLength64 = $body.Length
    $res.OutputStream.Write($body, 0, $body.Length)
    $res.OutputStream.Close()
  }
} finally {
  $listener.Stop()
}
