@echo off

:: Edit these variables with the correct paths on your system
SET aeVersion=2022
SET "aePath=C:\Program Files\Adobe\Adobe After Effects %aeVersion%\Support Files\Scripts\ScriptUI Panels"
:: The repo is the current dir by default
SET repoPath=%~dp0..\..

:: Need admin to create symlinks
@echo off
if not "%1"=="am_admin" (powershell start -verb runas '%0' am_admin & exit /b)
:: Get back to original dir
pushd "%CD%"
CD /D "%~dp0"

echo Installing "%repoPath%" in "%aeDir%"...

:: (Trying to) remove older files
del "%aePath%\DuCop.jsx"
del "%aePath%\Duik Angela.jsx"
del "%aePath%\Duik Animation Library.jsx"
del "%aePath%\Duik Animation.jsx"
del "%aePath%\Duik Automation and expressions.jsx"
del "%aePath%\Duik Bones.jsx"
del "%aePath%\Duik Camera.jsx"
del "%aePath%\Duik Cmd.jsx"
del "%aePath%\Duik Constraints.jsx"
del "%aePath%\Duik Controllers.jsx"
del "%aePath%\Duik Layer Manager.jsx"
del "%aePath%\Duik Notes.jsx"
del "%aePath%\Duik OCO.jsx"
del "%aePath%\Duik Rigging.jsx"
del "%aePath%\Duik Script Editor.jsx"
del "%aePath%\Duik Script Library.jsx"
rd /s /q "%aePath%\inc"

:: link the main files
mklink "%aePath%\DuCop.jsx" "%repoPath%\src\DuCop.jsx"
mklink "%aePath%\Duik Angela.jsx" "%repoPath%\src\Duik Angela.jsx"
mklink "%aePath%\Duik Animation Library.jsx" "%repoPath%\src\Duik Animation Library.jsx"
mklink "%aePath%\Duik Animation.jsx" "%repoPath%\src\Duik Animation.jsx"
mklink "%aePath%\Duik Automation and expressions.jsx" "%repoPath%\src\Duik Automation and expressions.jsx"
mklink "%aePath%\Duik Bones.jsx" "%repoPath%\src\Duik Bones.jsx"
mklink "%aePath%\Duik Camera.jsx" "%repoPath%\src\Duik Camera.jsx"
mklink "%aePath%\Duik Cmd.jsx" "%repoPath%\src\Duik Cmd.jsx"
mklink "%aePath%\Duik Constraints.jsx" "%repoPath%\src\Duik Constraints.jsx"
mklink "%aePath%\Duik Controllers.jsx" "%repoPath%\src\Duik Controllers.jsx"
mklink "%aePath%\Duik Layer Manager.jsx" "%repoPath%\src\Duik Layer Manager.jsx"
mklink "%aePath%\Duik Notes.jsx" "%repoPath%\src\Duik Notes.jsx"
mklink "%aePath%\Duik OCO.jsx" "%repoPath%\src\Duik OCO.jsx"
mklink "%aePath%\Duik Rigging.jsx" "%repoPath%\src\Duik Rigging.jsx"
mklink "%aePath%\Duik Script Editor.jsx" "%repoPath%\src\Duik Script Editor.jsx"
mklink "%aePath%\Duik Script Library.jsx" "%repoPath%\src\Duik Script Library.jsx"
echo Linked main files

mklink /D "%aePath%\inc" "%repoPath%\src\inc"
echo Linked included files in 'inc\'

pause