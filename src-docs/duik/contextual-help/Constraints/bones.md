Bones are a very simple yet extremely useful tool. They are layers used to control any spatial property or bezier shape.

Creation

1. Select the properties
2. - Click on the "Bones" button
    - Maintaining the [Alt] key will pick a random color for the new bones
    - Maintaining the [Ctrl] key will will ignore the tangents when creating bones on bezier paths

One bone will be created for each spatial property (All Ae versions) and for each vertex and tangent of Bezier paths (CC2018 and newer only).

Bones can be used to control puppet pins, but alos for example the emitter of a particle system, the origin of a lens flare, and, on CC2018 and newer versions, any Bezier paths (shapes or masks).

When the property is controlled by a bone, you can rig the bone itself, parent it to other layers (and Structures of Duik), etc. which make rigging effects very easy. This is the easiest way to rig a character with the puppet tool of After Effects, or even a way to rig directly the shapes used to draw the character.

Edit Bones

In the additionnal panel of the Bones (Standard and Expert modes), you can adjust their appearance.
All changes made in this panel will affect all selected Bones and the creation of all other Bones.

- You can change the size of the Bones, either automatically, relatively to the size of the composition (small, medium and large options), or with an absolute value (custom option).

- You can change the color of the Bones: if you click on the colored label, a color picker will be shown, but you can also set your own hexadecimal color code in the text field. A random button will set a random color.

- You can pick the selected Bone appearance with the "Get" button, and set the parameters to the selection with the "Set" button.

- The "Bake Appearance" button will remove all expressions used by the Bones to set their appearance. This will improve the performance of the rig, but you will not be able to change the appearance afterwards.
