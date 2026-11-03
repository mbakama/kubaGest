#Requires -Version 5.1
<#
.SYNOPSIS
  Prepare PostgreSQL pour Kubagest : cree le role applicatif et la base.

.DESCRIPTION
  Script idempotent. Il demande le mot de passe du superutilisateur `postgres`
  de facon securisee (aucun mot de passe ecrit sur le disque ni passe en ligne
  de commande), puis :
    1. cree (ou met a jour) le role `kubagest` ;
    2. cree la base `kubagest` possedee par ce role ;
    3. verifie la connexion avec le role applicatif.

  Le fichier SQL temporaire est ecrit en ASCII sans BOM : psql rejette un
  fichier commence par un BOM (erreur de syntaxe pres de "DO").

.EXAMPLE
  .\scripts\setup-postgres.ps1

.EXAMPLE
  .\scripts\setup-postgres.ps1 -AppPassword 'UnMotDePassePlusRobuste'
#>
[CmdletBinding()]
param(
  [string]$PgBin = 'C:\Program Files\PostgreSQL\16\bin',
  [string]$PgHost = 'localhost',
  [int]$PgPort = 5432,
  [string]$SuperUser = 'postgres',
  [string]$Database = 'kubagest',
  [string]$AppUser = 'kubagest',
  [string]$AppPassword = 'kubagest_dev_pwd'
)

$ErrorActionPreference = 'Stop'

$psql = Join-Path $PgBin 'psql.exe'
if (-not (Test-Path -LiteralPath $psql)) {
  throw "psql.exe introuvable dans '$PgBin'. Ajustez le parametre -PgBin."
}

Write-Host "PostgreSQL : $PgHost`:$PgPort (superutilisateur '$SuperUser')" -ForegroundColor Cyan
$secure = Read-Host "Mot de passe de '$SuperUser'" -AsSecureString
$bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
try {
  $env:PGPASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
}
finally {
  [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
}

# Contenu ASCII uniquement (pas d'accent) : psql lit le fichier tel quel.
$sql = @'
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = '__APP_USER__') THEN
    CREATE ROLE "__APP_USER__" LOGIN PASSWORD '__APP_PASSWORD__';
  ELSE
    ALTER ROLE "__APP_USER__" WITH LOGIN PASSWORD '__APP_PASSWORD__';
  END IF;
END
$$;

SELECT 'role __APP_USER__ ready' AS step;
'@
$sql = $sql.Replace('__APP_USER__', $AppUser).Replace('__APP_PASSWORD__', $AppPassword)

$sqlFile = Join-Path ([System.IO.Path]::GetTempPath()) "kubagest-setup-$([guid]::NewGuid().ToString('N')).sql"
[System.IO.File]::WriteAllText($sqlFile, $sql, [System.Text.Encoding]::ASCII)
try {
  & $psql -h $PgHost -p $PgPort -U $SuperUser -d postgres -v ON_ERROR_STOP=1 -f $sqlFile
  if ($LASTEXITCODE -ne 0) { throw "Echec de la creation du role '$AppUser' (code $LASTEXITCODE)." }

  $exists = & $psql -h $PgHost -p $PgPort -U $SuperUser -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname = '$Database'"
  if ($LASTEXITCODE -ne 0) { throw "Impossible de verifier l'existence de la base '$Database'." }

  if ("$exists".Trim() -eq '1') {
    Write-Host "La base '$Database' existe deja, rien a creer." -ForegroundColor Yellow
  }
  else {
    & $psql -h $PgHost -p $PgPort -U $SuperUser -d postgres -v ON_ERROR_STOP=1 -c "CREATE DATABASE `"$Database`" OWNER `"$AppUser`" ENCODING 'UTF8'"
    if ($LASTEXITCODE -ne 0) { throw "Echec de la creation de la base '$Database'." }
    Write-Host "Base '$Database' creee." -ForegroundColor Green
  }
}
finally {
  Remove-Item -LiteralPath $sqlFile -ErrorAction SilentlyContinue
}

$env:PGPASSWORD = $AppPassword
$check = & $psql -h $PgHost -p $PgPort -U $AppUser -d $Database -tAc "SELECT current_user || ' @ ' || current_database()"
if ($LASTEXITCODE -ne 0) { throw "Connexion impossible avec le role '$AppUser'." }

Write-Host "Connexion applicative OK : $("$check".Trim())" -ForegroundColor Green
Write-Host ''
Write-Host 'Chaine de connexion a mettre dans backend/.env :' -ForegroundColor Cyan
Write-Host "DATABASE_URL=postgresql://$AppUser`:$AppPassword@$PgHost`:$PgPort/$Database"
Write-Host ''
Write-Host 'Etape suivante : npm run migration:run' -ForegroundColor Cyan
