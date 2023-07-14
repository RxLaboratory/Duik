# ![](../../img/duik/icons/connector.svg){style="width:1em;"} Connector

The connector is a simple yet very powerful tool to automate all kind of cause-consequence link between properties. Every time you need the value of any property react to the change of any other property, you should be able to use the connector to build the automation.

It simply drives a *slave*[^1] property (or several slave properties) according to the values of a master property, a bit like what parenting does with the transformation of layers.

A single master property can control many slave properties, but to the contrary of a standard parenting (or using the native expression pickwhip in After Effects), a single slave property can be driven by several master properties. There are multiple ways to achieve that, explained in the end of this section.

![RXLAB_VIDEO](https://rxlaboratory.org/wp-content/uploads/rx-videos/Duik17_G01A_Connector1__EN_720.mp4)  
*This video is part of [__the official comprehensive video course about Duik Ángela__](https://rxlaboratory.org/product/the-official-comprehensive-video-course-about-duik-angela/)*

## Before the connection

All the properties which need to be animated together are prepared using keyframes. It's these keyframes which will be controlled by the master property, a bit like a time-remapping would do.

The first step is to animate these slave properties; you can use as many keyframes as you need, and precisely adjust the interpolations if needed. You just have to make sure all the animations of the slave properties have exactly the same duration; if an animation needs to start after or end before the others, just copy and paste the first or last keyframe so that it starts or end with a fixed part.

![](../../img/duik/constraints/connector-slave.png)  
*All animations must have the same duration*

Any property of any type which can be controlled by an expression can be connected using the Connector!

## Quick Connector

The quick connector creates a master slider in the effects of the selected layer, and connects all selected slave properties to this new slider.

The movement of the slave properties is controlled by their own keyframes, and can still be adjusted after the connection if needed.

![](../../img/duik/constraints/quick-connector.png)  
*In this simple example, the* connector *effect controls the position and the rotation of the layer.*

It can be used to quickly animate many properties at once, and make sure all have the same interpolation. As the slider is a simple percentage, it is very easy to animate and set the ease influences and velocities on the keyframes.

!!! tip
    For example, it is a great way to animate the scale and position of a layer and having these properties perfectly synced, even when using complex Bézier interpolations with the graph editor. More generally, it is a great way to animate many properties and layers at once, when they need to be synced.

To use the quick connector, follow these simple steps:

1. **Animate the slave properties**, the properties to be controlled, from their initial to final state. You can add as many keyframes as you need, and adjust interpolations too.
2. **Select all the properties** you'd like to control together.
3. **Click** on the ![](../../img/duik/icons/connector.svg){style="width:1em;"} *Connector* button.

!!! tip
    The *connector* slider being a simple percentage value, it is also easy to connect it to something else and use simple expressions with it.

## Advanced Connector

If you need more advanced connections, you can choose one of the many other ways to connect properties and select or create a master controller.  
The first step is to get to the settings panel of the connector: either click the ![](../../img/duik/icons/options.svg){style="width:1em;"} *settings* button or `Shift + Click` the connector button.  
This opens the advanced Connector panel.

![](../../img/duik/constraints/advanced-connector.png)

The line of buttons, ![](../../img/duik/icons/pick_texture.svg){style="width:1em;"} *Pick texture*, ![](../../img/duik/icons/pick_audio.svg){style="width:1em;"} *Pick audio*, ![](../../img/duik/icons/pick_prop.svg){style="width:1em;"} *Pick control* lets you select an existing layer or property to be used as a master controller for your connection, which you'll connect to all slave properties you'd like to animate together.

All other buttons automatically create different types of controllers to be used to control the slave properties.

### Pick control

To use an existing property or layer as a master controller, first select it and then click on the ![](../../img/duik/icons/pick_prop.svg){style="width:1em;"} *Pick control* button.

Properties to be used as master controllers with the connector can be:

- Any numeric property, with 1, 2, or 3 dimensions (rotation, position, opacity...).
- A color
- A dropdown menu (except layer dropdown lists)

!!! note
    All these properties are actually numeric values: a color is a 4-dimensional value (consisting of the red, green, blue and alpha channels), and dropdown menu values are the indices of the items, which are simple integers.

There are also special cases handled automatically; you can also select these:

- Duik [IK effects](kinematics.md)
- Duik [Slider, 2D-slider, Angle controllers](../controllers/index.md)
- Duik [Effectors](../automation/effector.md)
- Duik [Expose transform](tools/etm.md) controls

When selecting one of these, the connector can automatically pick the right property for you.

When you click the ![](../../img/duik/icons/pick_prop.svg){style="width:1em;"} *Pick control* button, the connection settings panel is shown.

![](../../img/duik/constraints/connector-settings.png)  
*Connector settings when using a position property as the master property*

![](../../img/duik/constraints/connector-settings-ik.png)  
*Connector settings when using an IK effect as the master control*

There you can set a few parameters before finishing the connection.

- In some cases, you may have to **select a specific property** as a master property.  
  For example, when using an IK Effect, you can either use the *IK Length*, the *Upper stretch* or the *Lower stretch* values. This is a nice way to connect the bending or stretching of a limb to secondary animations or adjustments.
- You can choose to connect using the simple ***Value*** of the master property, or its ***Speed*** (an absolute value) or its ***Velocity*** (similar to the speed, but with a sign to know the direction).
- For multi-dimensional properties, you have to **select the axis**. You can only connect a single axis at once, but don't forget you can make multiple connections to connect all axis if needed.
- The **minimum** and **maximum** values define the range in which the master property is going to be animated. Note that the motion of the slave properties is not extrapolated outside of these values.

If there's an animation (using keyframes or an existing expression) on the master property at the time you select it before opening the connection settings, Duik automatically picks the minimum and maximum values of the existing animation. This makes it very quick to set up the connection: just add a couple of keyframes on the master property to quickly define the minimum and maximum values to be used, and only then click on the ![](../../img/duik/icons/pick_prop.svg){style="width:1em;"} *Pick control* button. You'll be able to remove these keyframes after the connection's been made.

Once you're done with these settings, you can finish the connection by clicking one of the three bottom buttons:

- ![](../../img/duik/icons/layers.svg){style="width:1em;"} ***Layer opacities***: a few keyframes will be added in the opacity of the selected layers to let the master property "select and show" the layers, one by one. This is a quick and easy way to set up a selector for a bunch of layers.
- ![](../../img/duik/icons/props.svg){style="width:1em;"} ***Properties*** simply connects all the slave properties. The movement of these properties will be controlled by their own keyframes, and can still be adjusted after the connection if needed.
- ![](../../img/duik/icons/shape_key.svg){style="width:1em;"} ***Key Morph*** automatically sets up the selected Key Morph keys to control them from the master property. Read the *[Key Morph](key-morph.md)* section for more details.

You can now control all slave properties with the master property.

A Connector effect is added on the master layer, to let you change the settings of the connection later if needed.

![](../../img/duik/constraints/connector-effect.png)

After the connection, you can still adjust the keyframes and interpolation of any slave property. To ease these adjustment, you can disable this connector effect to temporarilly disable the expressions and adjust the keyframes on the slave properties.

!!! warning
    Unfortunately, because of After Effects, disabling the connector effect is not enough to be able to adjust the keyframes on slave Bézier path properties, you need to actually deactivate the expression.

### Slider, 2D slider, Angle control

### Expose transform

### Layer list

### Effector

### Texture

### Audio

## How to connect a single slave property to multiple master properties

## Examples


[^1]: In some cultures, using the *master* and *slave* metaphor 