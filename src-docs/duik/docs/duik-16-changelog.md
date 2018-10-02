# Changelog

This is the list of what has changed since the first Alpha version of Duik Bassel (16)

## 16.1.0 (in development)

#### New

- A tool to ***Align Layers*** in the rigging tools panel.
- A tool to ***Separate Dimensions*** of any property, including colors which can be animated both as RGB or HSL.

#### Improvements

- The _Connector_ can now be used in a single click (creates a controller layer automatically).
- The _Connector_ User Interface for the additionnal panel has been improved a bit to be clearer.
- When _Structures_ are created with something selected in the composition (Bezier paths, puppet pins, or layers), Duik will try to create these Structures on the selection and name them after the selected elements.
- If there was a selection (path, pins or layers) in the composition when creating _Structures_, Duik will automatically link the selection to the _Structures_.
- The head controller with the _Autorig_ now controls the head position too.

## 16.0.6

#### Fixes

- [*Random*](random.md) tool now correctly sets values on animated properties.
- [*Parent Constraint*](parent-constraint.md) now works when the dimensions of the position are separated.
- [*Storyboarder*](import.md) import fixed (again).
- Fixed a bunch of minor bugs, stability improved.

## 16.0.5

#### New

- Chinese translation, thanks to eZioPan.
- Re-implemented the [_Lock Property_](lock-property.md) tool from Duik 15 (in the constraints panel, _Standard_ and _Expert_ mode only).

#### Improvements

- The [*Effector*](effector.md) layer is now created as a guide layer.

#### Fixes

- [*2D Camera*](camera-2d.md) no longer crashes if there's no active composition.
- [*Extract controllers*](controller-tools.md#extract-controllers) no longer fails when launched from the additionnal panel of the tool.
- [*Extract controllers*](controller-tools.md#extract-controllers) and other tools are more robust and should throw less errors in unusual cases.
- [*IK/FK Switch*](ik-fk-switch.md) now works with controllers extracted from a precomposition.
- [*Walk Cycle*](walk-cycle.md) now works with controllers extracted from a precomposition.
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

- Huge performance improvement at startup, with help from [Lars Jandel](http://www.larsjandel.de/) (again).
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
- The [user guide](https://github.com/Rainbox-dev/DuAEF_Duik/wiki/Duik-User-Guide) and contextual help have been updated with a lot of new documentation.
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
- ***Animation blender*** is a new tool to animate using markers to trigger animations. Setup a composition with some animations and the *Animation Blender*, and then you just have to add some markers on the controller to trigger the animations, with an optionnal nice blending between each animation and the ability to loop them.
- ***Framing Guides*** in the *Camera* panel: creates handy guides in the composition to help your framing and image composition (safe frames, thirds, fibonnacci, isometric perspective...)
- ***Parent accross comps*** is a simple way to parent a layer to another one in a parent composition, or in a precomposition, using locators and expressions.
- ***2D Camera***: new controls for predefined behaviours. Easily simulate a shoulder mount, a camera hold by hand, or on a tripod, with shake controls.
- Re-implemented the translation framework, and added French translation. It is now possible to add new translations to Duik. More details about this will be available on the [wiki](https://github.com/Rainbox-dev/DuAEF_Duik/wiki/Duik) soon.
- Re-implemented ***Export to Audition*** from Duik 15. Export to Audition now transfers audio levels keyframes too!

#### Improvements

- *Wiggle*: you can now control the complexity of the wiggle (octaves and mutliplier) and manually set a *Random Seed* to keep the same wiggle accross layers.
- UX/UI tweaks and improvements, stability improved.

#### Fixes

- *Effector* set to infinite line is no longer reversed.
- Changing colors of controllers with Duik no longer freezes Duik.
- Locking *In* and *Out* ease in the animation panel now automatically adjust values according to the latest modification (on *In* or *Out* ease).
- Fixed the bad issue where sometimes the After Effects dialog windows would freeze Duik (and all the other scripts), and then display the _"Can not run a script while a modal dialog is waiting for response"_ error when trying to launch any script again (based on an idea by _[Lars Jandel](http://www.larsjandel.de)_).

## 16.0.0-Alpha-9

#### New

- ***Walk Cycle***: the first procedural animation is available.
- The keyframe types button in the ***Animation*** panel can now be used to create keyframes on all animated properties.
- ***Extract controllers*** automatically from a precomp to your main composition, and animate outside of the precomposed character. Scale, flip, flop the character as you need. With After Effects > 15.1, extracted controllers can use Master Properties to be able to animate several instances of the same rig, in the same project.
- The ***Auto-rig*** is now smart enough to detect what you need if you're applying it to something else than predefined *Structures*. The *IK* and *FK* buttons have been removed from the *Rookie* UI mode, and moved into the *Auto-rig* options in the *Standard* and *Expert* modes.
- A new automation, the ***Looper*** allows to add both a loopIn and a loopOut on several properties at once, and control them with an animatable effect. The loops can be of the standard three types: "Cycle", "Offset, "Ping Pong", and "Continue".
- The ***Effector*** now has two modes: *Circle* or *Infinite line*.
- You can now import your traditionnal animations from ***[Krita](http://krita.org)***, just export them as CSV!

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

- [WonderUnit Storyboarder](https://wonderunit.com/storyboarder/) file import
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
