$command = Get-Command -Name New-BurntToastNotification -ErrorAction SilentlyContinue

if ($command) {
  New-BurntToastNotification -Text "VP completed!"
} else {
  Install-Module -Name BurntToast -Scope CurrentUser
  New-BurntToastNotification -Text "VP completed!"
}