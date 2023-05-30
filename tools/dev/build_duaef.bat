@echo off
:: Run the builds of DuESF and then DuAEF

:: The repo is the current dir by default
SET repoPath=%~dp0..\..
SET duesfTools=%repoPath%\..\..\ExtendScript\DuESF\tools\build
SET duaefTools=%repoPath%\..\DuAEF\tools\build

:: Build
cd %duesfTools%
cmd /c build.bat
cd %duaefTools%
cmd /c build.bat