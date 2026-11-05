param([switch]$NoBrowser)
$ErrorActionPreference = 'Stop'
$workbenchRoot = $PSScriptRoot
$workbenchScript = Join-Path $workbenchRoot 'server.mjs'
$workbenchPidFile = Join-Path $workbenchRoot '.server-windows.pid'
$workbenchRunning = $false
if (Test-Path -LiteralPath $workbenchPidFile) {
    $workbenchPid = [int](Get-Content -LiteralPath $workbenchPidFile)
    $workbenchExisting = Get-CimInstance Win32_Process -Filter "ProcessId = $workbenchPid"
    $workbenchRunning = $workbenchExisting -and $workbenchExisting.CommandLine.Contains($workbenchScript)
}
if (-not $workbenchRunning) {
    $workbenchNodeCommand = Get-Command node.exe -ErrorAction SilentlyContinue
    $workbenchNode = if ($workbenchNodeCommand) { $workbenchNodeCommand.Source } else { Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' }
    if (-not (Test-Path -LiteralPath $workbenchNode)) { throw 'Node 22+ is required. Install Node or run npm start from WSL.' }
    if (-not (Test-Path -LiteralPath (Join-Path $workbenchRoot 'node_modules\three\build\three.module.js'))) { throw 'Dependencies are missing. Run npm ci in the project directory first.' }
    $workbenchProcess = Start-Process -FilePath $workbenchNode -ArgumentList ('"' + $workbenchScript + '"') -WorkingDirectory (Split-Path -Parent $workbenchNode) -WindowStyle Hidden -RedirectStandardOutput (Join-Path $workbenchRoot '.server-windows.log') -RedirectStandardError (Join-Path $workbenchRoot '.server-windows-error.log') -PassThru
    $workbenchProcess.Id | Set-Content -LiteralPath $workbenchPidFile
    $workbenchReady = $false
    for ($workbenchAttempt=0; $workbenchAttempt -lt 30; $workbenchAttempt++) {
        $workbenchProcess.Refresh()
        if ($workbenchProcess.HasExited) { throw 'Server stopped. Inspect .server-windows-error.log (port 4317 may be in use).' }
        try { $workbenchReply=Invoke-WebRequest 'http://127.0.0.1:4317/api/architecture' -UseBasicParsing -TimeoutSec 1; if ($workbenchReply.StatusCode -eq 200) { $workbenchReady=$true; break } } catch {}
        Start-Sleep -Milliseconds 200
    }
    if (-not $workbenchReady) { throw 'Startup timed out. Inspect .server-windows-error.log.' }
}
Write-Output 'Workbench ready: http://127.0.0.1:4317'
if (-not $NoBrowser) { Start-Process 'http://127.0.0.1:4317' }
