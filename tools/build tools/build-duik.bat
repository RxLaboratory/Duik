cd ..
cd ..
del /s /q docs
rmdir /s /q docs
mkdir docs
cd tools
cd "build tools"
mkdir output
mkdir "output\Duik_Bassel.2"
mkdir "output\Duik_Bassel.2\Optional Panels"
mkdir "output\Duik_Bassel.2\ScriptUI Panels"
mkdir "output\Duik_Bassel.2\Tools"
mkdir "output\Duik_Bassel.2\Help"
mkdir output\Duik_API
DuBuilder ../../src/duik_required/api/Duik16_api.jsxinc -nobanner output/Duik_API/Duik16_api.jsxinc
DuBuilder ../../src/duik_required/api/Duik16_api-simple.jsxinc -nobanner output/Duik_API/Duik16_api.jsxinc -d jsdoc_conf.json duik-api-doc.jsxinc
del /s /q duik-api-doc.jsxinc
DuBuilder "../../src/Duik Animation.jsx" --nobanner "output\Duik_Bassel.2\Optional Panels\Duik Animation.jsx"
DuBuilder "../../src/Duik Automations.jsx" --nobanner "output\Duik_Bassel.2\Optional Panels\Duik Automations.jsx"
DuBuilder "../../src/Duik Camera.jsx" --nobanner "output\Duik_Bassel.2\Optional Panels\Duik Camera.jsx"
DuBuilder "../../src/Duik Cmd.jsx" --nobanner "output\Duik_Bassel.2\Optional Panels\Duik Cmd.jsx"
DuBuilder "../../src/Duik Constraints.jsx" --nobanner "output\Duik_Bassel.2\Optional Panels\Duik Constraints.jsx"
DuBuilder "../../src/Duik Controllers.jsx" --nobanner "output\Duik_Bassel.2\Optional Panels\Duik Controllers.jsx"
DuBuilder "../../src/Duik Notes.jsx" --nobanner "output\Duik_Bassel.2\Optional Panels\Duik Notes.jsx"
DuBuilder "../../src/Duik Rigging.jsx" --nobanner "output\Duik_Bassel.2\Optional Panels\Duik Rigging.jsx"
DuBuilder "../../src/Duik Structures.jsx" --nobanner "output\Duik_Bassel.2\Optional Panels\Duik Structures.jsx"
DuBuilder "../../src/Duik Tools.jsx" --nobanner "output\Duik_Bassel.2\Optional Panels\Duik Tools.jsx"
DuBuilder "../../src/Duik Bassel.2.jsx" -nobanner "output\Duik_Bassel.2\ScriptUI Panels\Duik Bassel.2.jsx"
DuBuilder "..\Uninstall Duik.jsx" --nobanner "output\Duik_Bassel.2\Tools\Uninstall Duik.jsx"
echo " " > "output\Duik_Bassel.2\LICENSE.md"
echo " " > "output\Duik_Bassel.2\LICENSE.txt"
echo " " > "output\Duik_Bassel.2\README.txt"
xcopy /Y items\LICENSE.md "output\Duik_Bassel.2\LICENSE.md"
xcopy /Y items\LICENSE.txt "output\Duik_Bassel.2\LICENSE.txt"
xcopy /Y items\README.txt "output\Duik_Bassel.2\README.txt"
xcopy /S /I /Y ..\..\docs output\Duik_API\docs
cd output\Duik_API\docs
xcopy /Y Duik.html index.html
cd ..
cd ..
cd ..
cd ..
cd ..
cd docs
xcopy /Y Duik.html index.html
echo duik-api.rainboxlab.org > CNAME
pause