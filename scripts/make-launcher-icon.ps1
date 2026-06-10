Add-Type -AssemblyName System.Drawing

$size = 1024
$bg = [System.Drawing.Color]::FromArgb(255, 18, 27, 34)
$bmp = New-Object System.Drawing.Bitmap($size, $size)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.Clear($bg)

$root = Split-Path $PSScriptRoot -Parent
$srcPath = Join-Path $root 'assets\CreateInk_logo.png'
$dstPath = Join-Path $root 'assets\CreateInk_launcher.png'

$src = [System.Drawing.Image]::FromFile($srcPath)
$scale = 0.48
$w = [int]($size * $scale)
$h = [int]($size * $scale)
$x = [int](($size - $w) / 2)
$y = [int](($size - $h) / 2)
$g.DrawImage($src, $x, $y, $w, $h)
$bmp.Save($dstPath, [System.Drawing.Imaging.ImageFormat]::Png)

$src.Dispose()
$g.Dispose()
$bmp.Dispose()

Write-Host "Created $dstPath"
