# Wiggle

The "Wiggle" makes the properties... wiggle.

## Setup

This automation works like the standard wiggle available via the expressions of After Effects, but with more options and abilities: it can loop and has options to control several axis.

1. Select the properties
2. Click on the "Wiggle" button

The wiggle can be adjusted in the effects of the first layer selected.

## Effect

By default, the duration of the loop is set to the duration of the composition.

The "Link Dimensions" checkbox will set the exact same wiggle on all the dimensions of the effect, this is very useful in scale for example, to keep the aspect ratio of the layer.

In the details, there are some more advanced properties. Complexity and multiplier allows to have a "fractal" wiggle, and the random seed is used to generate the pseudo-randomness of the wiggle. This random seed is set to the index of the layer by default at the time the wiggle is created. On the contrary of the standard wiggle in After Effects, using this random seed allows to keep the wiggle as it is even if the layer is moved in the stack. To change the randomness, just change this seed.

## Additionnal Panel

In the additionnal panel of the wiggle, there are a few options:

- "Collapse dimensions" adds a unique control for all axis, "separate dimensions" adds a set of controls for each axis.

- "Unique control" creates a single effect for all selected properties, but "individual controls" creates an effect for each property.
