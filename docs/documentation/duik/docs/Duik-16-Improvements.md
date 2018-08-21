### This is the list of all features already in Duik 15 which have been improved in Duik 16

You can [read here the list](https://github.com/Rainbox-dev/DuAEF_Duik/wiki/Duik-16-New-features) of all the new features of Duik 16.

*The box is checked when the feature has already been implemented. This list is not complete yet, it will be updated regularly with the ongoing development of Duik 16.*

# GENERAL

- [ ] Set default labels for Structures, Controllers, Bones...
- [x] Better auto-naming for layers and other items
- [x] Improved stability of the expressions, and the whole script itself

# RIGGING

- [x] Better controllers, with controls for display in the effects
- [x] New controller shapes
- [x] New bone shapes
- [x] Bones are more stable (and work with duplicated names)
- [x] IK creation greatly simplified (auto-detection of the controller, the goal, etc.)
- [x] More IK options on the controller, stability improved
- [x] No more "Zero" layer on IK with Shape layers
- [x] The *Morpher* is removed, replaced by the new *Connector* tool
- [ ] All rig tools can be scaled and flipped
- [x] The *Autorig* is more versatile than ever: rig all kind of characters.
- [x] Duik no longer supports rigging in 3D (the IK won't work in 3D). This is too complicated, and not what Duik is meant for, not to mention that *After Effects* is **not** a 3D Software and may have performance issue with 3D Rigging. We strongly advise users who want to work with 3D Rigging to use a 3D Software like *[Blender](https://www.blender.org/)*.

# AUTOMATIONS

- [x] Removed *Path follow* (it's in the geometry options of the AE layers)
- [x] Removed *Lens* (deserves its own script)
- [ ] Posterize time option on all compatible automations

### List

- [x] Apply lists on several properties at once
- [x] Animation and expression automatically copied to first slot

### Wiggle

- [x] Link dimensions together to have the same values (very useful with scale properties)
- [x] Better organization of the effect (grouped by axis)
- [x] Add wiggle on several properties at once
- [x] You can now control the complexity of the wiggle (octaves and mutliplier) and manually set a Random Seed to keep the same wiggle accross layers.

### Swing

- [x] The expression has been improved and is faster to compute
- [x] Added an angle control when swing is used with spatial properties
- [x] Added an axis control when swing is used with multi-dimensionnal non-spatial properties (like scale)
- [x]  Add swing on several properties at once

### Wheel

- [x] The radius of the wheel is auto-detected based on layer size
- [x] The computation mode (curved or horizontal movement) can be changed in the effect after the wheel has been created
- [x]  Add wheel on several layers at once

### Spring

- [x] Ability to switch between basic and simulated mode after the creation
- [x] Add spring on several properties at once
- [x] Simulated spring now works on any spatial property

### Blink

- [x] Simplified control
- [x] Works on colors
- [x] Add blink on several properties at once

# ANIMATION 

- [ ] Ability to add keyframes on all animated properties, not only selected properties

### Interpolations

- [x] Separated in and out velocities
- [x] Ability to switch in and out interpolations

### Spatial Interpolations

- [x] Ability to set to linear in / bezier out and bezier in / linear out.

### Copy/Paste Animation

- [x] Now works with all properties of the layers, including shapes and styles.
- [x] Option to paste on all layers or only selected layers

# CAMERA

### 2D Camera

- [x] Simplified (removed zeroes)
- [x] Ability to add a layer (just duplicate any existing layer)
- [x] New controls for predefined behaviours. Easily simulate a shoulder mount, a camera hold by hand, or on a tripod, with shake controls.

# TOOLS

- [x] *Rename* and *Search and Replace*: faster expressions update, performance improvements.

# I/O

- [x] Export to Audition: handles audio levels
- [x] Import animation: more useful options to control how imported animations are handled.