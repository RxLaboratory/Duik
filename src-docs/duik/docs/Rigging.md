[TOC]

# The rigging process in Duik Bassel

To make the rigging process easier and more versatile in After Effects, Duik Bassel introduces the *Structures* which are very similar to bones or joints in 3D softwares.

The process can be summarized in just a few words:

1. **Structure**  
    a. Create Structures  
    b. Link layers
2. **Controls**  
    a. Auto-rig  
    b. Constraints
3. **Animation**

![Rigging](https://rainboxprod.coop/rainbox/wp-content/uploads/smart-ux-2.gif)

**To get started quickly with this process, [just watch this jumpstart by Jake In Motion](https://www.youtube.com/watch?v=i63vPXJ00r0)!**

## [Structures](../Structures)

[Structures](../Structures) are layers you can add in your composition which will drive the animations, like the rig of a real puppet. The process is very simple: create or import your design in After Effects, add Structures and move them to the right spots (the pivots of each limb). Then you can rig those Structures, instead of the design itself like in previous versions of Duik, and finally link the design layers to the corresponding Structure layers.

This way, the rig you create is independant from the design. This means it’s easier to adjust the design even after the rig has been made, or even to re-use the same rig with other designs. Also, this rigging process is easier to fix or change if ever you need to adjust it even when you’re already in the process of animation.

## [Controllers](../Controllers)

Using the autorig, and a set of constraints, what you end with are [controllers](../Controllers) to drive the animation. You animate the controllers, they drive the structures through the constraints, and voilà! Your character moves.

## [Constraints](../Constraints)

The interaction between the controllers and the Structures, and between the Structures themselves, happens through some [constraints](../Constraints). Some of them are the core tools of Duik since the first version, like IK which drive the bending of limbs, and the Bones which are used to control any spatial properties: puppet pins, the emitter of a particle effect, and, with CC2018 and newer versions of After Effects, any bezier value, like shapes or masks.

There is also a whole new set of constraints to automate even more movements and make the animator’s life very easier: it’s now possible to animate parenting with the new Parent Link constraint, or to constrain a layer to a bezier path, to attach a layer to other layers using weights, etc.

## [Automations](../Automations)

As soon as your character is rigged, you can begin the animation, being helped by a lot of *Automations*. **[*Automations*](../Automations) are procedural animations** and dynamics to quickly set the most common animations up and then focus on the characterization of your character. You can automate wiggles, springs, wheels, etc. with customizable and advanced controls for example to loop the effects, and access each and every detail quickly and easily.

# The rigging panel

The rigging panel is divided into categories corresponding to this rigging process:

- ***[Structures](../Structures)*** create and edit structures.
- ***[Constraints](../Constraints)*** (auto-)rig the structures, with IKs, the connector, parent links, bones, constraints...
- ***[Automations](../Automations)*** add some automatic motion to properties (wiggle, spring...)
- ***[Controllers](../Controllers)*** create and edit nice and easy-to-use controllers.
- ***[Miscellaneous tools](../Rigging-Tools)*** renaming items, searching and replacing texts... is no longer a pain in After Effects.
