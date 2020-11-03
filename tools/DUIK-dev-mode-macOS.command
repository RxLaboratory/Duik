# right click and click open on macOS
# edit your DuAEF_Duik/DuAEF repo path, make sure you had cloned DUIK and DUAEF

duik=$HOME/DuAEF_Duik;
duaef=$HOME/DuAEF;

#sync the folder structure of libs(do not link the libs folder directly)
rsync -a $duaef/src/libs  $duik/src/  --include \*/ --exclude \*;

#ln libs(maybe you should delete the origin libs in the DUIK src folder first)
for file in $duaef/src/libs/icons/*; do ln -sf $file $duik/src/libs/icons;done;
for file in $duaef/src/libs/pseudoEffects/*; do ln -sf $file $duik/src/libs/pseudoEffects;done;
for file in $duaef/src/libs/expressionLib/*; do ln -sf $file $duik/src/libs/expressionLib;done;
for file in $duaef/src/libs/DuAELib/*; do ln -sf $file $duik/src/libs/DuAELib;done;
for file in $duaef/src/libs/DuikLib/*; do ln -sf $file $duik/src/libs/DuikLib;done;
for file in $duaef/src/libs/DuJSLib/*; do ln -sf $file $duik/src/libs/DuJSLib;done;
for file in $duaef/src/libs/DuScriptUILib/*.jsxinc; do ln -sf $file $duik/src/libs/DuScriptUILib;done;
for file in $duaef/src/libs/DuScriptUILib/icons/*; do ln -sf $file $duik/src/libs/DuScriptUILib/icons;done;
for file in $duaef/src/libs/third-party/*; do ln -sf $file $duik/src/libs/third-party;done;
for file in $duaef/src/libs/*.jsxinc; do ln -sf $file $duik/src/libs;done;

#ln DUAEF(maybe you should delete the origin DuAEF.jsxinc in the DUIK src folder first)

ln -sf $duaef/src/DuAEF.jsxinc $duik/src;

#edit your Ae path and ln DUIK Bassel.2.jsx

sudo ln -sf $duik/src/Duik\ Bassel.2.jsx \/Applications\/Adobe\ After\ Effects\ CC\ 2019\/Scripts\/ScriptUI\ Panels 2>/dev/null
sudo ln -sf $duik/src/Duik\ Bassel.2.jsx \/Applications\/Adobe\ After\ Effects\ 2020\/Scripts\/ScriptUI\ Panels 2>/dev/null
sudo ln -sf $duik/src/Duik\ Bassel.2.jsx \/Applications\/Adobe\ After\ Effects\ 2021\/Scripts\/ScriptUI\ Panels 2>/dev/null

echo "done! open AE and run duik from window menu"
