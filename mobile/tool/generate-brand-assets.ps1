param()

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$projectRoot = Split-Path $PSScriptRoot -Parent
$sourcePath = Join-Path (Split-Path $projectRoot -Parent) 'Logo KubaGest — gestion simplifiée.png'
$brandDirectory = Join-Path $projectRoot 'assets\brand'

if (-not (Test-Path -LiteralPath $sourcePath)) {
    throw "Logo source introuvable : $sourcePath"
}

New-Item -ItemType Directory -Force -Path $brandDirectory | Out-Null

function New-Canvas {
    param([int]$Width, [int]$Height)

    $bitmap = [System.Drawing.Bitmap]::new(
        $Width,
        $Height,
        [System.Drawing.Imaging.PixelFormat]::Format32bppArgb
    )
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.Clear([System.Drawing.Color]::Transparent)
    $graphics.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

    return @{ Bitmap = $bitmap; Graphics = $graphics }
}

function Save-Canvas {
    param(
        [hashtable]$Canvas,
        [string]$Path
    )

    $Canvas.Bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
    $Canvas.Graphics.Dispose()
    $Canvas.Bitmap.Dispose()
}

function Draw-FittedImage {
    param(
        [System.Drawing.Graphics]$Graphics,
        [System.Drawing.Image]$Image,
        [System.Drawing.Rectangle]$Bounds
    )

    $scale = [Math]::Min(
        $Bounds.Width / $Image.Width,
        $Bounds.Height / $Image.Height
    )
    $width = [int][Math]::Round($Image.Width * $scale)
    $height = [int][Math]::Round($Image.Height * $scale)
    $x = $Bounds.X + [int](($Bounds.Width - $width) / 2)
    $y = $Bounds.Y + [int](($Bounds.Height - $height) / 2)

    $Graphics.DrawImage(
        $Image,
        [System.Drawing.Rectangle]::new($x, $y, $width, $height),
        0,
        0,
        $Image.Width,
        $Image.Height,
        [System.Drawing.GraphicsUnit]::Pixel
    )
}

$source = [System.Drawing.Bitmap]::FromFile($sourcePath)
$markBounds = [System.Drawing.Rectangle]::new(399, 12, 762, 736)
$mark = $source.Clone(
    $markBounds,
    [System.Drawing.Imaging.PixelFormat]::Format32bppArgb
)

try {
    $logo = New-Canvas -Width 900 -Height 600
    Draw-FittedImage -Graphics $logo.Graphics -Image $source `
        -Bounds ([System.Drawing.Rectangle]::new(0, 0, 900, 600))
    Save-Canvas -Canvas $logo -Path (Join-Path $brandDirectory 'kubagest-logo.png')

    $compactMark = New-Canvas -Width 512 -Height 495
    Draw-FittedImage -Graphics $compactMark.Graphics -Image $mark `
        -Bounds ([System.Drawing.Rectangle]::new(0, 0, 512, 495))
    Save-Canvas -Canvas $compactMark -Path (Join-Path $brandDirectory 'kubagest-mark.png')

    $foregrounds = @{
        'mipmap-mdpi' = 108
        'mipmap-hdpi' = 162
        'mipmap-xhdpi' = 216
        'mipmap-xxhdpi' = 324
        'mipmap-xxxhdpi' = 432
    }

    foreach ($entry in $foregrounds.GetEnumerator()) {
        $size = $entry.Value
        $canvas = New-Canvas -Width $size -Height $size
        $contentSize = [int][Math]::Round($size * 0.56)
        $contentOffset = [int](($size - $contentSize) / 2)
        Draw-FittedImage -Graphics $canvas.Graphics -Image $mark `
            -Bounds ([System.Drawing.Rectangle]::new(
                $contentOffset,
                $contentOffset,
                $contentSize,
                $contentSize
            ))
        $path = Join-Path $projectRoot (
            "android\app\src\main\res\$($entry.Key)\ic_launcher_foreground.png"
        )
        Save-Canvas -Canvas $canvas -Path $path
    }

    $legacyIcons = @{
        'mipmap-mdpi' = 48
        'mipmap-hdpi' = 72
        'mipmap-xhdpi' = 96
        'mipmap-xxhdpi' = 144
        'mipmap-xxxhdpi' = 192
    }
    $backgroundColor = [System.Drawing.ColorTranslator]::FromHtml('#F8FAFC')

    foreach ($entry in $legacyIcons.GetEnumerator()) {
        $size = $entry.Value
        $canvas = New-Canvas -Width $size -Height $size
        $canvas.Graphics.CompositingMode =
            [System.Drawing.Drawing2D.CompositingMode]::SourceOver

        $radius = $size * 0.22
        $diameter = $radius * 2
        $path = [System.Drawing.Drawing2D.GraphicsPath]::new()
        $path.AddArc(0, 0, $diameter, $diameter, 180, 90)
        $path.AddArc($size - $diameter, 0, $diameter, $diameter, 270, 90)
        $path.AddArc(
            $size - $diameter,
            $size - $diameter,
            $diameter,
            $diameter,
            0,
            90
        )
        $path.AddArc(0, $size - $diameter, $diameter, $diameter, 90, 90)
        $path.CloseFigure()

        $brush = [System.Drawing.SolidBrush]::new($backgroundColor)
        $canvas.Graphics.FillPath($brush, $path)
        $brush.Dispose()
        $path.Dispose()

        $padding = [int][Math]::Round($size * 0.16)
        Draw-FittedImage -Graphics $canvas.Graphics -Image $mark `
            -Bounds ([System.Drawing.Rectangle]::new(
                $padding,
                $padding,
                $size - ($padding * 2),
                $size - ($padding * 2)
            ))
        $path = Join-Path $projectRoot (
            "android\app\src\main\res\$($entry.Key)\ic_launcher.png"
        )
        Save-Canvas -Canvas $canvas -Path $path
    }
}
finally {
    $mark.Dispose()
    $source.Dispose()
}

Write-Host 'Assets de marque générés.'
