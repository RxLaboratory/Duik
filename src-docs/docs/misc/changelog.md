# Duik Ángela (17) Changelog

This is the list of what has changed since the previous major version of Duik ([Duik Bassel, 16.2](duik-16-changelog.md)).

► [The detailed list of changes of minor versions of Duik is available here](https://github.com/RxLaboratory/Duik/releases).

## 17.2

- Added a new [*Performance Panel*](../guide/performance.md).

## 17.1

This new version of Duik Ángela introduces important features to help color animation, which may be extended later into more features or tools in another dedicated tool set.

- Added new controls and interpolation options for the Swink when it is used on colors.
- Added color options for the Interpolator. You can now select a better colorspace to use during the interpolation, to have better (brightest) colors in between keyframes.
- Added the ability to add lists to color properties

Performance improvements and options were also added.

- Added new "Light Bones" ; they can be activated in the bone settings panel or OCO Create Metarig options.
- Added optional raster (PNG) controllers ; this improves a lot the performance compared to shape layers. The option can be set in the settings panel of the controllers.
- The bone settings panel can now edit the bone color and opacity even if they're already baked.
- The Bake Expression tool has been slightly improved to generate keyframe interpolations closer to the original one in specific cases. This is part of an ongoing work on all keyframe and timeline stuff. Stay in touch!

And this version also has introduces many other improvements to make your life easier.

- Added an Extrapolation weight, a % you can animate to adjust the extrapolation (e.g. start and stop a loopout/in cycle) on the Looper/Interpolator.
- Added an option to not lock the scale of null controllers by default (so you can use them to quickly scale several layers at once).
- Added an option to automatically create a root controller in the autorig.
- Added opacity controls to the pins.
- Refactored the pin settings panel, which is now similar to other settings panels.
- Allow negative anticipation in the Kleaner (to simulate some kind of rusty thing, or hesitation when starting a movement)
- Alt Click the List button to automatically add a keyframe to the second slot (and quickly reveal it with 'U' in the timeline)
- OCO Update: OCO now uses an "OCO.config" files to share settings and the OCO Library between all applications using OCO, a bit like OpenColorIO config files. OCO is still under heavy development, and many new features will be added in the next months, both in After Effects, Blender and Krita.
- The 'Bug report' button now redirects to a new and better form on rxlaboratory.org, pre-filled with details about your system.

Finally, new OCO metarigs were included:

- Horse
- Bear
- Lemur
- Tyrannosaurus
- Scorpion
- Whale
- Monkey

► [The list of all bug fixes is available here](https://github.com/RxLaboratory/Duik/releases).

## 17.0

### New Features

#### (Auto-)Rigging

!!! note
    There have been some changes in the way tools are named in Duik Ángela, compared to Duik Bassel.  
    • *Structures* are now named ***Bones*** (single item) or ***Armatures*** (complete limbs).  
    • *Bones* are now named ***Pins***.  
    This changelog and all the documentation now use these new naming.

- New ***Auto-rigs***:
    - ***Wings*** rigging is now a thing.
    - ***Hair*** rigging is now a thing.
    - **_Arthropod leg_** rigging is now a thing.
    - **_Fish (fins and spine)_** rigging is now a thing.
- **New _Bones_**: previously known as Structures, Bones have been redesigned, and new limbs for all kind of animals are available (fish and their fins, snakes, wings...). Note: the *bones* from the previous versions of Duik are now named *Pins*.
    - *Bones* now have optional *envelops* and *noodles*. Bone envelops are very useful to design limbs and make sure the joints work well, and combined with the bone noodles they're a quick way to create and animate customizable limbs in a single click and a few settings.
- New ***controller*** shapes:
    - Vertebrae
    - Rib cage / Torso
- The ***Link art*** button in the bone panel will (try to) automatically parent all artwork layers to their corresponding bones.

#### Constraints

- The ***Connector*** has many new abilities:
    - it can now use the ***audio*** from a layer to control properties.
    - it has a new *Layer list* mode to quicklly connect a bunch of layers to a dropdown menu effect.
    - its UI has been made simpler.
- New type of IK/FK: ***Bézier FK***, which is used by the *Auto-rig* for spine and neck rigging.
- The ***Move anchor point*** tool can move the anchor points of the selected layers to their bounds or center. It works with pixel layers and shape layers, and can use the masks too. It can also take a custom margin into account. This tool is located both the the *links & constraints* panel and the *animation* panel.
- **_Key Morph_**: also known as *Shape Keys*, *Pose Morph*, *Blend Shapes* or *Morphers* in other software, they're now available in After Effects with Duik, and can be easily connected to nice controllers using the *Connector*.
    - A property can be connected to a selection of key morphs using the *Connector*. Note that the master property must use keyframes (it can not be controlled by expressions).
- UI Tweaks:
    - **_Kinematics Constraints_** button: quickly add IK and FK constraints to the layers.
    - **_Parent Constraints_** are assembled under the same button group.
    - **_Tranformation Constraints_** are assembled under the same button group.
- **_2+1 layer IK_** is a new way to use IK on a 3-layer chain, which is useful for arthropods and the new way of rigging ungulates.

#### Automation and expressions

- The ***Kleaner*** is back and it's been completely redesigned.
    - It now uses general intuitive parameters to control the whole animation (like the size, weight, friction, etc.), but you still can fine-tune it with more detailed and advanced parameters.
    - It is now able to correctly handle easing, anticipation and follow through on spatial properties without separating the dimensions. In this case, just use roving keyframes when the layer is moving, and keep linear keyframes when it stops. The Kleaner will precisely follow the trajectory while handling the speed.
    - Ease is automatically computed for the motion to be as smooth as possible. If you want to stop at a specific keyframe, switch it to *maintain*.
    - The overlap (and soft body simulation) has been improved a lot: the animation is better and smoother, and performance is a bit better.
    - It now has (soft) limits too!
- The ***Walk Cycle*** is now also a ***Run Cycle***. Its controls and performance have been greatly improved.
- The ***Swink*** tool replaces the previous *Swing* and *Blink* tools. It makes a property regularly switch between two values, with advanced options to manage the frequency and interpolation between the two.
    - The frequency of the *Swink* can be animated.
- The ***Random*** automation can be used when a property needs to be completely randomized; e.g. when a *Wiggle* automation is too smooth.
- The ***Bake expressions*** tool is able to bake selected expressions or the whole project expressions to keyframes. It comes with two algorithms: a precise algorithm which adds a keyframe per frame (or less, according to the precision factor you can set), and a *smart algorithm* which automatically adds as less keyframes as possible, and the resulting keyframes are easy to edit.
- The ***Bake Composition*** tool bakes all expressions in the comp (or on selected layers), and removes all non-renderable layers (guide layers, nulls, etc.). If a renderable layer was parented to a non-renderable one, its transformation properties are baked to keyframes.
- ***Edit Expression*** in the *Automation* and *Tools* panel opens the selected expression in your favorite external editor to edit them more easily, then reloads them in the After Effects properties when you've finished editing them.
- ***Expression tools***: various useful tools to fix and work with expressions (in the automation panel toolbar).

#### Animation

- New **_Non-linear Animation (NLA)_** tool replaces the previous *Animation Blender* tool. It is a great and very easy way to edit animations as you would do with video clips in a Non-linear video editor like *Adobe Premiere*.
- A ***Tweening*** section in the animation panel helps you tween your animation, if you're working with hold keyframes before going to curves for example (using the *Kleaner* or not). Includes three new tools:
    - ***Tween Slider***: adds a new in-between to the current time, according to a ratio between the previous and next pose.
    - ***Split Keyframes***: splits the selected keyframes into couples of keyframes with the same values (freezing the pose for a predefined time).
    - ***Freeze pose***: freezes the previous (or next) pose up to the current time (copies the previous or next keyframe to the current time).
    - ***Sync Keyframes*** moves all selected keyframes to the current time. If multiple keyframes in the same property are selected, they're offset to the current time, keeping the animation.
    - ***Snap Keyframes*** snaps the keyframes to actual frames if they're in between (like it happens when changing the duration of an animation or the framerate of a comp).
- The ***Sequencer*** distributes your layers or keyframes in time.
- New **_Interpolator_** tool (animation panel). The *Interpolator* is a tool to help you.... Interpolate keyframes. It's a bit like the *Kleaner* but on a low-level where you can really choose and tweak how the animation is interpolated, for more advanced users.
    - It includens *extrapolation* methods to loop in or out, with different modes: constant, continue, ping pong, cycle, bounce, follow-through.
    - When an extrapolation is animated, for example when stopping a loop, the property now stays at the right value.
    - It is able to extrapolate motion (loops) in between keyframes if the property is still.
- Quickly save, export, import, apply animations with the new **_Animation library_** (animation panel).


#### Tools

- ***DuCop*** (Duduf Comp Parameters) is now included in Duik (Tools/Composition panel). It enables you to change the composition settings of all selected compositions including their precompositions. It will also adjust the duration and size of any layer which should match the new composition duration and size if it's changed.
- Use ***Crop precompositions*** to... crop precompositions. The tool uses the mask(s) found on the precomposition layer to crop the source composition: just draw a quick mask on the layer then click on the button to crop the composition, without moving any of the layers using the same source composition.
- **The _Layer Manager_** will help (re)naming layers and setting useful tags for rigging and grouping layers.
- The ***Note panel*** can now also save composition-specific or project-specific notes. These notes are savec in the project file.
- The ***Script library*** helps you sort all your scripts. From there, you can easily access, edit, and launch your installed scripts and dockable panels, or any other stand-alone script.
- The ***Script editor*** is a basic script to let you edit and run simple scripts. But even if it's basic, it includes the whole Duik API to easily use Duik's advanced functions in a few simple lines.

#### Miscellaneous

- **New User Interface**: Along with a complete code refactor, *Duik* underwent a complete UI redesign. Performance (loading time) has been improved, *Duik* now fits better in the interface of After Effects, it is more discreet and let you focus on your work.
- **Complete code refactor**: Duik is easier to maintain, code is better organizezd, performance has been improved...
- A progress bar is available at the bottom of the panel to show the current funding status...
- We've finally dropped support of *After Effects CS6*, sorry, it was too much work to keep compatibility for too few users. *CS6* (*v11.0.2*) dates back to October 2012, it's time to update! *Duik* should now work on all versions of After Effects starting with *After Effects CC* (*v12.0*, July 2013).

### Improvements

#### (Auto-)Rigging

- Performance has been improved for almost all of the tools and expressions.
- *Legs*:
    - The *Foot Roll* performance has been improved (a lot) with a simpler rig.
    - *Ungulate leg* rigs have been changed to be closer to the actual anatomy of the animals you eat (cattle, cute lambs, horses...)
- The *Spine Auto-Rig* has been tweaked to better handle some special cases and globally improve controls over the spine and the torso.
- *Tails* and all *FK with overlap* are now stretchy!
- *Show/Hide* *bones* and *controllers*: `[Alt] + [Click]` to show/hide only the unselected layers.
- *IK/FK*:
    - The *3-layer IK* has been removed from *Duik* as it wasn't used, and could easily be replaced by the better 2+1 or 1+2 IK.
    - Added a *Weight* slider to the 2-layer and 3-layer IK to be able to progressively transition between IK and FK (this may be useful with the new *Non-Linear Animation* and *Animation Library*).
    - Removed *Advanced / Full rotation limit* option from the IK effects.
    - *One-layer IK* now have optional limits, with a softness parameter.
    - *Two-layer IK* sides can now be switched progressively, and an *auto-swing* option can automate reversing the joint.
- *Bone* and *controller* sizes are now responsive to the composition size (if the're not baked)

#### Constraints

- The *Connector* can now connect both velocities or speed.
- *Pins* on shapes: added a "Lock tangent" button in the effects of the vertex layers.
- The performance of the *Parent Constraint* has been greatly improved. Note that expressions in the weight properties may not work correctly, you may have to bake them to keyframes (for example using the new *Bake expressions* tool from Duik).
- *Locators* (used by *Parent Across comps*) are now created at the bottom of the layer stack.
- *Path Constraint*: `[Alt] + [Clic]` to move the layer to the first point of the path.
- *Lists* can now be simply duplicated to get more tracks.
- *Property Info* now shows keyframe information.

#### Automation and expressions

- *Wiggle*:
    - The *Wiggle* can now optionally use a different seed for each controlled layer.
    - The frequency of the *Wiggle* can now be animated.
    - The initial random seed is better chosen.
- The *Effector* now also works with *custom shapes*! (in addition to the circle and the line).
- The *Randomizer* now has the ability to generate random values distributed along a *Gaussian bell-shaped* function for a more natural result.
- The *Motion Trail* parameters have been improved, and it is now able to use the taper parameters from After Effects >= 17.1.
- The *Wheel* automation has a new *Straight* option for wheels moving along a non-horizontal straight line, which improves performance for this specific case compared to the *Curved* option.
- The *Looper* now uses the new *Interpolator* tool.
- Renamed *Separate dimensions* to *Split values*.

#### Animation

- *Copy animation*: `[Alt] + [Click]` to cut the keyframes.
- The *IK/FK Switch* tool now works better with controllers which have a combination of 1-layer and 2-layer IK (like an arm and its shoulder).

#### Cameras

- The *2D Multiplane Camera* tool is now better organized, with a single camera controller on top of all levels.
- The *Camera rig* now includes advanced behaviours like the *2D Multiplane Camera* already did.
- Both the *Camera rig* and the *2D Multiplane Camera* now automatically handle motion interpolation for perfect and smooth camera movements.

#### Tools

- You can now *Search and Replace* in effect names too.

#### Miscellaneous

- *Rename*: when renaming puppet pins, just select a single layer to rename all puppet pins found on it, no need to select the pins individually anymore.
- *Sanity tests*:
    - The *Sanity tests* have been improved to work more efficiently. The *After Effects* up time is now checked, as *After Effects* has memory leaks and needs to be restarted every few hours to keep the memory consumption and performance optimal.
    - Improved performance. Some tests may be paused when the project is too big; they can still be run manually.
- *Scriptify Expression* tool now creates a variable according to the property name, converted to camelCase.

### Fixes

- Fixed glitching issues hapenning sometimes with IK when they're stretched.
- The *Scale Z-Link* now works correctly when the camera is locked.
- The *Camera rig* tool no longer fails with one-node cameras, but shows a user-friendly alert.
- *Copy / Paste Animation* and the *Animation Library* now handle text keyframes.
- *Copy / Paste Animation* now correctly selects missing layers.
- *Edit Mode* now works correctly with locked child layers.
- *Controller extraction* is now faster and more reliable on *After Effects* > 22.0.
- *Pins* now work better with 3D layers.