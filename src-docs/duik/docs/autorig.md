[TOC]

# Auto-rig

The Auto-rig in Duik Bassel is a versatile and smart tool which adapts to a lot of different situations. This makes it the cornerstone of the [rigging process](rigging.md) in Duik, which can be summarized to:

1. Create Structures
2. Auto-rig
4. Animate

As a smart tool, it will guess what you are trying to do, depending on the layers you have selected. It is able to add some "simple" IK or to rig a complete character in a single click.

!!! note
    The Auto-rig is a tool in constant evolution. In each future version of Duik, it is going to work better and better, handling more different situations.

![Rigging GIF](https://rainboxprod.coop/rainbox/wp-content/uploads/smart-ux-2.gif)

*To get started quickly with this process, just watch this [jumpstart](https://www.youtube.com/watch?v=i63vPXJ00r0) by [Jake In Motion](https://www.jakeinmotion.com/):*  
![YOUTUBE](i63vPXJ00r0)

## Using the Auto-rig

1. Select some layers in the composition .
2. Click the "Auto-rig & IK" button.

    - **If there are Structures** in the selection:

        - If there are predefined limbs (arm, leg, spine or tail), the Auto-rig will rig everything for you, so you can start to animate right afterwards.
        - If the Structures are custom Structures, the Auto-rig will add IKs to rig them, determining which type of IK would be the best according to the number and location of the layers.

    - **If the selection is made of standard layers**, the Auto-rig will add IKs to rig them, trying to guess how they need to be rigged using their parenting and the location of their anchor points. If the layers are not parented yet, the Auto-rig is able to parent them automatically, but it's better in this case to select the layers in the right order: from the tip to the root of the limb (from hand to shoulder, or from foot to hip...).

![Autorig GIF](https://rainboxprod.coop/rainbox/wp-content/uploads/autorig.gif)

## IK and FK

The most important constraints used by the Auto-rig to rig characters are IK and FK.

### Inverse Kinematics (IK)

IK is a way to animate limbs by moving a controller located at the tip of the limb (i.e. at the hand or at the foot).  
This means that animating with IK uses positions, which are interpreted into the rotation of each part of the limb. This seems very natural when one manipulates it, but it is actually an advanced process. It is invaluable when the hand, or the foot, have interactions with anything else (like the foot interacting with the ground when the character walks).  
IK are the only way to animate the position of the hips while keeping the feet stuck on the ground, or the hand against a wall.  
But as animating with IK means animating positions, it is actually **not the easiest nor the smartest way to animate limbs**. It's needed when there are interactions, but in any other case (most of the cases for arms), you should prefer  animating with FK.

### Forward Kinematics (FK)

FK is the most simple way to animate limbs: all parts are parented together, and you just have to animate the rotations of each parts. Rotation is way easier to animate than position: there's only one value, one axis, and you don't have to adjust trajectories, you can focus on speed and eases only.
Ususally, when animating with FK, the animator wants to add [*follow-through* and *overlap*](https://en.wikipedia.org/wiki/12_basic_principles_of_animation#Follow_Through_and_Overlapping_Action). As these are very common in animation, FK controls created with Duik include an automatic [*follow-through* and *overlap*](https://en.wikipedia.org/wiki/12_basic_principles_of_animation#Follow_Through_and_Overlapping_Action) tool (read below).

### IK / FK

As both IK and FK can be useful, all IK created with Duik also include FK controls, and the animator can switch between FK and IK whenever he wants. The FK controls included in the IK effects even include an automatic *follow-through* and *overlap*.  
To make this process the easiest possible, an [IK/FK Switch](ik-fk-switch.md) tool is provided with the [animation tools](animation-tools.md).

When the Auto-rig creates an IK / FK, it can be adjusted in the effects of the corresponding controller. The type of the IK can vary depending on the type and number of layers which were rigged.

#### One-Layer IK (shoulder rotation, single-layer spine...)

!!! note
    This section still has to be written

#### Two-layer IK (arms and legs...)

!!! note
    This section still has to be written

#### Bezier IK (multi-layer spine, tails...)

!!! note
    This section still has to be written

#### FK with follow-through, overlap and drag (tails...)

!!! note
    This section still has to be written

## Controllers

As opposed to previous versions of Duik, the Auto-rig in Duik Bassel is able to create any needed controllers to rig the selected layers, you do not necessarily have to create them yourself first.  
This being said, if you need or want to add and use a specific controller, you just have to include it in the layer selection before running the Auto-rig. It will automatically detect and use it. This is especially useful if, for example, you want to control two different IKs with the same controller.

!!! tip
    Always have a look in the effects of the Controllers after having run the Auto-rig! Depending on what has been rigged, there may be a lot of options there.

## Additionnal panel

The additionnal panel for the Auto-rig is divided in two parts: some options for the Auto-rig process itself, and some complementary tools (*Standard* and *Expert* modes only).

### Options

- By default, the Auto-rig will "bake" the appearance of any Structure after it has rigged it. This is a way to improve performance in After Effects by removing all unneeded expressions, but it will prevent you from changing the appearance of the Structures after having run the Auto-rig. You can disable this option if you wish; baking the appearance of the Structures will still be possible through the *[Edit Structures](structure-tools.md)* panel (in Standard and Expert mode only).

- For long limbs (more than two or three layers), the autorig has to choose between standard IK, Bezier IK or FK. The default is FK - it is easier to achieve a nice and natural motion using the FK with overlap of Duik - but you may need IK in some cases, especially if the limb interacts with something else. For example if the dog's tail is caught in the door. Ouch.

### Complementary tools

!!! hint
    Available in _Standard_ and _Expert_ modes only.

*Read above for a description of the effects added on the controllers.*

- The ***IK*** button may be needed in very special occasions when the Auto-rig is not able to automatically create IK.
There is an additionnal panel for the IK to let you choose how the IK for three layers have to be made:

    - *1 and 2-layer IK* (the default option) creates a combination of a one-layer and two-layer IK to rig the three layers with only one controller. This is the preferred way of rigging complex limbs like quadrupeds legs, as it allows a lot of controllers over each part of the limb.
    - *3-layer IK* creates a single IK for the three layers, which may seem easier to manipulate, but which is more limited in use.

- ***Bezier IK*** creates a Bezier IK without using the Auto-rig. In normal situations, as soons as there are more than two layers, the Auto-Rig will create a Bezier IK, but in some cases you may need some Bezier IK for only one or two layers; in this case, you can use this tool instead.

- ***FK Overlap*** rigs a chain of layers with a rotation controller (FK) with automatic [*follow-through* and *overlap*](https://en.wikipedia.org/wiki/12_basic_principles_of_animation#Follow_Through_and_Overlapping_Action). This is very useful for tails, hanging ropes, fabric...
