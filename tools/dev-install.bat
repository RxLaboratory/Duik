@echo off

:: The path to ScriptUI Panels
SET "aePath=C:\Program Files\Adobe\Adobe After Effects 2022\Support Files\Scripts\ScriptUI Panels"

:: The repo (current dir)
SET repoPath=%~dp0..

:: Need admin to create symlinks
@echo off
if not "%1"=="am_admin" (powershell start -verb runas '%0' am_admin & exit /b)
:: Get back to original dir
pushd "%CD%"
CD /D "%~dp0"

echo Installing "%repoPath%" in "%~1"...

:: (Trying to) remove older files
del "%aePath%\Duik Angela.jsx"
del "%aePath%\Duik Animation Library.jsx"
del "%aePath%\Duik Animation.jsx"
del "%aePath%\Duik Cmd.jsx"
del "%aePath%\Duik Layer Manager.jsx"
del "%aePath%\Duik Notes.jsx"
del "%aePath%\Duik Rigging.jsx"
del "%aePath%\Duik Script Library.jsx"
rd /s /q "%aePath%\inc"
rd /s /q "%aePath%\DuAEF"
rd /s /q "%aePath%\DuGR"
rd /s /q "%aePath%\DuIO"
rd /s /q "%aePath%\DuSan"

:: link the main files
mklink "%aePath%\DuCop.jsx" "%repoPath%\DuCop.jsx"
mklink "%aePath%\Duik Angela.jsx" "%repoPath%\Duik Angela.jsx"
mklink "%aePath%\Duik Animation Library.jsx" "%repoPath%\Duik Animation Library.jsx"
mklink "%aePath%\Duik Animation.jsx" "%repoPath%\Duik Animation.jsx"
mklink "%aePath%\Duik Automation and expressions.jsx" "%repoPath%\Duik Automation and expressions.jsx"
mklink "%aePath%\Duik Bones.jsx" "%repoPath%\Duik Bones.jsx"
mklink "%aePath%\Duik Camera.jsx" "%repoPath%\Duik Camera.jsx"
mklink "%aePath%\Duik Cmd.jsx" "%repoPath%\Duik Cmd.jsx"
mklink "%aePath%\Duik Constraints.jsx" "%repoPath%\Duik Constraints.jsx"
mklink "%aePath%\Duik Controllers.jsx" "%repoPath%\Duik Controllers.jsx"
mklink "%aePath%\Duik Layer Manager.jsx" "%repoPath%\Duik Layer Manager.jsx"
mklink "%aePath%\Duik Notes.jsx" "%repoPath%\Duik Notes.jsx"
mklink "%aePath%\Duik OCO.jsx" "%repoPath%\Duik OCO.jsx"
mklink "%aePath%\Duik Rigging.jsx" "%repoPath%\Duik Rigging.jsx"
mklink "%aePath%\Duik Script Editor.jsx" "%repoPath%\Duik Script Editor.jsx"
mklink "%aePath%\Duik Script Library.jsx" "%repoPath%\Duik Script Library.jsx"
echo Linked main files

mklink /D "%aePath%\inc" "%repoPath%\inc"
echo Linked included files in 'inc\'

:: link dependencies
mklink /D "%aePath%\DuAEF" "%repoPath%\DuAEF"
echo Linked DuAEF
mklink /D "%aePath%\DuGR" "%repoPath%\DuGR"
echo Linked DuGR
mklink /D "%aePath%\DuIO" "%repoPath%\DuIO"
echo Linked DuIO
mklink /D "%aePath%\DuSan" "%repoPath%\DuSan"
echo Linked DuSan

pause