@echo off

:: The version
IF "%~1"=="" (
    SET version=17.1.10
) ELSE (
    SET version=%~1
)

SET isPrerelease=false

:: The repo (current dir)
SET repo_path=%~dp0..\..
:: The build path
SET build_path=%~dp0output

echo Building Duik version %version%...

:: Clean
echo __Cleaning build paths

rd /s /q "%build_path%"
md "%build_path%"
rd /s /q "%repo_path%\dist"
md "%repo_path%\dist"
rd /s /q "%repo_path%\docs"
md "%repo_path%\docs"
rd /s /q "%repo_path%\types\duik"
md "%repo_path%\types\duik"

del "%repo_path%\scriptlets\libs\Duik_api_1.jsxinc"
del "%repo_path%\scriptlets\libs\Duik_api_2.jsxinc"
del "%repo_path%\scriptlets\libs\Duik_api_3.jsxinc"

:: Build
echo __Building API

DuBuilder "%repo_path%\src\Scripts\ScriptUI Panels\inc\api1.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%repo_path%\scriptlets\libs\Duik_api_1.jsxinc"
DuBuilder "%repo_path%\src\Scripts\ScriptUI Panels\inc\api2.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%repo_path%\scriptlets\libs\Duik_api_2.jsxinc"
DuBuilder "%repo_path%\src\Scripts\ScriptUI Panels\inc\api3.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%repo_path%\scriptlets\libs\Duik_api_3.jsxinc"
:: Copy Scriptlets and the API in the output
md "%build_path%\Duik_API"
xcopy "%repo_path%\scriptlets" "%build_path%\Duik_API\" /E /y
:: copy to dist
xcopy "%repo_path%\scriptlets\libs" "%repo_path%\dist\libs\" /E /y
echo " " > "%repo_path%\dist\Duik_api.jsxinc"
xcopy /Y "%repo_path%\scriptlets\Duik_api.jsxinc" "%repo_path%\dist\Duik_api.jsxinc"

:: Build Duik panels
echo __Building Duik Panels

md "%build_path%\Duik"
md "%build_path%\Duik\Scripts"
md "%build_path%\Duik\Scripts\ScriptUI Panels"

DuBuilder "%repo_path%\src\Scripts\ScriptUI Panels\DuCop.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\ScriptUI Panels\DuCop.jsx"
DuBuilder "%repo_path%\src\Scripts\ScriptUI Panels\Duik Angela.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\ScriptUI Panels\Duik Angela.jsx"
DuBuilder "%repo_path%\src\Scripts\ScriptUI Panels\Duik Animation Library.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\ScriptUI Panels\Duik Animation Library.jsx"
DuBuilder "%repo_path%\src\Scripts\ScriptUI Panels\Duik Animation.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\ScriptUI Panels\Duik Animation.jsx"
DuBuilder "%repo_path%\src\Scripts\ScriptUI Panels\Duik Automation and expressions.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\ScriptUI Panels\Duik Automation and expressions.jsx"
DuBuilder "%repo_path%\src\Scripts\ScriptUI Panels\Duik Bones.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\ScriptUI Panels\Duik Bones.jsx"
DuBuilder "%repo_path%\src\Scripts\ScriptUI Panels\Duik Camera.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\ScriptUI Panels\Duik Camera.jsx"
DuBuilder "%repo_path%\src\Scripts\ScriptUI Panels\Duik Cmd.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\ScriptUI Panels\Duik Cmd.jsx"
DuBuilder "%repo_path%\src\Scripts\ScriptUI Panels\Duik Constraints.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\ScriptUI Panels\Duik Constraints.jsx"
DuBuilder "%repo_path%\src\Scripts\ScriptUI Panels\Duik Controllers.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\ScriptUI Panels\Duik Controllers.jsx"
DuBuilder "%repo_path%\src\Scripts\ScriptUI Panels\Duik Layer Manager.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\ScriptUI Panels\Duik Layer Manager.jsx"
DuBuilder "%repo_path%\src\Scripts\ScriptUI Panels\Duik Notes.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\ScriptUI Panels\Duik Notes.jsx"
DuBuilder "%repo_path%\src\Scripts\ScriptUI Panels\Duik OCO.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\ScriptUI Panels\Duik OCO.jsx"
DuBuilder "%repo_path%\src\Scripts\ScriptUI Panels\Duik Rigging.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\ScriptUI Panels\Duik Rigging.jsx"
DuBuilder "%repo_path%\src\Scripts\ScriptUI Panels\Duik Script Editor.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\ScriptUI Panels\Duik Script Editor.jsx"
DuBuilder "%repo_path%\src\Scripts\ScriptUI Panels\Duik Script Library.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\ScriptUI Panels\Duik Script Library.jsx"

:: Build Scriptlets
echo __Building Duik Scriptlets

DuBuilder "%repo_path%\scriptlets\Duik_addAdjustmentLayer.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\Duik Create Adjustment Layer.jsx"
DuBuilder "%repo_path%\scriptlets\Duik_addNull.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\Duik Create Null.jsx"
DuBuilder "%repo_path%\scriptlets\Duik_addSolid.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\Duik Create Solid.jsx"
DuBuilder "%repo_path%\scriptlets\Duik_autoParent.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\Duik Auto Parent.jsx"
DuBuilder "%repo_path%\scriptlets\Duik_editExpression.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\Duik Edit Expression.jsx"
DuBuilder "%repo_path%\scriptlets\Duik_reloadExpressions.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\Duik Reload Expressions.jsx"
DuBuilder "%repo_path%\scriptlets\Duik_copyAnimation.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\Duik Copy Animation.jsx"
DuBuilder "%repo_path%\scriptlets\Duik_cutAnimation.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\Duik Cut Animation.jsx"
DuBuilder "%repo_path%\scriptlets\Duik_pasteAnimation.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\Duik Paste Animation.jsx"

:: Build Doc ::
echo __Building Duik docs

cd "%repo_path%\src-docs"
mkdocs build
cd %~dp0

:: Generate Reference ::
echo __Generating Duik API reference

DuBuilder "%build_path%\Duik_API\Duik_api.jsxinc" --no-banner -r "{duikVersion}:%version%" "%build_path%\Duik_API\Duik_api_fordoc.jsxinc"
cmd /c jsdoc -c jsdoc_conf.json
echo " " > "%build_path%\docs\api\jsdoc.css"
xcopy /Y assets\jsdoc.css "%build_path%\docs\api\jsdoc.css"
xcopy /Y "%build_path%\docs\api\Duik.html" "%build_path%\docs\api\index.html"
xcopy /S /I /Y "%build_path%\docs\api" "%build_path%\Duik_API\docs"

:: Generate type defs ::
echo __Generating type defs

md "%build_path%\Duik_API\types"
cmd /c jsdoc -c jsdoc_ts_conf.json
:: copy types to output
xcopy /S /I /Y "%repo_path%\types\duik\.." "%build_path%\Duik_API\types"

del "%build_path%\Duik_API\Duik_api_fordoc.jsxinc"

:: Copy files where they need to be ::
echo __Finishing...

md "%build_path%\Duik\Tools"
echo " " > "%build_path%\Duik\LICENSE.md"
echo " " > "%build_path%\Duik\LICENSE.txt"
echo " " > "%build_path%\Duik\README.txt"
echo " " > "%build_path%\Duik_API\LICENSE.md"
echo " " > "%build_path%\Duik_API\LICENSE.txt"
echo " " > "%build_path%\Duik\Tools\DuSI.jsx"
xcopy /Y "assets\LICENSE.md" "%build_path%\Duik\LICENSE.md"
xcopy /Y "assets\LICENSE.txt" "%build_path%\Duik\LICENSE.txt"
xcopy /Y "assets\README.txt" "%build_path%\Duik\README.txt"
xcopy /Y "assets\LICENSE.md" "%build_path%\Duik_API\LICENSE.md"
xcopy /Y "assets\LICENSE.txt" "%build_path%\Duik_API\LICENSE.txt"
xcopy /Y "assets\DuSI.jsx" "%build_path%\Duik\Tools\DuSI.jsx"

echo Done !
