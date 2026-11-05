$ErrorActionPreference = 'Stop'
$workbenchPidFile=Join-Path $PSScriptRoot '.server-windows.pid'
if (Test-Path -LiteralPath $workbenchPidFile) {
    $workbenchPid=[int](Get-Content -LiteralPath $workbenchPidFile)
    $workbenchProcess=Get-CimInstance Win32_Process -Filter "ProcessId = $workbenchPid"
    $workbenchExpected=Join-Path $PSScriptRoot 'server.mjs'
    if ($workbenchProcess -and $workbenchProcess.CommandLine.Contains($workbenchExpected)) {
        Stop-Process -Id $workbenchPid
        Write-Output 'Workbench stopped.'
    } else { Write-Output 'No matching workbench process. Other processes were not touched.' }
} else { Write-Output 'No registered workbench process.' }
