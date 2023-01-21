@echo off

:: The repo (current dir)
SET repoPath=%~dp0..\..

:: The build path
SET build_path=%~dp0build

echo Building "%repoPath%" in "%build_path%"...

:: Clean
rd /s /q "%build_path%"
md "%build_path%"

rd /s /q "%repoPath%\scriptlets\libs"
md "%repoPath%\scriptlets\libs"

:: Build folders
md "%build_path%\Duik"
md "%build_path%\Duik\Tools"
md "%build_path%\Duik\Scripts"
md "%build_path%\Duik\Scripts\ScriptUI Panels"
md "%build_path%\Duik_API"
md "%build_path%\Duik_API\libs"

:: Build Dependencies
DuBuilder "%repoPath%\DuAEF\DuAEF.jsxinc" --no-banner "%repoPath%\scriptlets\libs\DuAEF.jsxinc"
DuBuilder "%repoPath%\DuGR\inc\api.jsxinc" --no-banner "%repoPath%\scriptlets\libs\DuGR_api.jsxinc"
DuBuilder "%repoPath%\DuIO\inc\api.jsxinc" --no-banner "%repoPath%\scriptlets\libs\DuIO_api.jsxinc"
DuBuilder "%repoPath%\DuSan\inc\api.jsxinc" --no-banner "%repoPath%\scriptlets\libs\DuSan_api.jsxinc"

:: Build API
DuBuilder "%repoPath%\inc\api1.jsxinc" --no-banner "%repoPath%\scriptlets\libs\Duik_api_1.jsxinc"
DuBuilder "%repoPath%\inc\api2.jsxinc" --no-banner "%repoPath%\scriptlets\libs\Duik_api_2.jsxinc"
DuBuilder "%repoPath%\inc\api3.jsxinc" --no-banner "%repoPath%\scriptlets\libs\Duik_api_3.jsxinc"

echo Done !
