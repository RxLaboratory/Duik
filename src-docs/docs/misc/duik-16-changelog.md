# Duik Bassel Changelog

This is the list of what has changed since the previous major version of Duik (Duik 15).

## 16.2.29

#### Fixes

- Fixed error shown when trying to use the *Spring* automaition without any selected property.
- A single undo group is now created when using the *Spring* instead of several different groups.
- After Effects no longer freezes when trying to create *Bones* with just the *Effects* group selected.
- *Wiggle* expressions have been improved to fix potential bugs, especially when using the legacy engine.

## 16.2.28

#### Fixes

- Fixed overlap simulation of the Kleaner when used on a position property.
- Fixed an issue where the Kleaner used on a spatial property would skip a frame in the caluclation of the follow-through.
- Fixed Duik storing settings in a wrong folder if the default one has been changed.

## 16.2.27

#### Fixes

- The *"Fix Unused comp"* blocking popup has been removed. Disabled the corresponding live-fix option in the *Sanity Tests*

## 16.2.26

#### Fixes

- Fixed a bug in the sanity tests initialization preventing Duik from correctly launching (*error at line 38454*).

## 16.2.25

#### Improvements

- Added useful options to the *Sanity checks*, along with new quick ways to fix detected issues.

#### Fixes

- *Parenting across comps* now takes the time offset of the precomposed layer into account.

## 16.2.24

#### Fixes

- Added an alert when *Scale Z-Link* is used without camera.
- Fixed the `duplicatedNames[name] is undefined` error.
- Raised the limits of the *Zoom* and *Truck* properties in the *2D Camera* effect.

## 16.2.23

#### Fixes

- Fixed Sanity checks with locked layers freezing Duik and other issues with layers sharing the same names.

## 16.2.22

#### Fixes

- Fixed the bug preventing Duik from launching correctly through the `File/Scripts/Run Script File` menu entry.
- Fixed the too small help panel size in some specific cases. Unfortunately, we cannot restore the resizeable behaviour from previous versions due to some limitations and bugs in the scripting API of After Effects.

## 16.2.21

#### Fixes

- Fixed the *Kleaner* on non-spatial multi-dimensional properties (like scale).

## 16.2.20

#### Fixes

- Fixed the *settingsFile is undefined* error on fresh installation.
- Fixed the additional panels (popups) being hidden after a short period of time.
- Fixed the *Object is Invalid* error at line 134XX.
- The *2D Multiplane Camera* now correctly creates the controllers even if a single layer is selected.

## 16.2.19

#### New

- ***Sanity checks***

#### Improvements

- Improved the performance of the *Kleaner* by 20-25%.

#### Fixes

- Fixed *controller extraction* when some *locators* have been rigged/animated and don't have their default expression.
- Fixed additional panels not showing up on CS6.
- Fixed the list of commands in *Duik cmd* being instantly hidden.

## 16.2.18

#### New

- New translation: русский
- A tool to automatically switch between `thisComp` and `comp("Name")` in expressions.

#### Improvements

- Updated some translations: Español, Français, 中文

#### Fixes

- The popups don't show up outside of the screen anymore when invoked from the right or bottom edge.

## 16.2.17

#### Fixes

- The units in the UI of the Connector are now correctly displayed.
- The values of the 2D Camera effect are no longer multiplied by the expressions.
- Fixed broken Connectors when applied to a controller which is then extracted.
- When creating leg Structures, "heel" is now correctly translated into available languages.

## 16.2.16

#### Fixes

- Fixed the IK/FK Switch with extracted controllers still not working in specific cases.

## 16.2.15

#### Fixes

- Fixed the IK/FK Switch with extracted controllers.
- The bones are now correctly created with the advanced engine and 3D layers.

#### Improvements

- The scale of the Effector layer is now taken into account to compute the effect.
- The path constraint handles a bit better the parenting of the layers.
- The way the expressions are built internally has been changed to ease future improvements in Duik. This should not change anything for the user, but as it's an important change, it's worth knowing and may temporarily introduce some bugs.

## 16.2.14

#### Fixes

- Fixed the Animation Blender tool for animators not working with compositions imported from another project. Be careful with composition names in this case!
- Fixed the Spring/Kleaner not working on some specific properties, like the strength of the *TextEvo* effect.
- The *Get* button in the controller edit panel does not change the size of the selected controllers anymore.
- Fixed the Auto-rig freezing in some specific cases (leg with a hoof but no foot).
- The Auto-rig now moves the controllers to the top of the composition even if they're nulls.
- Duik no longer crashes when trying to change the appearance of baked Structures.

## 16.2.13

#### Fixes

- Fixed Controller extraction used with parent accross comps failing in specific cases.
- The Parent constraint now correctly adds the expression in the Z Position of 3D Layers with dimensions separated.
- The Orientation constraint does not throw an expression error with the legacy engine anymore.

## 16.2.12

#### Fixes

- Fixed Parent constraint offset on some frames.
- Fixed Kleaner expression error introduced in 16.2.11
- Fixed Motion Trail taper expression error introduced in 16.2.11
- Fixed a few other minor issues.

## 16.2.11

#### New

- Parent accross comps now handles scale too.

#### Fixes

- Fixed Controller extraction and Parent accross comps with (negative) scale values.
- Fixed multiple Controller extraction (controllers extracted twice or more) in specific cases of inter-dependencies.
- Fixed 2D Camera position not using the exact keyframe values.
- Fixed adding keys using the animation panel: now respects the all layer/selected layers option, and works with layers having markers.
- You can now use values lower than 1 for the width of motion trails

## 16.2.10

#### Fixes

- The Wheel automation now works correctly with negative scales
- Improved Esperanto, French and Spanish translations.

## 16.2.9

#### New

- Duik is now available in Esperanto too.

#### Fixes

- Fixed the auto-rig freezing when rigging (at once) tail structures and spine structures without hips.
- Properly centered the auto-rig button on the Structures panel in *Expert* and *God* modes.
- Parent accross comps now works when the child layer is locked.
- The Time Remap tool now takes the layer in point into account.

## 16.2.8

#### Improvements

- When using the Kleaner through the *Spring* button, the *Spatial Options* are set to *Basic* instead of *Simulated* by default, in order to improve performance.
- The Auto-Parent tool now parents only orphans whith [Alt + Click].

#### Fixes

- Fixed an issue where controllers would not be linked properly after extraction (happened when some controllers were duplicated layers).

## 16.2.7

#### Improvements

- [Alt] + [Click] on the remove expressions button now removes expressions keeping the pre-expression value (instead of post-expression value by default)

#### Fixes

- Fixed a bug where the auto-rig would freeze when rigging arms with hooves.
- Controller as nulls are now created as 3D layers on Cameras and Lights too.
- The blink automation no longer generates an expression error when the frequency is set to 0.
- Controller extraction now works correctly when controllers have zeroes and using master properties instead of expressions. Some issues when parenting accross compositions using master properties are fixed as well.
- Rigging and ungulate front leg without hoof now works correctly.
- Rigging a spine when set to use null layers for controllers no longer fails.

## 16.2.6

#### Improvements

- Tagging layers as controllers now automatically sets them to guide layers.

#### Fixes

- Fixed a bug with bones set on a Bézier path on a shape layer with the legacy extendscript expression engine.
- Fixed a few minor bugs concerning layer parenting.

## 16.2.5

#### Improvements

- It is now safe to extract controllers from a duplicated rigged character, even if its controllers have already been extracted in the same composition.
- Holding  Ctrl ] when creating [Controllers, the new controllers is now *inserted* in the hierarchy (i.e. the layers are parented to the controllers, and the controllers are parented to the previous parents of the layers).
- When extracting locators and parenting accross compositions it is now possible to use master properties (if the parent is in a precomposition, not in a "parent" composition). Duik will select master properties by default if the version of After Effects is more recent than 17.0.
- Added new Controller shapes, especially for the face.
- Controller icons can now be flipped (see the effect of the controller).
- French and Spanish translations have been completed and improved.

#### Fixes

- When extracting controllers using master properties, controllers with a parent which is something else than another controller are now correctly linked.
- Bones are now correctly aligned to shapes inside shape layers when the containing group(s) transformation is not 0.

## 16.2.4

#### Improvements

- The *Kleaner* now generates very nice animation when the *Bounce* option is checked in the *Follow through* section. Bounces are more realistic, but it's not a real simulation: they are synchronized to the actual frames of the composition so that you always see the contact, and bounces which would be shorter than two frames are "snaped" to the frames anyway. This is animation!

#### Fixes

- *Error at line 2514* and similar errors with the "DuTranslator tr()" function should not happen anymore (unless the dev&debug mode is activated).
- *Structures* are now correctly duplicated using the *Duplicate* tool.

## 16.2.3

#### Improvements

- The UI for the *Connector* has been simplified in rookie and standard modes.
- The *Kleaner* generates a better overlap and soft-body simulation. *Flexibility* setting improved.
- The UI for the *settings* has been improved a bit.

#### Fixes

- The *Spring* tool now assigns correct default values when applied to multiple layers at once.
- Fixed the *Kleaner / Spring* with 3D Layers and the legacy extendscript expression engine.
- Fixed the layer stopping on the last keyframe when the *Kleaner* is used on a position property.
- Improved the *Kleaner* performance when used in a position.
- Improved the *Kleaner* when the "auto-orient to path" option is turned on for the layer.
- Fixed Controller extraction issues, especially retro-compatibility with older versions of Duik.
- Fixed the *Connector* auto-dectection of min and max values with an IK controller.
- Fixed the *Error at line 2514* (incorrect translation arguments).

## 16.2.2

#### Improvements

- The system used to display the news has been improved for better performance and better UI.

#### Fixes

- Added a workaround for an *After Effects* bug in 17.0.0 (2020): when controller are extracted using master properties, a keyframe is added on the master property (only for this specific version of *After Effects*), which fixes the controllers not rotating correctly.
- Fixed the undo history when using the *Kleaner / Spring*.
- Greatly improved the *Pick Master Property* button performance in the *Connector*.
- Greatly improved the *Get Property Info* tool performance.
- Fixed the head controller created with the *auto-rig* not linked to the head of the correct composition if the composition is duplicated.
- Fixed the options for the *extract controllers* tool not restored correctly (use master properties or expressions).

## 16.2.1

#### Improvements

- The ***Kleaner*** now has soft body and overlap options, for spatial properties, in simulation mode.
- The I/O tab has been removed. You can now import and export animations from the Tools tab. For other software (Storyboarder, Krita, TVPaint), a new free script will be available shortly on rainboxlab.org.
- The UI has been improved a bit (especially the popups).
- When creating a [*Controller*] as a null layer, it better detects if it should be 3D, and is placed just on top of the topmost layer.
- Updated the French and Spanish translations.

#### Fixes

- Fixed the *Kleaner / Spring* for non-spatial multi-dimensionnal properties (like scale).
- Fixed the *Kleaner / Spring* not working in simulation mode if the property doesn't have at least two keyframes.
- Fixed the *Auto-Rig* not working when the spine consists only of a neck and a head.

## 16.2.0

#### New

- New ***Kleaner*** which does anticipations, follow-through and smart interpolations through expressions. This new tool replaces the *Spring* as it has the same features and many more. It also has a better performance.
- The ***Motion Trail*** has been completely re-built, and now has a *taper* option and is also able to take the 3D space and layer scale into account to automatically adjust the width of the stroke.
- The ***Extract Controllers*** is now able to extract only new controllers in case there have been changes made to the rig. [Alt + Click] now "un-extracts" the controllers from the selected precomposition.
- A new ***God Mode*** for the interface, which is very tiny!

#### Improvements

- The interface has been improved and a bit re-organised for a faster access to most common tools.
- The performance of the *Search and Replace* tool has been greatly improved for expressions.
- The performance of the *Structures* creation and of the *Auto-rig* have been improved.
- The use of *Master Properties* to *extract controllers* has been improved for After Effects CC2020 and more recent.
- The *Wonder Unit Storyboarder import* now also imports images from the *Shot Generator*.
- The contextual help has been updated.

#### Fixes

- Fixed the *Storyboarder import* with the latest versions of *Wonder Unit Storyboarder*.
- Fixed the head controller of the *Auto-rig* to make it work correctly when adding a zero.

## 16.1.3

#### Improvements

- You can now use custom controllers with the Auto-rig

#### Fixes

- Fixed some bugs introduced in 16.1.2 (Slider controllers, effectors, and some constraints).
- Fixed manual IK Rigging.

## 16.1.2

#### Improvements

- Some expressions have been modernized, and the underlying system for generating expressions in Duik have been improved. This is going to improve performance in future versions. This work comes with a nice way to share an expression library for animators and developpers.

#### Fixes

- The tool to separate dimensions of properties now removes the keyframes from the original property.
- The tool to separate dimension now correctly separates the dimensions of the position property too, using the *After Effects* native method.
- The connector now works correctly with "custom" properties like the histogram or the mesh warp effect.
- Layer selectors (like the ones in the options of the Walk Cycle now work correctly when selected layers are not selected from top to bottom.
- Bézier IK (like the ones used in spines) no longer moves the layers on creation.
- Bézier IK now works on custom Structures.
- Fixed some tools not working in non-English Duik: Slider Controllers, Parent Constraint, Effector
- When extracting controllers or rigging limbs with footroll, the IK Data is now correctly linked and can be correctly detected by the new Connector

## 16.1.1

#### Fixes

- The connector no longer breaks project expressions when renaming comps in specific cases.
- The header of the controllers panel is no longer hidden in *rookie* and *standard* modes.

## 16.1.0

#### New (UX/UI)

- Duik is now available split in several optional pannels. This means each tab of Duik can be now in its own panel and docked separately into the user interface of After Effects.
- Individual panels can be opened by [Alt] + [Click] on the tab buttons.
- Included with this individual panels: Duik Cmd, a tiny UI with a simple command line interface for Duik.
- Duik now uses a welcome screen at startup, which greatly improves launch time.
- In order to fix any problem with Duik, like its settings file getting corrupted sometimes on Mac, there's now a way to re-initialize everything.
- Added some buttons with useful links:  
    - At the bottom of the panel: *Bug Report* and *Feature Request*
    - In the help window: *Forum* and *Live Chat*

#### New (Links & Constraints)

- A tool to ***Separate Dimensions*** of any property, including colors which can be animated both as RGB or HSL.
- The ***Auto-Parent*** tool helps you parent layers very quickly.
- The additional panel for the ***Bone*** now includes a button to select and show or hide all the bones in the composition.
- The ***Connector*** now works with a spatial effector, a texture effector or the new ***Expose Transform*** tool too.
- The ***Expose Transform*** tool is very useful with the *Connector* or to build your own expressions and automate a lot of stuff.
- The IK effect on controllers now exposes the distance between the end and the root of the limb, which may be very useful with the connector or in your own expressions.

#### New (Automations)

- The new ***Effector Map*** tool is able to connect any property to a texture effector.

#### New (Controllers)

- A *tag controller* tool to set any layer so Duik can recognise it as a controller (very useful for the *extract controllers* tool for example).
- Hold the [Alt] button when creating controllers to create only one controller centered on the average positions of the selected layers.
- Hold the [Ctrl] button to automatically parent the selected layers to the newly created controller(s).

#### New (Other rigging tools)

- A tool to ***Align Layers*** in the rigging tools panel.
- With the ***Edit mode***, you can (un/re)parent all the children of a layer.
- You can ***Remove expressions*** while keeping the post-expression value.
- It is easy to ***Copy & Paste Expressions*** without changing the current value of several properties at once with the copy and paste expressions buttons.
- Some other advanced rigging tools have been added, useful for those who create their own expressions or scripts (expert mode only):  
    - You can get some ***Property Info*** about the selected property, like its index, its matchName, the expression link to it, etc.
    - A ***Scriptify expression*** tool makes it quick to include an expression as a string in a .jsx script.

#### New (Other)

- Reimplemented and improved the _TVPaint_ import tool from Duik 15. Duik now also imports JSON exported from TVPaint 11+, in a simpler and stabler way than the script provided by TVPaint (and with the ability to choose which layers to import).
- Added **German translation**.
- The interpolation adjustment tools in the ***Keyframes*** has been greatly improved, with sliders for velocity and buttons with useful predefined values.

#### Improvements

- The _Connector_ can now be used in a single click (creates a controller layer automatically).
- The _Connector_ User Interface for the additionnal panel has been improved a bit to be clearer and easier to use.
- When used on opacities, the _Connector_ automatically makes the layer visible.
- When _Structures_ are created with something selected in the composition (Bezier paths, puppet pins, or layers), Duik will try to create these Structures on the selection and name them after the selected elements.
- If you hold the [Ctrl] key and there was a selection (path, pins or layers) in the composition when creating _Structures_, Duik will automatically link (parent or expression) the selection to the _Structures_.
- The head controller with the _Autorig_ now controls the head position too.
- The preferences (and language files) of Duik are now saved by default in a "Duik" subfolder of your "Documents" folder, instead of directly in the "Documents" folder. You can still change the location of the preferences in the settings panel of Duik.
- The _Structures_ colors for predefined limbs have been improved to better show the hierarchy.
- The User Interface has been tweaked to fix some details and improve the overall User Experience.
- All buttons for showing or hiding stuff (Structures, bones, controllers...) can now invert the visibility with holding the [Alt] button, instead of showing or hiding them all.
- The _Structures_ layer names are now translated to the language set in the settings (if the translation file is up-to-date).
- The _Path Constraint_ effect now has a "*Path Offset*" option.
- The *Add Bones* button now creates a single bone if nothing is selected, which you can then use any way you want.
- The performance of the *Search and Replace* tool has been slightly improved for expressions. There's still some ongoing work to dramatically improve it's performance.
- *Controllers* as null layers are 3D layers when the selected layer is 3D.
- The *Path Constraint* can now be created in a single click.

#### Fixes

- The version of Duik is now checked correctly (even for alpha and beta tests), and there is no warning if the version installed is the same than the available one.
- The *extract controllers* tool now takes the precomposition start time into account in the links, thus you can safely move the precomposed character in time.
- The *Search and replace* now correctly ignores locked layers.
- Adding *Bones* on shapes on a layer which already has some effects now works correctly.
- The *Parent Constraint* now works correctly when the composition start time is not 0.
- *Auto-rig* freezing when there's only one layer selected.
- Fixed some bugs when creating *IK* on standard layers instead of _Structures_.
- The show/hide button for *Structures* now works correctly.
- Fixed the scale expression for the *2D Camera*.
- The *Wheel* and *Parent Constraint* now correctly generate motion blur (which can be adjusted to fix performance issues).
- Fixed animations not importing  when interpolation values are invalid.
- Fixed 3D Controllers extraction.
- The *List* does not anymore add an offset on the value when added on a property without keyframes.
- The *Move Away* does not generate an expression error anymore when the layer is at the same location as its parent.
- Some checkboxes not working in the UI are fixed.
- Duik is now launched correctly on first launch if the *File and Network Preference* of After Effects was unchecked.
- The *Walk Cycle* is now applied correctly when controllers are null layers.
- Controllers are extracted without generating expression errors when using master properties.
- The *Paint Rig* now works correctly with the cloner and eraser tool too.
- Fixed the expressions errors in the *2D Camera* on non-English After Effects.
- Fixed the *IK/FK switch* not working in some cases.

## 16.0.12

#### Fixes

- Fixed the *Parent constraint* expressions not working with the new Javascript enginge.
- Fixed the *Check for updates* failing at first start, always stating that a new version is available when it's not.
- Fixed the *Structures* creation failing in huge comps.
- Fixed the expression errors using the new JavaScript engine with the *Framing guides*.
- Fixed the rotation in the *Camera Rig*.

## 16.0.11

#### Fixes

- Fixed the *Connector* when an angle is used as a controller property and in some cases there is a jump of 360 degrees, and *IK* rotation values.
- Fixed some *Structures* bugs with the new JavaScript expression engine.
- Fixed *Scale Z-Link*.
- Fixed the *Randomize* tool when used on keyframe times in absolute mode.
- Fixed the *walk cycle* with the new JavaScript expression engine.

## 16.0.10

#### Improvements

- [Alt + Click] on the *Zero* button resets the position, rotation and scale of the layer.
- The User Interface has been tweaked to make it always better.

#### Fixes

- When picking properties with Duik tools, if there is a disabled expression, it stays disabled instead of being enabled by the tool.
- UI: The buttons can now be clicked anywhere and not only on the text or the icon (except on CS6).
- Fixed the issue when sometimes two *Bones* were created for the same puppet pin.
- Fixed the expressions for the *walk cycle* with the new expression engine. If errors are still generated, you can jut ignore them, they'll disappear as soon as you use the controller.
- Slider, 2D-slider and angle *controllers* are no longer broken when there are layers selected in the composition before creating them.

## 16.0.9

#### Fixes

- The *Spring* expressions have been fixed and improved for After Effects 16.0
- *Copy/Paste animation*, which was broken in 16.0.8, is fixed
- The *Extract controllers* can now extract the controllers from two rigs in the same composition.
- *Bones* on puppet pins are named after the correponding pin.
- Fixed *Bones* creation on pins with Ae CC2018 and older.
- The *Storyboarder* importer now imports empty boards too.

## 16.0.8

#### Fixes

- The *Walk Cycle* now works with the new expression engine in After Effects 16.0

## 16.0.7

#### Fixes

- The rigging *tools* panel is displaying again.
- Adding *Bones* on scaled layers no longer moves them to another location.

## 16.0.6

#### New

- The *Bones* can control the new puppet pins in After Effects 16.0: they handle the rotation and scale of the pins too.

#### Improvements

- Expressions used by Duik have been improved for the new expression engine in After Effects 16.0

#### Fixes

- *Random* tool now correctly sets values on animated properties.
- *Parent Constraint* now works when the dimensions of the position are separated.
- *Storyboarder* import fixed (again).
- *Extract Controllers* now works correctly when dimensions are separated on the controllers.
- *Extract Controllers* now longer has an expression error on foot roll effects.
- The anchor size of the *Controllers* can now be set to 0% without generating an expression error.
- Fixed the *Time remap* tool.
- The parent used in a *Parent contraint* can now be scaled to 0% without generating an expression error.
- Fixed a bunch of minor bugs, stability improved.
- Overall stability improved (especially regarding composition names and links accross compositions).

## 16.0.5

#### New

- Chinese translation, thanks to eZioPan.
- Re-implemented the _Lock Property_ tool from Duik 15 (in the constraints panel, _Standard_ and _Expert_ mode only).

#### Improvements

- The *Effector* layer is now created as a guide layer.

#### Fixes

- *2D Camera* no longer crashes if there's no active composition.
- *Extract controllers* no longer fails when launched from the additionnal panel of the tool.
- *Extract controllers* and other tools are more robust and should throw less errors in unusual cases.
- *IK/FK Switch* now works with controllers extracted from a precomposition.
- *Walk Cycle* now works with controllers extracted from a precomposition.
- Some labels could not be translated in the User Interface and stayed in English. This is now fixed and everything should be translated in upcoming versions.
- Fixed some stability issues, and made some small performance improvements.
- Fixed the tools not working if the composition is selected from the project panel and the composition in the viewer is not the same.

## 16.0.4

#### Fixes

- Duik now really imports correctly Wonderunit Storyboarder files made with the latest version.

## 16.0.3

#### Fixes

- Duik now imports correctly Wonderunit Storyboarder files made with the latest version.

## 16.0.2

#### Improvements

- Duik now checks for updates and reads the news only once a day.

#### Fixes

- The *Framing guides* are now created as guide layers.
- There is no longer any error when the serveur for news and updates is unavailable.

## 16.0.1

#### Fixes

- Fixed the *Connector* used with a master property which has one dimension only.

## 16.0.0

#### Improvements

- The *Select Keyframes* now works like the other tools, in a single click with an additionnal panel for the settings
- *Parent Accross Comps* now locks and hides the locators
- Changed controllers' label
- Changed structures' label
- Structures are selected after duplication
- The scale of Structures is now locked
- The *Connector* now detects the same pre-existing effects and uses them instead of creating new ones
- *Parent Accross Comps* now creates a single locator instead of one locator per child.
- Completed French translation
- Completed Documentation (but without screenshots, and still needs more details)

#### Fixes

- Fixed performance issue with the Copy/paste anim (when reversed keyframes is checked).
- Fixed *Select Keyframes* tool with properties with separated dimensions.
- Fixed translations loading
- Fixed the Arm *Autorig* without shoulder
- Fixed *Autorig* on previously duplicated Strucutures
- Fixed the *list* not getting the initial value of the property
- Fixed the *Autorig* not detecting the side of the legs
- Fixed *Add Bones* freezing when selecting non spatial properties or groups
- Fixed *Position Constraint* which now works correctly even with parenting on the constrained layer.
- Fixed the automatic position of shoulders with the *Autorig*
- Fixed the neck and shoulder rotating away from their original orientation with the *Autorig*
- Fixed the *Autorig* run on duplicated structures
- Removed debug alert when using the *Wiggle* on single dimensionnal properties

## 16.0.0-RC2

#### Improvements

- Huge performance improvement at startup, with help from Lars Jandel (again).
- The *Auto-rig* is smarter: it can rig a mix between predefined limbs and custom structures
- UI tweaks

#### Fixes

- Fixed Bezier IK and Spine Auto-rig strange behavior

## 16.0.0-RC1

#### Improvements

- *Extract Controllers* now able to extract all controllers, including the ones which are parented to any other layer, thanks to the new *Parent Accross Comps* tool.
- You now have the option to use null layers for controllers instead of shape layers (*Standard* and *Expert* modes only)
- Duik can now be launched without the "File and network access" preference (but with limited features and without icons).
- All dialogs at first start have been removed to be included in the main panel of Duik itself.
- Duik now checks for updates at startup (like previous versions)
- The help panel now includes "*news*" and "*about*" tabs to know more about Duik and Rainbox.
- The user guide and contextual help have been updated with a lot of new documentation.
- The *Calculator* has been removed.
- Lots of UI tweaks and improvements

#### Fixes

- *Animation Panel*: the ease slider now automatically change linear keyframes to bezier with velocity set to 0.
- Clicking the *Autorig & IK* button no longer crashes Duik when there are no active composition.
- Duik should now work properly in Mac OS with network sessions (?). Please confirm if it's your case ;)
- Fixed startup in Mac OS.
- Fixed file extensions with exports in Mac OS
- Exporting to Audition with transcoding now works in Mac OS

## 16.0.0-Beta-1

#### New

- ***Duplicate Structures*** easily with a single button.
- ***Export and Import Animations*** re-implemented from Duik 15.

#### Improvements

- *Wonder Unit Storyboarder* now handles PSD boards.
- *Looper* now has a parameter to set the number of keyframes to loop.
- Several *FK Over IK* improvements (A checkbox to disable Automatic Follow Through, animate the *goal* in the individual controls...)
- Legs rigged with the *Autorig* and a foot roll can now be switched to FK. This is a huge improvement for walk cycle animations: as soon as the foot leaves the ground, you can swith to FK and animate very simply the rotations of the leg.
- *Position Constraint*: default weight to 0% to prevent layers from "jumping" away when setting the constraint.
- *Import Animation*: option to offset the values from the current ones.
- *Import Animation*: option to import all property values, or only the properties with keyframes.
- *Import Animation*: filters on property types: import only the position, or rotation, or shapes, or everything...
- *Import Animation*: option to replace existing animation or just add the new keyframes
- *Copy/Paste Animation*: option to offset the values from the current ones.
- *Copy/Paste Animation*: option to replace existing animation or just add the new keyframes
- *Copy/Paste Animation*: option to reverse keyframes

#### Fixes

- Fixed the keyboard shortcuts for the *Bones* button in the options panel.
- *Bones*: tangents width for the bones created on shapes (CC2018) is now adjusted with the size parameter of the bone.
- *Bones* have better names when the name is too long.
- Fixed locator names in the *Parent Accross Comps* tool
- Fixed the character encoding issue in the contextual help on Macintosh
- Several *Walk Cycle* fixes

## 16.0.0-Alpha-10

#### New

- ***Contextual Help***: Shift+Click on any tool to get some help.
- ***Animation blender*** is a new tool to animate using markers to trigger animations. Setup a composition with some animations and the *Animation Blender*, and then you just have to add some markers on the controller to trigger the animations, with an optional nice blending between each animation and the ability to loop them.
- ***Framing Guides*** in the *Camera* panel: creates handy guides in the composition to help your framing and image composition (safe frames, thirds, fibonnacci, isometric perspective...)
- ***Parent accross comps*** is a simple way to parent a layer to another one in a parent composition, or in a precomposition, using locators and expressions.
- ***2D Camera***: new controls for predefined behaviours. Easily simulate a shoulder mount, a camera hold by hand, or on a tripod, with shake controls.
- Re-implemented the translation framework, and added French translation. It is now possible to add new translations to Duik. More details about this will be available on the wiki soon.
- Re-implemented ***Export to Audition*** from Duik 15. Export to Audition now transfers audio levels keyframes too!

#### Improvements

- *Wiggle*: you can now control the complexity of the wiggle (octaves and mutliplier) and manually set a *Random Seed* to keep the same wiggle accross layers.
- UX/UI tweaks and improvements, stability improved.

#### Fixes

- *Effector* set to infinite line is no longer reversed.
- Changing colors of controllers with Duik no longer freezes Duik.
- Locking *In* and *Out* ease in the animation panel now automatically adjust values according to the latest modification (on *In* or *Out* ease).
- Fixed the bad issue where sometimes the After Effects dialog windows would freeze Duik (and all the other scripts), and then display the _"Can not run a script while a modal dialog is waiting for response"_ error when trying to launch any script again (based on an idea by _Lars Jandel.

## 16.0.0-Alpha-9

#### New

- ***Walk Cycle***: the first procedural animation is available.
- The keyframe types button in the ***Animation*** panel can now be used to create keyframes on all animated properties.
- ***Extract controllers*** automatically from a precomp to your main composition, and animate outside of the precomposed character. Scale, flip, flop the character as you need. With After Effects > 15.1, extracted controllers can use Master Properties to be able to animate several instances of the same rig, in the same project.
- The ***Auto-rig*** is now smart enough to detect what you need if you're applying it to something else than predefined *Structures*. The *IK* and *FK* buttons have been removed from the *Rookie* UI mode, and moved into the *Auto-rig* options in the *Standard* and *Expert* modes.
- A new automation, the ***Looper*** allows to add both a loopIn and a loopOut on several properties at once, and control them with an animatable effect. The loops can be of the standard three types: "Cycle", "Offset, "Ping Pong", and "Continue".
- The ***Effector*** now has two modes: *Circle* or *Infinite line*.
- You can now import your traditionnal animations from ***Krita***, just export them as CSV!

#### Improvements

- Huge performance improvement. A lot of work have been made to make Duik run faster (especially the Structure creation and Autorig).
- *Structures*, *Bones*, and *Controllers* are now created with their quality set to "Draft" to improve performance in After Effects.
- *FK Overlap* now has individual controls for layers.
- *FK Overlap* option to (not)inherit the rotation of the parent layer.
- *FK Overlap* over IK. When an IK is created, the checkbox to deactivate IK activates individual FK controls as well as a Follow-Through & Overlap control.
- Added a checkbox to show/hide handles for the curvation of *Bezier IK*. They are now hidden by default.
- Added an individual control for the toes rotation in the *Foot roll*
- *Add Bones* is smarter: it will search for properties (with a priority for puppet pins) if there are no property selected.
- *Add Bones* adds nice effects when used on shapes, to allow the deletion of unneeded control layers afterwards.
- You can use an *Orientation Constraint* to create what was called the *IK Goal* in Duik 15, with much more possibilities.
- You can now link dimensions when using the *Random* tool on values.
- The data displayed in the *IK* effects is improved. The IK length is now computed in FK too, to be able to use it with the connector more reliably than using the *Structure* rotation.
- The *Connector* now automatically populates the "min" and "max" values based on the actual animation of the master property.
- A lot UI adjustments and improvements

#### Fixes

- *FK Overlap* now working correctly with a parent.
- *Bezier IK* curve controller now created at a correct size, depending on the settings of the controllers.
- *Walk Cycle* now works better when there's no layer selected.
- The *Auto-Rig* for legs with foot roll now works when the structures have been rotated before running the *Auto-Rig*.
- The *Search and Replace* tool has been fixed.

## 16.0.0-Alpha-8

#### New

- *Rookie Mode*: An easy-to-use interface for beginners. Note: Duik will automatically switch to this mode on first start, go to the settings to set it again to standard or expert mode.
- Animation: *IK/FK* Snap and switch.

#### Improvements

- *IK* (2 and 3 layers): rotation values are improved to prevent a "jump" in some cases. The rotation value on the upper part of the limb will now have a 360° jump in the opposite direction than its orientation when the IK is created.
- *IK* (2 and 3 layers): the "reverse" option in the effec of the controller have been moved unearthed to be more accessible.
- *Structures*: Use Alt+Click to assign a random color on creation.
- *Bones*: Use Alt+Click to assign a random color on creation.
- *Bones*: Use Ctrl+Click to create bones for vertices only, and not tangents (Quicker in case the shape does not use tangents).
- UI Tweaks. Lots of invisible tweaks.
- Some performance improvements (especially with some expressions in the Structures).

#### Fixes

- *List*: no more error when applying on a spatial property (but spatial tangents will be lost)
- *FK Overlap* now works better even when the root has a parent.

## 16.0.0-Alpha-7

#### New

- *FK Overlap* tool, very useful for tails and ropes (or even arms)!

## 16.0.0-Alpha-6

#### New

- Re-implemented tools from Duik15: *Camera Rig*, *Scale Z-Link*, *Import TVPaint Camera*
- The *Auto-rig* now rigs tails.
- The *Auto-rig* now rigs digitigrades (cats and dogs...).
- The *Auto-rig* now rigs ungulates (cattle, sheeps...).

#### Improvements

- *Controllers* scale locked on creation
- *Controllers* new shapes available
- *Controllers*: _Slider_, _2D Slider_ and _Angle_ controllers now split in two layers: the actual control and a background. No more need to double click to animate them.
- *Randomize* UI updated to new UI style
- *Expert Mode* UI improvements
- *Structures* rotation and scale are now reset to 0 and 100% before applying IK/autorig

#### Fixes

- *Bezier IK* not selecting the controller at the end of the creation.
- *Bezier IK* handles now working even when guides are hidden
- *Orientation Constraint* now working even if the constrained layer has a parent.

## 16.0.0-Alpha-5

#### New

- WonderUnit Storyboarder file import
- Implemented 2D Camera (renamed the 2D Multiplane from Duik 15)
- 2D Camera: Ability to add a layer (just duplicate any existing layer)
- Implemented the Autorig (legs, arms, spine but not tails or custom structures/layers yet)

#### Improvements

- User Interface has been polished | The *Expert mode* might still have some issues which will be fixed later
- Layers created by Duik are now tagged with a marker. The marker can be renamed by the user, but cannot be removed: some data is stored internally to help Duik identify the layers and compute stuff.


#### Fixes

- *Bezier IK* the "curve" controller is now a position controller.
- Removed the *Attachment Constraint* which did not work as expected. Use the other constraints instead.

## 16.0.0-Alpha-4

- Prepared Wonder Unit Storyboarder file import.

## 16.0.0-Alpha-3

#### New

- Animation *Kleaner* to clean the keyframes. Includes the *Smart interpolations* and *Spatial Interpolations* tools from previous Alpha versions.
- *Connector* able to connect to "fake" layer sequences using layer opacities (very powerful tool)

#### Improvements

- UX: (clicking on the tab buttons sets the default panel - closes the current tool - for the tab)
- *Connector* UX/UI small improvements
- UI: Improved animation panel (separated keyframe tools and animation tools)
- Better naming conventions for controllers, bones, structures...

#### Fixes

- *Effector* now works when re-using an existing controller layer.
- *Randomize* for properties and keyframes
- *Connector* when connecting a parent with an expression.
- *Connector* when connecting shapes and other unusual properties.
- *IK* when the root has a parent
- *Bones* on shapes with CC2018

## 16.0.0-Alpha-2

#### New

- *Keyframe selection* tool (in the animation tab) to easily batch select keyframes by type or by layers.
- Re-implemented tools from Duik 15: *Rename*, *Search and replace*, *Measure*.

#### Improvements

- Simplification of the usage of the *slider*, *2D slider* and *angle* controllers: the effect on the layer has been simplified and some explanations added; a keyframe is automatically added on the right property.
- Several UI adjustments

## 16.0.0-Alpha-1

Initial Release


![META](authors:Nicolas "Duduf" Dufresne;license:GNU-FDL;copyright:2022-2023;updated:2023-06-02)
