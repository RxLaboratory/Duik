@echo off

:: The version
IF "%~1"=="" (
    SET version=17.1.3
) ELSE (
    SET version=%~1
)

:: The repo (current dir)
SET repo_path=%~dp0..\..
:: The build path
SET build_path=%~dp0output

echo Building Duik Doc for version %version%...

:: Clean
echo __Cleaning build paths

rd /s /q "%build_path%\docs\api"
md "%build_path%\docs\api"

:: Build
echo __Building Guide

md "%build_path%\docs"
cd "%repo_path%\src-docs"
mkdocs build
cd "%~dp0"

echo __Generating Duik API reference

md "%build_path%\Duik_API"
md "%build_path%\docs\api"
DuBuilder "%repo_path%\scriptlets\Duik_api.jsxinc" --no-banner -r "{duikVersion}:%version%" "%build_path%\Duik_API\Duik_api_fordoc.jsxinc"
cmd /c jsdoc -c jsdoc_conf.json
echo " " > "%build_path%\docs\api\jsdoc.css"
xcopy /Y assets\jsdoc.css "%build_path%\docs\api\jsdoc.css"
xcopy /Y "%build_path%\docs\api\Duik.html" "%build_path%\docs\api\index.html"
xcopy /S /I /Y "%build_path%\docs\api" "%build_path%\Duik_API\docs"
