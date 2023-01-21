@echo off

:: The repo (current dir)
SET repoPath=%~dp0..\..

:: The build path
SET build_path=%~dp0build

:: Copy Scriptlets and the API in the output
xcopy "%repoPath%\scriptlets" "%build_path%\Duik_API\" /E /y

:: Build Scriptlets
DuBuilder "%repoPath%\scriptlets\Duik_addAdjustmentLayer.jsx" --no-banner "%build_path%\Duik\Scripts\Duik Create Adjustment Layer.jsx"
DuBuilder "%repoPath%\scriptlets\Duik_addNull.jsx" --no-banner "%build_path%\Duik\Scripts\Duik Create Null.jsx"
DuBuilder "%repoPath%\scriptlets\Duik_addSolid.jsx" --no-banner "%build_path%\Duik\Scripts\Duik Create Solid.jsx"
DuBuilder "%repoPath%\scriptlets\Duik_autoParent.jsx" --no-banner "%build_path%\Duik\Scripts\Duik Auto Parent.jsx"
DuBuilder "%repoPath%\scriptlets\Duik_editExpression.jsx" --no-banner "%build_path%\Duik\Scripts\Duik Edit Expression.jsx"
DuBuilder "%repoPath%\scriptlets\Duik_reloadExpressions.jsx" --no-banner "%build_path%\Duik\Scripts\Duik Reload Expressions.jsx"
DuBuilder "%repoPath%\scriptlets\Duik_copyAnimation.jsx" --no-banner "%build_path%\Duik\Scripts\Duik Copy Animation.jsx"
DuBuilder "%repoPath%\scriptlets\Duik_cutAnimation.jsx" --no-banner "%build_path%\Duik\Scripts\Duik Cut Animation.jsx"
DuBuilder "%repoPath%\scriptlets\Duik_pasteAnimation.jsx" --no-banner "%build_path%\Duik\Scripts\Duik Paste Animation.jsx"

echo Done !
