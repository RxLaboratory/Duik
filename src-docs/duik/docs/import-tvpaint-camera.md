# ![import TVPaint Camera Icon](img\duik-icons\tvpcam-icon-r.png) Import TVPaint Camera

![import tvpaint cam panel](img\duik-screenshots\S-Camera\ImportTVPaint-panel.PNG)

Duik can re-create any TVPaint camera animation in After Effects.

## Setup

1. Export the camera from TVPaint (this is done from the camera settings in TVPaint).
2. This camera can be imported along with its animation - position, scale, rotation - in After Effects.

Once the camera has been imported, you can copy/paste its animation on a camera created with the [2D Camera](camera-2d.md) tool of Duik:

- Copy the position property either to the position of the camera or the pan effect
- Copy the scale property either on the zoom or truck in/out effect
- Copy the rotation on the tilt effect.

## Additionnal panel

![import tvpaint cam option](img\duik-screenshots\S-Camera\ImportTVPaint-optn.PNG)

- There are three ways to re-create the camera in After Effects:

    - Using a Null object: creates a null object to get the animation of the camera.
    - Precomposing the layers: will precompose all layers of the composition, and the camera movement will be applied to this precomposition.
    - Use selected layer: applies the animation to the selected layer in the composition.

- Auto-parent layers will automatically link all the composition’s layers to the camera (keeping all existing links, parenting only layers which do not already have a parent layer).

- You can animate either the position or the anchor point of the camera.  
Using the anchor point, the movement will be closer to what it was in TVPaint, which moves the frame instead of moving the layers, as using the position will be far easier to adjust and tweak.

!!! note
    Interpolation methods in TVPaint and After Effects differ completely. Some minor differences in the interpolations between After Effects and TVPaint might appear.
