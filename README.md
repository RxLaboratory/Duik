Duik
====
Duduf IK &amp; Animation Tools for Adobe After Effects


The essential tools for animation in After Effects: Autorig, Inverse Kinematics (IK), Bones, Morphers, Dynamics… Animation becomes handy and easy on After Effects!

###How to install:

Files to copy in "Scripts/ScriptUI Panels" in the After Effects installation folder:
* Duik.jsx
* duik\_images.jsxinc
* duik\_translations.jsxinc
* libDuik.jsxinc

You can include translation files too: "duik\_translations\_XX.jsxinc" where "XX" represents the language code.

Then, update the pseudo-effects of After Effects,
Copy the contents of "Duik_presetEffects.xml" in the "PresetEffects.xml" file of After Effects, just before the last line "</Effects>".
This file can be found in:
* C:/Program Files/Adobe/Adobe After Effects XX/Support Files/PresetEffects.xml (Win)
* /Applications/Adobe After Effects XX/Adobe After Effects XX.app/Contents/Resources/PresetEffects.xml (Mac)

###Developers:

* /Utils/convert.jsxinc is the tool used to convert the images of the UI to ASCII included in the file duik_images.jsxinc
* /UI/ contains the .psd and .png files for the icons of the buttons
* /Installer/ contains the source code of the installer used to deploy Duik on Win and Mac OSX
* /Unfinished Translations/ contains translation files still WIP

###Compatibility:

After Effects CS4: works but the appearance of the buttons makes them sometimes hard to read

CS5, CS5.5, CS6, CC, CC2014: full compatibility
