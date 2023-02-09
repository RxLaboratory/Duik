@echo off

:: The version
SET version=17.0.2
SET isPrerelease=false

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
DuBuilder "%repoPath%\inc\api1.jsxinc" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%repoPath%\scriptlets\libs\Duik_api_1.jsxinc"
DuBuilder "%repoPath%\inc\api2.jsxinc" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%repoPath%\scriptlets\libs\Duik_api_2.jsxinc"
DuBuilder "%repoPath%\inc\api3.jsxinc" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%repoPath%\scriptlets\libs\Duik_api_3.jsxinc"

:: Copy Scriptlets and the API in the output
xcopy "%repoPath%\scriptlets" "%build_path%\Duik_API\" /E /y

:: Build Duik panels
DuBuilder "%repoPath%\DuCop.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\ScriptUI Panels\DuCop.jsx"
DuBuilder "%repoPath%\Duik Angela.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\ScriptUI Panels\Duik Angela.jsx"
DuBuilder "%repoPath%\Duik Animation Library.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\ScriptUI Panels\Duik Animation Library.jsx"
DuBuilder "%repoPath%\Duik Animation.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\ScriptUI Panels\Duik Animation.jsx"
DuBuilder "%repoPath%\Duik Automation and expressions.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\ScriptUI Panels\Duik Automation and expressions.jsx"
DuBuilder "%repoPath%\Duik Bones.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\ScriptUI Panels\Duik Bones.jsx"
DuBuilder "%repoPath%\Duik Camera.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\ScriptUI Panels\Duik Camera.jsx"
DuBuilder "%repoPath%\Duik Cmd.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\ScriptUI Panels\Duik Cmd.jsx"
DuBuilder "%repoPath%\Duik Constraints.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\ScriptUI Panels\Duik Constraints.jsx"
DuBuilder "%repoPath%\Duik Controllers.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\ScriptUI Panels\Duik Controllers.jsx"
DuBuilder "%repoPath%\Duik Layer Manager.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\ScriptUI Panels\Duik Layer Manager.jsx"
DuBuilder "%repoPath%\Duik Notes.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\ScriptUI Panels\Duik Notes.jsx"
DuBuilder "%repoPath%\Duik OCO.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\ScriptUI Panels\Duik OCO.jsx"
DuBuilder "%repoPath%\Duik Rigging.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\ScriptUI Panels\Duik Rigging.jsx"
DuBuilder "%repoPath%\Duik Script Editor.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\ScriptUI Panels\Duik Script Editor.jsx"
DuBuilder "%repoPath%\Duik Script Library.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\ScriptUI Panels\Duik Script Library.jsx"

:: Build Scriptlets
DuBuilder "%repoPath%\scriptlets\Duik_addAdjustmentLayer.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\Duik Create Adjustment Layer.jsx"
DuBuilder "%repoPath%\scriptlets\Duik_addNull.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\Duik Create Null.jsx"
DuBuilder "%repoPath%\scriptlets\Duik_addSolid.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\Duik Create Solid.jsx"
DuBuilder "%repoPath%\scriptlets\Duik_autoParent.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\Duik Auto Parent.jsx"
DuBuilder "%repoPath%\scriptlets\Duik_editExpression.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\Duik Edit Expression.jsx"
DuBuilder "%repoPath%\scriptlets\Duik_reloadExpressions.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\Duik Reload Expressions.jsx"
DuBuilder "%repoPath%\scriptlets\Duik_copyAnimation.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\Duik Copy Animation.jsx"
DuBuilder "%repoPath%\scriptlets\Duik_cutAnimation.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\Duik Cut Animation.jsx"
DuBuilder "%repoPath%\scriptlets\Duik_pasteAnimation.jsx" --no-banner -r "{duikVersion}:%version%" -r "var isPreRelease = false:var isPreRelease = %isPrerelease%" "%build_path%\Duik\Scripts\Duik Paste Animation.jsx"

:: Build API reference
DuBuilder "%build_path%\Duik_API\Duik_api.jsxinc" --no-banner -r "{duikVersion}:%version%" "%build_path%\Duik_API\Duik_api_fordoc.jsxinc"
cmd /c jsdoc -c jsdoc_conf.json
echo " " > "%build_path%\Duik_API\docs\jsdoc.css"
xcopy "jsdoc.css" "%build_path%\Duik_API\docs\jsdoc.css" /y
xcopy "%build_path%\Duik_API\docs\Duik.html" "%build_path%\Duik_API\docs\index.html" /y
del "%build_path%\Duik_API\Duik_api_fordoc.jsxinc"

:: Build Guide
cd "%repoPath%\Duik_Docs\src"
mkdocs build

:: Copy other items
echo " " > "%build_path%\Duik\LICENSE.md"
echo " " > "%build_path%\Duik\LICENSE.txt"
echo " " > "%build_path%\Duik\README.txt"
echo " " > "%build_path%\Duik_API\LICENSE.md"
echo " " > "%build_path%\Duik_API\LICENSE.txt"
echo " " > "%build_path%\Duik\Tools\DuSI.jsx"
xcopy /Y "%repoPath%\tools\build tools\items\LICENSE.md" "%build_path%\Duik\LICENSE.md"
xcopy /Y "%repoPath%\tools\build tools\items\LICENSE.txt" "%build_path%\Duik\LICENSE.txt"
xcopy /Y "%repoPath%\tools\build tools\items\README.txt" "%build_path%\Duik\README.txt"
xcopy /Y "%repoPath%\tools\build tools\items\LICENSE.md" "%build_path%\Duik_API\LICENSE.md"
xcopy /Y "%repoPath%\tools\build tools\items\LICENSE.txt" "%build_path%\Duik_API\LICENSE.txt"
xcopy /Y "%repoPath%\tools\build tools\items\DuSI.jsx" "%build_path%\Duik\Tools\DuSI.jsx"

echo Done !
