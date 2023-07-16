# ![](../../img/duik/icons/ik.svg){style="width:1em;"} Inverse and Forward Kinematics (IK / FK)

Kinematics are several methods to control and animate the rotation of the joints of limbs.

Usually, the most basic rig for any kind of limb is to parent the layers together, from the tip (child, e.g. hand or foot) to the root (parent, e.g. shoulder or hip) of the limb.  
In this simple case, that's called ***Forward Kinematics (FK)***: you just need to animate the rotation of each joint from the root to the tip to animate the whole limb.  
This is the easiest way to animate a limb, as rotation are simple values, and you just have a single value per joint to animate. This works as long as there is no interaction and constraint between the tip (e.g. hand or foot) with something else which moves differently (or is just static, like the floor in the case of a foot).

But if you need to constrain the tip of the limb, or just keep it static while animating the root (e.g. keep the foot still on the ground while moving the hips around), you'll need another method where you can animate both ends of the limb using their position instead of their rotation. That's called ***Inverse Kinematics (IK)***, because to the contrary of the FK, you have to animate the end of the limb and the position value is then automatically converted to rotation values in the reversed order, from the tip to the root of the limb. This makes it a bit more difficult to achieve a nice animation, as you'll have to take care of the trajectories of the end of the limb, and handle position properties which are multi-dimensional and more complex than simple rotations.

!!! note
    When animating using IK, you have to set the values of the position keyframe and their temporal interpolation, as you would with FK and rotations, but you also have to manage the spatial interpolation and make sure the limb always follows a curved trajectory (and not straight lines)[^1].

With Duik (and the Auto-rig) you can rig limbs in a way to be able to switch at any time between IK and FK according to your needs at the time you're animating. There are also specific types of IK to ease the animations of longer limbs like horse legs, ant and crab legs or even like hair strands, tails or even spines and long necks.

## IK and FK creation

There are two ways to rig After Effects layers with the different types of Duik IK and FK controls:

- Using Duik [bones](../bones/index.md) and the [Auto-rig](../bones/autorig/index.md)&nbsp;[^2].
- Using the ![](../../img/duik/icons/ik.svg){style="width:1em;"} *Kinematics* menu in the *![](../../img/duik/icons/constraints.svg){style="width:1em;"} Constraints* panel. Using this method, you'll be able to rig any kind of layer.

Both methods allow you to customize the type of IK/FK controls which are created by Duik.

Duik creates one or several controller layers, according to the type of IK/FK, and adds a few effects on these controllers to adjust the settings and give a more precise control on the limb.

### Using the Auto-Rig

Although the Auto-Rig is a smart tool and will try to do its best no matter what layer you select, it's better to use it exclusively with Duik bones.

1. Select the bone layers you want to rig.
2. Click the *![](../../img/duik/icons/autorig.svg){style="width:1em;"} Auto-Rig* button. This button is available in the ![](../../img/duik/icons/oco.svg){style="width:1em;"} *Meta-Rig*, ![](../../img/duik/icons/bone.svg){style="width:1em;"} *Bones* and ![](../../img/duik/icons/constraints.svg){style="width:1em;"} *Links and Constraints* panels.

When using custom bones and for other specific long chains like tails or hair strands, you can choose the type of FK or IK control to use. Read the *[Bones and Auto-Rig / Auto-Rig](../bones/autorig/index.md)* section for more details.

### Using the Kinematics menu

This method works with all layers.

1. Parent the layers together, from the tip (child) to the root (parent) of the limb.
2. Create a controller layer[^3] if you'd like to use a custom controller. This is optional as Duik will create a controller for you if there's no controller already available.
3. Click the ![](../../img/duik/icons/ik.svg){style="width:1em;"} *Kinematics* menu and then click the type of IK or FK Control you'd like to use.

![](../../img/duik/constraints/kinematics-menu.png)  
*Different types of IK and FK controls are available.*

This menu shows the different types of IK and FK Control:

- **Standard IK/FK**  
    This is suitable for single-layer, 2-layer and 3-layer chains; some options are available specifically for 3-layer chains, read below for more details.
- **Bézier IK**  
    Although the Bézier IK can be used for any layer chain, it is especially useful for chains longer than 2 layers.
- **FK** with Overlapping animation
    This is a very handy FK-only control for chains where you're sure you won't need IK.
- **Bézier FK**  
    This is a special control based on the Bézier IK control but rigged in a way you can animate rotations instead of the Bézier IK controllers' positions.

## Standard IK/FK

The standard IK and FK control can be used with chains consisiting of one to three layers (plus the tip, like the hand or the foot). It can be used for almost all kind of legs and arms.

![RXLAB_VIDEO](https://rxlaboratory.org/wp-content/uploads/rx-videos/Duik17_E04_Arm__EN_720.mp4)  
*This video is part of [__the official comprehensive video course about Duik Ángela__](https://rxlaboratory.org/product/the-official-comprehensive-video-course-about-duik-angela/)*

### Single-layer chain

When used on a single layer, the rigged layer just automatically rotates to always point towards its controller.

![](../../img/duik/constraints/1l-ik_00000.png)

With this type of IK/FK, you can animate either the position of the controller and the position of the rigged layer (or its parent), or the rotation of the layer itself. This means you can animate both using IK or FK as you wish.

The effect on the controller allows you to customize the control.

![](../../img/duik/constraints/1l-ik-effect.png)

- ***IK***: you can disable the IK if needed; this is animatable.
- ***Weight***: if you set this to a lower value than `100 %`, the layer will rotate less than needed to point towards the controller.  
    This is how Duik rigs the automatic rotation of the shoulder when you move the hand for example.
- ***FK***: use this value to control the rotation of the rigged layer.  
    This is here for convenience, as you could also just animate the actual rotation of the layer.
- The ***Limits*** define bounds for the rotation of the layer.  
    This may be useful to limit the rotation of a shoulder in its natural bounds for example. To help you define these limits, you can use the guides to visualize them.
- ***Advanced***:  
    - ***Inherit parent rotation***: if this is checked, the layer will rotate with its parent rotation.  
        Disabling it makes sure the layer always keeps its own orientation no matter the rotation of its ancestors.
    - ***Full rotation limit***: at some point when you move the controller around, there will be a 360° jump in the rotation values of the layer.  
        Check this to set this jump on the other side, 180° above.
- The ***Data*** section contains some data needed by Duik to compute the Kinematics.
- ***Display***:  
    - ***Draw guides***: check this if the controller is a shape layer to show some useful guides to setup the IK.
        The limits will be shown to help you adjust their values.

![](../../img/duik/constraints/1l-ik-guides_00000.png)  
*The IK Controller with the guides, showing the limits, and the* full rotation limit *in red.*

### 2-layer chain

### 3-layer chain


[^1]: As the movement of the hand or the foot are actually the result of the rotation of the elbow and shoulder or the knee and hip, they naturally move following smooth curves. That's not the case by default when animating positions in After Effects, where the trajectory will be a straight line. When animating with IK you'll have to use the pen tool to adjust the spatial Bézier interpolation of the position keyframes if you don't separate the dimensions and handle manually the individual interpolations for each axis.

[^2]: *cf.* *[Bones and Auto-Rig](../bones/index.md)*

[^3]: *cf.* *[Controllers](../controllers/index.md)*