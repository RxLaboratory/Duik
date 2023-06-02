@echo off

:: The version
IF "%~1"=="" (
    SET version=17.1.3
) ELSE (
    SET version=%~1
)

SET isPrerelease=false

:: The repo (current dir)
SET repo_path=%~dp0..\..
:: The source
SET src_path="%repo_path%\src"
:: The build path
SET build_path="%~dp0output"
:: The dist path to copy the result
SET dist_path="%repo_path%\dist"
:: The docs path
SET docs_path="%repo_path%\docs"
SET docsapi_path="%repo_path%\docs\api"
:: The types path
SET types_path="%repo_path%\types\duik"
:: The scriptlets path
SET scriptlets_path="%repo_path%\scriptlets"

echo Building Duik version %version%...

:: Clean
echo __Cleaning build paths

rd /s /q "%build_path%\Duik_API"
md "%build_path%\Duik_API"
rd /s /q "%dist_path%"
md "%dist_path%"
rd /s /q "%docs_path%\api"
md "%docs_path%\api"

del "%scriptlets_path%\scriptlets\libs\Duik_api_1.jsxinc"
del "%scriptlets_path%\scriptlets\libs\Duik_api_2.jsxinc"
del "%scriptlets_path%\scriptlets\libs\Duik_api_3.jsxinc"

:: Build
echo __Building API

DuBuilder "%src_path%\inc\api1.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%scriptlets_path%\libs\Duik_api_1.jsxinc"
DuBuilder "%src_path%\inc\api2.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%scriptlets_path%\libs\Duik_api_2.jsxinc"
DuBuilder "%src_path%\inc\api3.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%scriptlets_path%\libs\Duik_api_3.jsxinc"
:: Copy Scriptlets and the API in the output
md "%build_path%\Duik_API"
xcopy "%scriptlets_path%" "%build_path%\Duik_API\" /E /y
:: copy to dist
xcopy "%scriptlets_path%\libs" "%dist_path%\libs\" /E /y
echo " " > "%dist_path%\Duik_api.jsxinc"
xcopy /Y "%scriptlets_path%\Duik_api.jsxinc" "%dist_path%\Duik_api.jsxinc"

:: Generate Reference ::
echo __Generating Duik API reference

DuBuilder "%build_path%\Duik_API\Duik_api.jsxinc" --no-banner -r "{duikVersion}:%version%" "%build_path%\Duik_API\Duik_api_fordoc.jsxinc"
cmd /c jsdoc -c jsdoc_conf.json
echo " " > "%docsapi_path%\jsdoc.css"
xcopy /Y assets\jsdoc.css "%docsapi_path%\jsdoc.css"
xcopy /Y "%docsapi_path%\Duik.html" "%docsapi_path%\index.html"

:: Generate type defs ::
echo __Generating type defs

md "%build_path%\Duik_API\types"
cmd /c jsdoc -c jsdoc_ts_conf.json
:: copy types to output
xcopy /S /I /Y "%types_path%\.." "%build_path%\Duik_API\types"

::del "%build_path%\Duik_API\Duik_api_fordoc.jsxinc"

:: Copy files where they need to be ::
echo __Finishing...

echo " " > "%build_path%\Duik_API\LICENSE.md"
echo " " > "%build_path%\Duik_API\LICENSE.txt"
xcopy /Y "assets\LICENSE.md" "%build_path%\Duik_API\LICENSE.md"
xcopy /Y "assets\LICENSE.txt" "%build_path%\Duik_API\LICENSE.txt"

echo Done !