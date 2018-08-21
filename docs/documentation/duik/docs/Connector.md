[TOC]

# Connector

The Connector is a way to control almost any property in After Effects with any other property, a bit like parenting between layers, but with properties.

With the connector, a "master property" will drive one or several "slave properties" and automate their animation depending on the master property value.

It is very useful in three cases:

- Every time you need a causal link between a property and some other properties. For example "when the arm bends, the cloth has to adapt": this means you can use the connector to drive the shape of the cloth with the rotation of the forearm.
- It is very powerful to quickly connect sliders and other controllers to any properties, and for example control a head turn from a single value like the X position of a controller or a slider.
- You can use it to control opacities of layers with a single property, for example to control phonemes with the position of a controller.

The child property has to be prepared with keyframes, and the master property will drive this animation a bit like if you were using time remapping on the slave property, in a similar way to the "set driven keys" in Autodesk Maya.
When the master property value is at the predefined minimum, the child property value is the one at the start of its animation, and when the master property value is at the predefined maximum, the child property value is at the end of its animation.

![Connector GIF](https://rainboxprod.coop/rainbox/wp-content/uploads/connector.gif)

## Property types handled by the connector

As the connector uses the same principle as time remapping, it is able to connect almost any type of property to any other type of property, which makes it a very powerul tool, even on older versions of After Effects.

The slave property can be of any type which can be animated with keyframes and have an expression (numerical and spatial values, shapes, texts...)

The master property must be of a type which is numerical (but can be multi-dimentionnal), like sliders, angles, position, scale, colors...

## How to set the connector up

1. It is advised to first add the needed keyframes on the slave property, though this can be done or modified afterwards. Just animate the slave property as you need it to change when the master property goes from its minimum to its maximum.
2. a. Select the master property in the timeline, and click on "Pick Master Property". The name of the master property will be shown on the button.  
    b. You can also use one of the 4 controllers of Duik espacially made to be used by the connector (the slider, the 2D slider, the angle and the spatial effector)
3. Depending on the type of the master property, you can select the axis (or the channel if it's a color) to be used to control the slave properties.
4. Choose between the value or the velocity of the master property to control the slave properties. Using the velocity can be very useful for example to control how the antenna of a car rotates depending on the speed of its X position.
5. Set the minimum and maximum value of the master property.
6. Click either on "Connect to selected properties" or "Connect to selected layers opacities". The latter can be used to control the display of a bunch of layers with a slider: it's a good way to switch predefined phonemes for a mouth with a controller for example. It is exactly like using time remapping on a composition containing a layer sequence, but without all the issued caused by using actual time remapping.

After these few steps, everything is ready: as soon as the master property changes, the slave properties will be driven. You can change all the settings afterwards in the effects of the master layer.

If you need to adjust the keyframes on the slave properties, you can temporarily deactivate the connector by disabling the corresponding connector effect on the master layer.

## Examples

### Automating the cloth when the arm bends

With an arm already rigged, made of shapes (either shape layers or masks on solids):

1. Animate the rig so the arm is straight at the beginning of the comp, and bent at its maximum a couple seconds later. If it's possible, animate only the FK of the forearm so the animation is the most simple possible, and to isolate the effect of the forearm on the cloth only, as its just a reference to draw the shape of the cloth.
2. Animate the shape(s) of the arm and forearm so the cloth looks nice during the whole animation. Feel free to add as many keyframes as needed and use eases!
3. Select the rotation property of the structure of the forearm. This is the property which exposes how the arm is bent, no matter what, in FK as in IK.
4. Click on the "Pick master property" button of the panel of the connector.
5. Set the minimum to the rotation value of the structure of the forearm at the beginning of the composition, when the arm is straight.
6. Set the maximum value to the rotation value of the structure of the forearm at the end of the animation, when the arm is completely bent.
7. Select the shape(s) used to draw the cloth (and now animated).
8. Click on the "Connect to properties" button.
9. Now you can remove the animation of the arm (but NOT the animation of the shapes which is needed by the connector)
10. You're all set! Now you can animate the arm as you wish, the cloth will correctly adjust.

### Controlling a head turn

With a precomposed head:

1. Animate anything you need to turn the head from left to right in the precomposition of the head.
2. a. To control this head turn, we will not use an existing property, but create a nice controller just for it:  
    b. Go to the main composition, from where you will animate the head  
    c. In the panel of the connector, click on the "Slider" button
3. Select ALL the animated properties of the head turn in the precomposition of the head.
4. Click on the "Connect to properties" button.
5. That's it! Now when you move the slider from left to right, the head turns!

### Controlling phonemes for a mouth

You can connect the position of a controller to phonemes. You must have one layer for each phoneme:

1. Select the controller's position
2. Click on the "Pick master property" button of the panel of the connector.
3. Set the minimum value corresponding to the position of the controller where the first mouth must be displayed.
4. Set the maximum value corresponding to the position of the controller where the last mouth must be displayed.
5. Select the mouth/phonemes layers.
6. Click on the "Connect to opacities" button of the connector.
7. Et voilà! Move the controller to change which phoneme is displayed.

!!! tip
    You can add a background behind the controller showing all the phonemes to know what you are selecting.

!!! note
    The order of the phonemes is based on their indices in the stack the moment you create the connector.
