(c) 2020 Nicolas Dufresne and contributors  
Copying and distribution of this file, with or without modification,
are permitted in any medium without royalty provided the copyright
notice and this notice are preserved.  This file is offered as-is,
without any warranty.

# Duik

Duduf IK & Animation Tools for Adobe After Effects

The essential tools for animation in After Effects: Autorig, Inverse Kinematics (IK), Bones, Constraints, Dynamics… Animation becomes handy and easy on After Effects!

## Getting help with Duik

There are a lot of ways to get help with Duik!

- Read the official comprehensive user guide: http://duik-docs.rainboxlab.org where you will find documentation for all the tools, an FAQ, and a lot of other information.

- Watch some tutorials! http://duik-tutorials.rainboxlab.org

- Search on the forum: https://forum.rainboxlab.org, and ask your question there if you don't find what you need.

- Come and have a chat on the dedicated Discord server! http://chat.rainboxlab.org

## Supported versions of After Effects 

Duik has been tested and is working with all versions of After Effects since CC2018. That means it works correctly on:
CC2018 (15), CC2019 (16), 2020 (17) and upcoming versions.

It is also known to be working decently on CS6 (11), CC (12), CC2014 (13), CC2015 (13.5), CC2017 (14), but you can't be sure, and Duik does not officially support these versions.

!!! Note: CS6 has a lot of issues with Script Panels like the one used by Duik. Duik will work on CS6, but you may have to close and re-open it often to fix the UI issues you may have... You also have to know that the performance is pretty poor with CS6.

### Not supported

All versions before CS6 won't be able to correctly run Duik, sorry! Time to update...

# Installation

## **1 - Download** Duik from the [official website](https://rainboxprod.coop/en/tools/duik/).


## **2 - Unzip** the files you have downloaded.

You'll find several folders and files.

- *"README"* contains a lot of information to help you get started with Duik.
- *"LICENSE"* contains the license of Duik, the [GNU-GPL v3](https://www.gnu.org/licenses/gpl-3.0.html).
- The *Help* folder contains this help pages. Double click on the file "index.html" to open it.
- The *Tools* folder contains some tools for other third-party software, like a script to export TVPaint animations.
- The *ScriptUI Panels* folder contains the actual *Duik Bassel* script you need to install.
- The *Optional Panels* folder contains [optionnal individual panels](first-look-at-duik.md#individual-panels) to use with Duik. You can choose to install any of them or not at all.


## **3 -** There are several ways to install Duik very easily:  

### a. Copy the files

Copy all the files from the *ScriptUI Panels* folder to:

- Windows: `C:\Program Files\Adobe\Adobe After Effects CC\Support Files\Scripts\ScriptUI Panels\`  
- Mac OS: `/Applications/Adobe After Effects CC/Scripts/ScriptUI Panels`

You can also copy the [optionnal individual panels](first-look-at-duik.md#individual-panels) of your choice from the *Optionnal Panels* to the same folders.

You may need administrator privileges to install Duik this way. If you don't have them, see the other ways below.

!!! Warning
    With the other installation methods, some features using third party tools, like transcoding sound when exporting to Adobe Audition, may not work correctly.

### b. Shortcut for After Effects CC2018 and more recent

- Open After Effects  
- *Windows*: Holding the [Alt] and [Shift] keys, drag and drop the file `Duik Bassel.jsx` onto the project panel.  
- *Mac OS*: Holding the [Options] and [Shift] keys, drag and drop the file `Duik Bassel.jsx` onto the project panel.  

### c. Using the menu for After Effects CC2019 and more recent

- Open After Effects  
- Use the `File/Scritps/Install ScriptUI Panel...` menu to select and install `Duik Bassel.jsx`.  

## **4 - Restart** After Effects and Duik will be available in the "Window" menu.

# Without installation 

You'll always be able to run Duik without even installing it. This is a good way to use it if you do not have administrator privileges on an older version of After Effects.

- Unzip all the files in any folder.  
- Launch After Effects, and start Duik via the `File/Scripts/Run script file...` menu.
