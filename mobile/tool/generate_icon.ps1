param(
  [string]$ResRoot = 'E:\Kubagest\mobile\android\app\src\main\res',
  [string]$PreviewDir = 'E:\Kubagest\docs\mobile\brand'
)

Add-Type -AssemblyName System.Drawing

function New-RoundedPath {
  param([double]$X, [double]$Y, [double]$W, [double]$H, [double]$R)
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $d = [Math]::Min($R * 2, [Math]::Min($W, $H))
  $path.AddArc([single]$X, [single]$Y, [single]$d, [single]$d, 180, 90)
  $path.AddArc([single]($X + $W - $d), [single]$Y, [single]$d, [single]$d, 270, 90)
  $path.AddArc([single]($X + $W - $d), [single]($Y + $H - $d), [single]$d, [single]$d, 0, 90)
  $path.AddArc([single]$X, [single]($Y + $H - $d), [single]$d, [single]$d, 90, 90)
  $path.CloseFigure()
  return $path
}

function New-GlyphLayer {
  param([int]$Size)
  $bitmap = New-Object System.Drawing.Bitmap($Size, $Size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [System.Drawing.Graphics]::FromImage($bitmap)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.Clear([System.Drawing.Color]::Transparent)
  $white = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
  $s = [double]$Size

  # Corps du commerce.
  $body = New-RoundedPath ($s * 0.225) ($s * 0.455) ($s * 0.55) ($s * 0.305) ($s * 0.03)
  $g.FillPath($white, $body)

  # Auvent, avec quatre festons.
  $awning = New-Object System.Drawing.Drawing2D.GraphicsPath
  $x0 = $s * 0.185; $x1 = $s * 0.815
  $y0 = $s * 0.295; $y1 = $s * 0.435
  $r = $s * 0.028
  $d = $r * 2
  $awning.AddArc([single]$x0, [single]$y0, [single]$d, [single]$d, 180, 90)
  $awning.AddArc([single]($x1 - $d), [single]$y0, [single]$d, [single]$d, 270, 90)
  $awning.AddLine([single]$x1, [single]$y0, [single]$x1, [single]$y1)
  $w = ($x1 - $x0) / 4
  for ($i = 0; $i -lt 4; $i++) {
    $cx = $x1 - $w * $i - $w / 2
    $awning.AddArc([single]($cx - $w / 2), [single]($y1 - $w / 2), [single]$w, [single]$w, 0, 180)
  }
  $awning.CloseFigure()
  $g.FillPath($white, $awning)

  # Évidements : porte et deux vitrines.
  $g.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
  $clear = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::Transparent)
  $door = New-RoundedPath ($s * 0.45) ($s * 0.565) ($s * 0.10) ($s * 0.195) ($s * 0.05)
  $g.FillPath($clear, $door)
  $win1 = New-RoundedPath ($s * 0.285) ($s * 0.545) ($s * 0.085) ($s * 0.075) ($s * 0.012)
  $win2 = New-RoundedPath ($s * 0.63) ($s * 0.545) ($s * 0.085) ($s * 0.075) ($s * 0.012)
  $g.FillPath($clear, $win1)
  $g.FillPath($clear, $win2)

  $g.Dispose()
  return $bitmap
}

function New-Icon {
  param([int]$Size, [string]$Target, [switch]$Adaptive)

  $icon = New-Object System.Drawing.Bitmap($Size, $Size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [System.Drawing.Graphics]::FromImage($icon)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.Clear([System.Drawing.Color]::Transparent)

  $s = [double]$Size
  if ($Adaptive) {
    # Zone de sécurité de l'icône adaptative : le glyphe occupe ~62 %.
    $glyph = New-GlyphLayer ([int]($Size * 0.62))
    $offset = [int](($Size - $glyph.Width) / 2)
    $g.DrawImage($glyph, $offset, $offset, $glyph.Width, $glyph.Height)
    $glyph.Dispose()
  }
  else {
    $radius = $s * 0.235
    $background = New-RoundedPath 0 0 $s $s $radius
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
      (New-Object System.Drawing.Rectangle(0, 0, $Size, $Size)),
      [System.Drawing.Color]::FromArgb(255, 0, 163, 111),
      [System.Drawing.Color]::FromArgb(255, 0, 88, 60),
      45
    )
    $g.FillPath($brush, $background)
    $glyph = New-GlyphLayer $Size
    $g.DrawImage($glyph, 0, 0, $Size, $Size)
    $glyph.Dispose()
    $brush.Dispose()
    $background.Dispose()
  }

  $g.Dispose()
  $icon.Save($Target, [System.Drawing.Imaging.ImageFormat]::Png)
  $icon.Dispose()
}

$densities = @{
  'mdpi'    = 48
  'hdpi'    = 72
  'xhdpi'   = 96
  'xxhdpi'  = 144
  'xxxhdpi' = 192
}
$foregroundSizes = @{
  'mdpi'    = 108
  'hdpi'    = 162
  'xhdpi'   = 216
  'xxhdpi'  = 324
  'xxxhdpi' = 432
}

foreach ($density in $densities.Keys) {
  $dir = Join-Path $ResRoot "mipmap-$density"
  New-Icon -Size $densities[$density] -Target (Join-Path $dir 'ic_launcher.png')
  New-Icon -Size $foregroundSizes[$density] -Target (Join-Path $dir 'ic_launcher_foreground.png') -Adaptive
}

if (-not (Test-Path $PreviewDir)) { New-Item -ItemType Directory -Path $PreviewDir | Out-Null }
New-Icon -Size 512 -Target (Join-Path $PreviewDir 'app-icon.png')

Write-Output 'Icônes générées.'
