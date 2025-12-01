# Script parameters
param(
    [string]$Path = ".",
    [string]$NewPageName = "blank-page",
    [switch]$Quiet
)

# Script variables
$HtmlFileName = "$NewPageName.html"
$CssFileName = "$NewPageName.css"
$JsFileName = "$NewPageName.js"
$HtmlFileContent = @"
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>$NewPageName</title>
    <link rel="stylesheet" href="$CssFileName" />
    <script src="$JsFileName" defer></script>
  </head>
  <body>
    
  </body>
</html>
"@

#Get the new page directory and files paths
$NewPageDirPath = Join-Path -Path $Path -ChildPath $NewPageName
$HtmlFilePath = Join-Path -Path $NewPageDirPath -ChildPath $HtmlFileName
$CssFilePath = Join-Path -Path $NewPageDirPath -ChildPath $CssFileName
$JsFilePath = Join-Path -Path $NewPageDirPath -ChildPath $JsFileName

# Check if the new page already exists
if (Test-Path -Path $NewPageDirPath) {
    Write-Host "La página " -NoNewLine
    Write-Host -ForegroundColor Red $NewPageName -NoNewLine
    Write-Host " ya existe en: "
    Resolve-Path $Path | Write-Host -ForegroundColor Blue
    exit 1
}

# Create the new page directory and files
New-Item -Path $NewPageDirPath -ItemType Directory | Out-Null
New-Item -Path $HtmlFilePath -ItemType File | Out-Null
New-Item -Path $CssFilePath -ItemType File | Out-Null
New-Item -Path $JsFilePath -ItemType File | Out-Null

# connect the files via HTML
Set-Content -Path $HtmlFilePath -Value $HtmlFileContent

# Check for quiet mode
if ($Quiet.IsPresent) {
    exit 0
}

# Script success notification
Write-Host "Pagina con nombre " -NoNewLine
Write-Host $NewPageName -ForegroundColor Green -NoNewLine
Write-Host " creada en: "
Resolve-Path $NewPageDirPath | Write-Host -ForegroundColor Blue
