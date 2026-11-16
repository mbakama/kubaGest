# Analyse automatique du projet KubaGest
Write-Host "=== ANALYSE DU PROJET KUBAGEST ===" -ForegroundColor Cyan
Write-Host "Dossier : E:\Kubagest" -ForegroundColor Yellow
Write-Host ""

$project = "E:\Kubagest"
$rapport = "E:\rapport_kubagest.md"

# En-tête du rapport
$content = @"
# ANALYSE DU PROJET KUBAGEST
Date : `$(Get-Date -Format 'dd/MM/yyyy')`

---

## 01 / STRUCTURE DU DOSSIER
"@

tree $project -f >> $rapport
$content += tree $project -f
$content += @"

---

## 02 / STACK TECHNIQUE
"@

if (Test-Path "$project\package*.json") {
    Write-Host "Dépendances détectées..." -ForegroundColor Green
    Get-Content "$project\package*.json" | Select-String -Pattern 'dependencies' -Context 3,10 | Out-File $rapport
}

# Détection du framework frontend
if (Test-Path "$project\src") {
    if (Test-Path "$project\src\app") {
        Write-Host "- Frontend : Angular détecté" -ForegroundColor Green; Add to content
    }
    if (Test-Path "$project\src\components") {
        Write-Host "- Frontend : React détecté" -ForegroundColor Green
    }
}

# Base de données
if (Test-Path "$project\.env") {
    Write-Host "Configuration base de données :" -ForegroundColor Cyan
    Get-Content "$project\.env" | Select-String -Pattern 'mysql|postgresql|mongodb' | Out-File $rapport
}

# Sécurité potentielle
Write-Host ""
Write-Host "## 03 / POINTS DE SÉCURITÉ" -ForegroundColor Orange
Get-ChildItem -Path $project -Filter *.js,*.ts,*.html -Recurse | Select-String -Pattern 'password|secret|api_key'
| Out-File $rapport

# Qualité du code
Write-Host ""
Write-Host "## 04 / QUALITÉ ET PERFORMANCE" -ForegroundColor Cyan
$files = Get-ChildItem -Path $project -Filter *.js,*.ts,*.html -Recurse
$content += "- Nombre de fichiers source : $($files.Count)"

# Conclusion
$content += @"
---
Fin de l'analyse.
"@

Set-Content -Path $rapport -Value $content
Write-Host "Rapport généré : E:\rapport_kubagest.md" -ForegroundColor Green