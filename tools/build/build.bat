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

rd /s /q "%build_path%"
md "%build_path%"
rd /s /q "%dist_path%"
md "%dist_path%"
rd /s /q "%docs_path%"
md "%docs_path%"
rd /s /q "%types_path%"
md "%types_path%"

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

:: Build Duik panels
echo __Building Duik Panels

md "%build_path%\Duik"
md "%build_path%\Duik\Scripts"
md "%build_path%\Duik\Scripts\ScriptUI Panels"

DuBuilder "%src_path%\DuCop.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\ScriptUI Panels\DuCop.jsx"
DuBuilder "%src_path%\Duik Angela.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\ScriptUI Panels\Duik Angela.jsx"
DuBuilder "%src_path%\Duik Animation Library.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\ScriptUI Panels\Duik Animation Library.jsx"
DuBuilder "%src_path%\Duik Animation.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\ScriptUI Panels\Duik Animation.jsx"
DuBuilder "%src_path%\Duik Automation and expressions.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\ScriptUI Panels\Duik Automation and expressions.jsx"
DuBuilder "%src_path%\Duik Bones.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\ScriptUI Panels\Duik Bones.jsx"
DuBuilder "%src_path%\Duik Camera.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\ScriptUI Panels\Duik Camera.jsx"
DuBuilder "%src_path%\Duik Cmd.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\ScriptUI Panels\Duik Cmd.jsx"
DuBuilder "%src_path%\Duik Constraints.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\ScriptUI Panels\Duik Constraints.jsx"
DuBuilder "%src_path%\Duik Controllers.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\ScriptUI Panels\Duik Controllers.jsx"
DuBuilder "%src_path%\Duik Layer Manager.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\ScriptUI Panels\Duik Layer Manager.jsx"
DuBuilder "%src_path%\Duik Notes.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\ScriptUI Panels\Duik Notes.jsx"
DuBuilder "%src_path%\Duik OCO.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\ScriptUI Panels\Duik OCO.jsx"
DuBuilder "%src_path%\Duik Rigging.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\ScriptUI Panels\Duik Rigging.jsx"
DuBuilder "%src_path%\Duik Script Editor.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\ScriptUI Panels\Duik Script Editor.jsx"
DuBuilder "%src_path%\Duik Script Library.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\ScriptUI Panels\Duik Script Library.jsx"

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
echo " " > "%docsapi_path%\jsdoc.css"
xcopy /Y assets\jsdoc.css "%docsapi_path%\jsdoc.css"
xcopy /Y "%docsapi_path%\Duik.html" "%docsapi_path%\index.html"
xcopy /S /I /Y "%docsapi_path%" "%build_path%\Duik_API\docs"

:: Generate type defs ::
echo __Generating type defs

md "%build_path%\Duik_API\types"
cmd /c jsdoc -c jsdoc_ts_conf.json
:: copy types to output
xcopy /S /I /Y "%types_path%\.." "%build_path%\Duik_API\types"

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
