@echo off

REM The first arg must be the path to ScriptUI Panels
IF "%~1"=="" (
    echo Usage:
    echo dev-install.bat "path/to/Support Files/Scripts/ScriptUI Panels"
    pause
    exit /B
)

REM Optional second argyment: the repo. If omitted, will use the current directory
IF "%~2"=="" (
    SET repoPath=%~dp0..
) else (
    SET repoPath=%~2
)

echo Installing "%repoPath%" in "%~1"...

REM (Trying to) remove older files
del %1\"Duik Angela.jsx"
del %1\"Duik Animation Library.jsx"
del %1\"Duik Animation.jsx"
del %1\"Duik Cmd.jsx"
del %1\"Duik Layer Manager.jsx"
del %1\"Duik Notes.jsx"
del %1\"Duik Rigging.jsx"
del %1\"Duik Script Library.jsx"
rd /s /q %1\inc
rd /s /q %1\DuAEF
rd /s /q %1\DuGR
rd /s /q %1\DuIO

REM link the main files
mklink %1\"DuCop.jsx" "%repoPath%\DuCop.jsx"
mklink %1\"Duik Angela.jsx" "%repoPath%\Duik Angela.jsx"
mklink %1\"Duik Animation Library.jsx" "%repoPath%\Duik Animation Library.jsx"
mklink %1\"Duik Animation.jsx" "%repoPath%\Duik Animation.jsx"
mklink %1\"Duik Cmd.jsx" "%repoPath%\Duik Cmd.jsx"
mklink %1\"Duik Layer Manager.jsx" "%repoPath%\Duik Layer Manager.jsx"
mklink %1\"Duik Notes.jsx" "%repoPath%\Duik Notes.jsx"
mklink %1\"Duik Rigging.jsx" "%repoPath%\Duik Rigging.jsx"
mklink %1\"Duik Script Library.jsx" "%repoPath%\Duik Script Library.jsx"
echo Linked main files

mklink /D %1\inc %repoPath%\inc
echo Linked included files in 'inc\'

REM link dependencies
mklink /D %1\DuAEF %repoPath%\DuAEF
echo Linked DuAEF
mklink /D %1\DuGR %repoPath%\DuGR
echo Linked DuGR
mklink /D %1\DuIO %repoPath%\DuIO
echo Linked DuIO

pause