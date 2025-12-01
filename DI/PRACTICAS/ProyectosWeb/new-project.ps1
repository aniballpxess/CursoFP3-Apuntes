# --- Script parameters ---
param (
  [string]$Path,
  [string]$ProjectName,
  [string]$FirstPageName,
  [string]$SourceDirName = "src",
  [string]$ResourcesDirName = "res"
)

# --- Script variables ---
$DefaultProjectName = "blank-project"
$DefaultFirstPageName = "blank-page"
$DefaultPath = "$PSScriptRoot"

$NewPageScript = "$PSScriptRoot\new-page.ps1"

# --- Script body ---
# Ask user for the project's & the first page's names
if (-not $ProjectName) {
  Write-Host "Nombre del proyecto (por defecto: " -NoNewLine
  Write-Host -ForegroundColor Cyan $DefaultProjectName -NoNewLine
  $ProjectName = Read-Host ")"
}
if (-not $FirstPageName) {
  Write-Host "Nombre de la página inicial (por defecto: " -NoNewLine
  Write-Host -ForegroundColor Cyan $DefaultFirstPageName -NoNewLine
  $FirstPageName = Read-Host ")"
}
if (-not $Path) {
  Write-Host "Directorio del proyecto (por defecto: " -NoNewLine
  Write-Host -ForegroundColor Cyan "directorio\del\script" -NoNewLine
  $path = Read-Host ")"
}

# Stablish default names and path if needed
if (-not $ProjectName) {
  $ProjectName = $DefaultProjectName
}
if (-not $FirstPageName) {
  $FirstPageName = $DefaultFirstPageName
}
if (-not $Path) {
  $Path = $DefaultPath
}

# Get the project's root, src & res paths 
$RootDirPath = Join-Path -Path $Path -ChildPath $ProjectName
$SourceDirPath = Join-Path -Path $RootDirPath -ChildPath $SourceDirName
$ResourcesDirPath = Join-Path -Path $RootDirPath -ChildPath $ResourcesDirName

# Check if the project already exists
if (Test-Path -Path $RootDirPath) {
  Write-Host "El proyecto " -NoNewLine
  Write-Host -ForegroundColor Red $ProjectName -NoNewLine
  Write-Host " ya existe en: "
  Resolve-Path $Path | Write-Host -ForegroundColor Blue
  exit 1
}

# Create the project structure
New-Item -Path $RootDirPath -ItemType Directory | Out-Null
New-Item -Path $ResourcesDirPath -ItemType Directory | Out-Null
New-Item -Path $SourceDirPath -ItemType Directory | Out-Null
Write-Host "Estructura del proyecto creada."

# Create the first page
& $NewPageScript -Path $SourceDirPath -NewPageName $FirstPageName -Quiet
Write-Host "Pagina inicial creada."

# Script success notification
Write-Host "Creacion de proyecto " -NoNewLine
Write-Host -ForegroundColor Green $ProjectName -NoNewLine
Write-Host " completada en: "
Resolve-Path $Path | Write-Host -ForegroundColor Blue
