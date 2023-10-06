param(
    [string]$Path
)

$isFile = Test-Path -Path $Path -PathType Leaf

$reportPath = Get-ChildItem -Path (Split-Path -Path $Path) -Filter *.html | Select-Object -First 1 -ExpandProperty FullName
$yesButton = New-BTButton -Content "Yes" -Arguments $reportPath
$closeButton = New-BTButton -Content "Close" -Arguments "close"

$command = Get-Command -Name New-BurntToastNotification -ErrorAction SilentlyContinue

function ShowNotication {
    if ($isFile) {
        New-BurntToastNotification -AppLogo $PSScriptRoot/icon.png -Text "VP completed!","Open the report?" -Button $yesButton, $closeButton
    } else {
        New-BurntToastNotification -AppLogo $PSScriptRoot/icon.png -Text "VP completed!" -Button $closeButton
    }
}

if ($command) {
    ShowNotication
} else {
    Install-Module -Name BurntToast -Scope CurrentUser -Force
    ShowNotication
}