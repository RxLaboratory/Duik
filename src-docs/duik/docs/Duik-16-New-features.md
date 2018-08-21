### This is the list of all the features completely new in Duik 16
You can [read here the list](https://github.com/Rainbox-dev/DuAEF_Duik/wiki/Duik-16-Improvements) of improvements of the already existing features.

*The box is checked when the feature has already been implemented.
This list is not complete yet, it will be updated regularly with the ongoing development of Duik 16.*

# GENERAL

- [x] Settings in a file (can be synced with any provider like Dropbox)
- [x] Notes saved in a separate file (can be synced with any provider like Dropbox)
- [x] Brand new UI. Smaller, more beautiful. Work quickier.
- [x] Three UI modes: Rookie (easiest), Normal (full featured), Expert (smallest)
- [ ] Auto-Updater for Duik (automatically donwnloads and installs Duik)
- [ ] Anchor points manager (move and align anchor points)
- [x] Layers created by Duik are now tagged with a marker. The marker can be renamed by the user, but cannot be removed: some data is stored internally to help Duik identify the layers and compute stuff.
- [x] Contextual Help: [Shift+Click] on any tool to get instant help!

# RIGGING

- [x] Structures, a whole new rigging process and improved user experience
- [x] Re-written Autorig, even more versatile and easy to use

### Constraints
Constraint layers and properties to other layers and properties

- [x] *Position constraint*: the layer will translate with other layer(s)
- [x] *Orientation constraint*: the layer will rotate with other layer(s)
- [x] *Path constraint* (*CC2018* only): the layer will follow a bezier path (which can be animated itself)
- [x] *Parent link*: animate parent linking, with a percentage, link to as many layers as you wish, blend parent transformations
- [x] *Parent accross comps* is a simple way to parent a layer to another one in a parent composition, or in a precomposition, using locators and expressions.
- [x] *Bones*: Ability to create bones on puppet pins, but also any other spatial property, and on shapes too (*CC2018* only).
- [x] *Connector*: Connect almost any type of property, using the value or the velocity, to control any other properties. This new tool replaces the *Morpher* tool from older versions of Duik.
- [x] *FK Overlap tool*, very useful for tails and ropes (or even arms)! The *Follow through/Overlap algorithm* is also on FK over IK.
- [ ] Expression library. Easily save, edit and apply your expressions.

# AUTOMATIONS

- [x] *Randomize tool*: Randomize layer indices (move them in the stack)
- [x] *Paint rig*: Interpolation for diameter and color through the strokes.

### Effector

- [x] Control properties with a spatial effector

### Procedural animation

- [x] Animate without keyframes, with easy parameters! The first one will be a walk cycle, followed by run cycles, and other animations.

# ANIMATION

- [x] Lots of UI improvements
- [x] *Keyframe selection tool* to easily batch select keyframes by type or by layers.
- [ ] *Copy/Paste animation*: Option to offset values when pasting.
- [ ] *Copy/Paste animation*: Mirror keyframes when pasting
- [x] *IK/FK* snap and switch
- [x] *Extract controllers* automatically from a precomp to your main composition, and animate outside of the precomposed character. Scale, flip, flop the character as you need. With After Effects > 15.1, extracted controllers will use Master Properties to be able to animate several instances of the same rig, in the same project.

### Kleaner (Keyframe cleaner)

*Smart tool to clean your keyframes (remove uneeded keyframes, fix interpolations...)*

- [x] Remove unneeded keyframes
- [x] Smooth animations with a smart interpolation algorithm which sets better auto-bezier interpolations
- [x] Spatial Interpolations: Auto-fix spatial interpolations.

### Animation & Rig library

- [ ] Easily save and load animations and rigs from and to multiple layers.

### Motion trails (*CC2018* only)

- [x] Easily display the trajectory of any layer in the composition, and add a trail following (or leading) it

### X-Sheet

- [x] New animation exposure controls.

### Animation blender

- [x] Loop and blend several animations using triggers (markers)

# CAMERAS

- [x] *Framing Guides*: create handy guides in the composition to help your framing and image composition (safe frames, thirds, fibonnacci, isometric perspective...)

# TOOLS

- [x] *Search and replace*: Ability to replace text in text layers too.

# I/O

- [x] Import CSV from [Krita](https://krita.org) animation
- [ ] Export and import rigs in JSON
- [x] Import storyboard and create animatic from [Wonder Unit Storyboarder](https://wonderunit.com/storyboarder/)