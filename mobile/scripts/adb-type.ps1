<#
.SYNOPSIS
    Saisit du texte dans le champ actif de l'émulateur Android.

.DESCRIPTION
    Contourne les limites du clavier physique de l'émulateur (AltGr, @, ponctuation)
    en injectant les caractères sous forme de keycodes Android.

    Pourquoi pas `adb shell input text` : cette commande convertit chaque caractère
    via la table kcm de l'appareil. Sur l'image Play Store, cette table est en
    lecture seule et incomplète, si bien que `@` est perdu et que `.` devient `:`.
    L'injection par keycode produit le caractère exact.

    Les caractères non ASCII (é, à, ç, €…) n'ont pas de keycode Android : ils sont
    signalés dans un avertissement et ignorés. Pour les saisir, utilisez le clavier
    tactile de l'émulateur (appui long sur la lettre).

.PARAMETER Text
    Texte à saisir.

.PARAMETER Serial
    Identifiant de l'appareil adb. Par défaut : emulator-5554.

.PARAMETER Enter
    Appuie sur Entrée après la saisie.

.PARAMETER SelectAll
    Sélectionne le contenu du champ avant la saisie (remplace l'existant).

.EXAMPLE
    .\adb-type.ps1 "contact@kubagest.cd"

.EXAMPLE
    .\adb-type.ps1 "MotDePasse123!" -Enter

.EXAMPLE
    .\adb-type.ps1 "autre@courriel.cd" -SelectAll -Enter
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory = $true, Position = 0)]
    [string]$Text,

    [string]$Serial = 'emulator-5554',

    [switch]$Enter,

    [switch]$SelectAll
)

$ErrorActionPreference = 'Stop'

function Resolve-Adb {
    $candidates = New-Object System.Collections.Generic.List[string]
    $candidates.Add((Join-Path $env:LOCALAPPDATA 'Android\Sdk\platform-tools\adb.exe'))
    $candidates.Add('E:\Android\Sdk\platform-tools\adb.exe')
    foreach ($root in @($env:ANDROID_HOME, $env:ANDROID_SDK_ROOT)) {
        if ($root) { $candidates.Add((Join-Path $root 'platform-tools\adb.exe')) }
    }
    foreach ($candidate in $candidates) {
        if (Test-Path $candidate) { return $candidate }
    }
    $onPath = Get-Command adb -ErrorAction SilentlyContinue
    if ($onPath) { return $onPath.Source }
    throw "adb introuvable. Installez les Android platform-tools ou ajoutez adb au PATH."
}

# Keycodes Android (voir android.view.KeyEvent) : caractère -> code + Maj requise.
# Table sensible à la casse : 'a' et 'A' partagent le même keycode mais pas le même Maj.
$KeyMap = New-Object System.Collections.Hashtable ([System.StringComparer]::Ordinal)
foreach ($i in 0..25) {
    $KeyMap[([string][char](97 + $i))] = @{ Code = 29 + $i; Shift = $false }
    $KeyMap[([string][char](65 + $i))] = @{ Code = 29 + $i; Shift = $true }
}
foreach ($i in 0..9) { $KeyMap[([string][char](48 + $i))] = @{ Code = 7 + $i; Shift = $false } }

$simpleKeys = @{
    ' ' = 62; '`' = 68; '-' = 69; '=' = 70; '[' = 71; ']' = 72; '\' = 73
    ';' = 74; "'" = 75; ',' = 55; '.' = 56; '/' = 76; '@' = 77; '#' = 18; '*' = 17
}
$shiftKeys = @{
    '~' = 68; '_' = 69; '+' = 70; '{' = 71; '}' = 72; '|' = 73; ':' = 74
    '"' = 75; '<' = 55; '>' = 56; '?' = 76; '!' = 8; '$' = 11; '%' = 12
    '^' = 13; '&' = 14; '(' = 16; ')' = 7
}
foreach ($key in $simpleKeys.Keys) { $KeyMap[[string]$key] = @{ Code = $simpleKeys[$key]; Shift = $false } }
foreach ($key in $shiftKeys.Keys) { $KeyMap[[string]$key] = @{ Code = $shiftKeys[$key]; Shift = $true } }

$KeyShiftLeft = 59
$KeyEnter = 66
$KeyCtrlLeft = 113
$KeyA = 29
$KeyDel = 67
$MaxBatch = 24

$adb = Resolve-Adb

$deviceList = ((& $adb devices 2>&1) | Out-String)
if ($deviceList -notmatch [regex]::Escape($Serial)) {
    throw "Appareil '$Serial' introuvable. Appareils connectés :`n$deviceList"
}

function Invoke-Device([string]$command) {
    $output = & $adb -s $Serial shell $command 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "Échec sur l'appareil ($command) :`n$output"
    }
}

function Send-KeyBatch([object[]]$codes) {
    if (-not $codes -or $codes.Count -eq 0) { return }
    Invoke-Device "input keyevent $($codes -join ' ')"
}

if ($SelectAll) {
    Invoke-Device "input keycombination $KeyCtrlLeft $KeyA"
    Invoke-Device "input keyevent $KeyDel"
    Start-Sleep -Milliseconds 200
}

$pending = New-Object System.Collections.Generic.List[int]
$unsupported = New-Object System.Collections.Generic.List[char]

foreach ($char in $Text.ToCharArray()) {
    if ($char -eq "`n" -or $char -eq "`r") {
        Send-KeyBatch $pending
        $pending.Clear()
        Invoke-Device "input keyevent $KeyEnter"
        continue
    }

    $entry = $KeyMap[[string]$char]
    if ($null -eq $entry) {
        $unsupported.Add($char)
        continue
    }

    if ($entry.Shift) {
        Send-KeyBatch $pending
        $pending.Clear()
        Invoke-Device "input keycombination $KeyShiftLeft $($entry.Code)"
    } else {
        $pending.Add($entry.Code)
        if ($pending.Count -ge $MaxBatch) {
            Send-KeyBatch $pending
            $pending.Clear()
        }
    }
}
Send-KeyBatch $pending

if ($Enter) { Invoke-Device "input keyevent $KeyEnter" }

if ($unsupported.Count -gt 0) {
    $list = ($unsupported | Select-Object -Unique) -join ' '
    Write-Warning "Caractères ignorés (aucun keycode Android) : $list"
    Write-Warning "Saisissez-les au clavier tactile de l'émulateur (appui long sur la lettre)."
}

Write-Host "Saisi dans $Serial : $Text" -ForegroundColor Green
