@echo off
cd ..
cd ..
cd Duik_Docs\src
mkdocs build
cd ..
cd docs
echo duik.rxlab.guide > "CNAME"
cd ..
cd ..
cd tools
cd "build tools"
mkdir output
mkdir "output\Duik"
mkdir "output\Duik\ScriptUI Panels"
mkdir "output\Duik\Tools"
mkdir "output\Duik\Help"
mkdir "output\Duik_API"
DuBuilder ..\..\inc\api.jsxinc -nobanner output\Duik_API\Duik_api.jsxinc
DuBuilder ..\..\inc\api_all.jsxinc -nobanner output\Duik_API\DuAEF_Duik_api.jsxinc
DuBuilder "..\..\DuCop.jsx" -nobanner "output\Duik\ScriptUI Panels\DuCop.jsx"
DuBuilder "..\..\Duik Angela.jsx" -nobanner "output\Duik\ScriptUI Panels\Duik Angela.jsx"
DuBuilder "..\..\Duik Animation Library.jsx" -nobanner "output\Duik\ScriptUI Panels\Duik Animation Library.jsx"
DuBuilder "..\..\Duik Animation.jsx" -nobanner "output\Duik\ScriptUI Panels\Duik Animation.jsx"
DuBuilder "..\..\Duik Automation and expressions.jsx" -nobanner "output\Duik\ScriptUI Panels\Duik Automation and expressions.jsx"
DuBuilder "..\..\Duik Bones.jsx" -nobanner "output\Duik\ScriptUI Panels\Duik Bones.jsx"
DuBuilder "..\..\Duik Camera.jsx" -nobanner "output\Duik\ScriptUI Panels\Duik Camera.jsx"
DuBuilder "..\..\Duik Cmd.jsx" -nobanner "output\Duik\ScriptUI Panels\Duik Cmd.jsx"
DuBuilder "..\..\Duik Constraints.jsx" -nobanner "output\Duik\ScriptUI Panels\Duik Constraints.jsx"
DuBuilder "..\..\Duik Controllers.jsx" -nobanner "output\Duik\ScriptUI Panels\Duik Controllers.jsx"
DuBuilder "..\..\Duik Layer Manager.jsx" -nobanner "output\Duik\ScriptUI Panels\Duik Layer Manager.jsx"
DuBuilder "..\..\Duik Notes.jsx" -nobanner "output\Duik\ScriptUI Panels\Duik Notes.jsx"
DuBuilder "..\..\Duik Rigging.jsx" -nobanner "output\Duik\ScriptUI Panels\Duik Rigging.jsx"
DuBuilder "..\..\Duik Script Editor.jsx" -nobanner "output\Duik\ScriptUI Panels\Duik Script Editor.jsx"
DuBuilder "..\..\Duik Script Library.jsx" -nobanner "output\Duik\ScriptUI Panels\Duik Script Library.jsx"
echo " " > "output\Duik\LICENSE.md"
echo " " > "output\Duik_API\LICENSE.md"
echo " " > "output\Duik\LICENSE.txt"
echo " " > "output\Duik_API\LICENSE.txt"
echo " " > "output\Duik\README.txt"
xcopy /Y items\LICENSE.md "output\Duik\LICENSE.md"
xcopy /Y items\LICENSE.md "output\Duik_API\LICENSE.md"
xcopy /Y items\LICENSE.txt "output\Duik\LICENSE.txt"
xcopy /Y items\LICENSE.txt "output\Duik_API\LICENSE.txt"
xcopy /Y items\README.txt "output\Duik\README.txt"
xcopy /Y items\DuSI.jsx "output\Duik\Tools\DuSI.jsx"
xcopy /Y output\Duik_API\Duik_api.jsxinc ..\..\Duik_API\Duik_api.jsxinc
xcopy /Y output\Duik_API\DuAEF_Duik_api.jsxinc ..\..\Duik_API\DuAEF_Duik_api.jsxinc
cd ..
cd ..
cd Duik_API
cd tools
cmd /c build-doc.bat
cd ..
cd ..
cd tools
cd "build tools"
xcopy /S /I /Y ..\..\Duik_API\docs output\Duik_API\docs
xcopy /S /I /Y ..\..\Duik_Docs\docs output\Duik\Help
pause