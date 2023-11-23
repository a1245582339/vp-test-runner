param(
    [string]$Path
)

$isFile = Test-Path -Path $Path -PathType Leaf
$reportPath = Get-ChildItem -Path (Split-Path -Path $Path) -Filter *.html | Select-Object -First 1 -ExpandProperty FullName
$reportFileName = Split-Path -Path $reportPath -Leaf

$closeButton = New-BTButton -Content "Close" -Arguments "close"

$command = Get-Command -Name New-BurntToastNotification -ErrorAction SilentlyContinue

function ShowNotication {
    if ($isFile -and $reportPath) {
        $yesButton = New-BTButton -Content "Open" -Arguments $reportPath
        New-BurntToastNotification -AppLogo $PSScriptRoot/icon.png -Text "VP completed!","$reportFileName`n Open the report?" -Button $yesButton, $closeButton
    } else {
        $yesButton = New-BTButton -Content "Open" -Arguments $Path
        New-BurntToastNotification -AppLogo $PSScriptRoot/icon.png -Text "VP completed!","Open the reports folder?" -Button $yesButton, $closeButton
    }
}

if ($command) {
    ShowNotication
} else {
    Install-Module -Name BurntToast -Scope CurrentUser -Force
    ShowNotication
}