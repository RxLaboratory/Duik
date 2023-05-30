@echo off

:: The version
SET version=17.1.3
SET isPrerelease=false

:: The repo (current dir)
SET repoPath=%~dp0..\..
SET srcPath=%repoPath%\src

:: The build path
SET build_path=%~dp0output

echo Building "%repoPath%" in "%build_path%"...

:: Clean
rd /s /q "%build_path%"
md "%build_path%"

:: Build Duik Ángela
DuBuilder "%srcPath%\Duik Angela.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik Angela.jsx"
