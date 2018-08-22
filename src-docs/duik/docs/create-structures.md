[TOC]

# Create structures

## ![Icon](https://github.com/Rainbox-dev/DuAEF_Duik/raw/master/docs/media/wiki/icons/w32_human_r.png) Hominoid

This tool will create *[Structures](structures.md)* for a complete hominoid with a spine, two legs and two arms, using the settings of the individual limbs set in the *[Structures](structures.md)* panel.

!!! note
    [Hominoids](https://en.wikipedia.org/wiki/Ape) (Hominoidea) are a branch of tailless anthropoid primates native to Africa and Southeast Asia.
    They are distinguished from other primates by a wider degree of freedom of motion at the shoulder joint.
    There are two extant branches of the superfamily Hominoidea: the gibbons, or lesser apes; and the hominids, or great apes (orangutans, gorillas, chimpanzees, humans).

!!! hint
    [ Alt + Click ] on the button for a demo of what Duik can do!

## Types of walking animals

The rig, and the animation, of the animal you're working on depends a lot on how it walks. There are three main ways of walking among vertebrates.

Type | Description | Examples | Notes
-----|-------------|----------|------
Plantigrade | Animals which put the whole foot on the ground, with the heel touching the ground when they walk. | Primates, bears, rabbits... | The ones nearly equal to humans.
Digitigrade | Animals which walk on their fingers. | Dogs and all canines, cats and other felines, dinosaurs, walking birds... | The friends of humans.
Ungulate | Animals which walk on the tip of their fingers, who usually have hoofs. | Horses, cattle, girafes, pigs, deers, camels, hippopotamuses... | The ones humans eat.

For each limb you can create with Duik, you have to choose the type of walking animal it is (for arms and legs), and which parts of the limbs must be created.

## Arm

Creates a *Structure* for the arm or the front leg of a quadruped.

Click the '+' button to adjust the settings for the arm.

You can check which part of the limb is present on your character. The autorig will adapt to every configuration, but using all of them (except for claws when rigging humans) can ensure a nice rig and a more realistic animation.

## Leg

Creates a *Structure* for the (rear) leg of a biped or a quadruped.

Click the '+' button to adjust the settings for the leg.

The autorig will adapt to every configuration, but using all of them can ensure a nice rig and a more realistic animation (with a proper foot roll).

## Spine

Creates a *Structure* for the spine of any vertebrate.

Click the '+' button to adjust the settings for the spine.

You can check which part of the spine is present on your character.
You can divide the spine and the neck in as many layers as you want (or none).
The autorig will adapt to every configuration.

## Tail

Create a *Structure* for the tail of any animal.

Click the '+' button to adjust the settings for the tail.

You can divide the tail in as many layers as you want.
The autorig will adapt to every configuration.

!!! tip
    In the Autorig options, you can choose between rigging tails using Bezier IK controls or FK (with automatic follow through and overlap) controls. The latter achieves a natural motion more easily, but IK could be needed in some cases, like if the tail interacts with anything else.

## Custom Structure

Creates a standard, custom *Structure*.

You can set the number of elements in the Structure, and choose a name for it.
