# ![2d camera Icon](img\duik-icons\2dcamera-icon-r.png) 2D Camera

![2d camera panel](img\duik-screenshots\S-Camera\2DCamera-panel.PNG)

With 2D animation, it is usually easier to animate the positions of 2D layers than to set up a 3D space using cameras to create camera movements.

The 2D Multiplane camera tool creates virtual 2D cameras to easily animate all types of camera movements, using only 2D layers.

## Setup

1. Click on the 2D Camera button.
  Duik creates a couple of null objects and a camera controller on top of the composition. You can duplicate the null objects to add more planes to the setup.
2. Parent the background layers to the null objects
3. Animate the position of the camera controller to create standard dollying, the other movements can be animated using the effect on the controller.

## Camera Influence

The Camera Influence, as the name suggests, indicates how much of an impact the camera controller (designated as "L02 CAMERA") has on that null layer.

Camera Influence can be found in the effects of the generated or duplicated nulls. A common use case for these nulls would be to view them as planes, or "depths". L02's camera influence will always be 100% as it is the camera controller itself. The other null objects are essentially relative children of L02.

!!! note "Example"
    Let's say we want to create the illusion of three dimensional space that has a main focus on the objects in the middleground (*mg*).

    You have a foreground (*fg*) layer, an *mg* layer, and a background (*bg*) layer.

    You would parent your *mg* layer to *L02* since it is your primary object, the *bg* to *L01*, and the *fg* to *L03*.

    From here, you can set the camera influence of *L01* (*bg*) to a number with a value lower than 100 (the default is 66.67%) and the camera influence of *L03* (*fg*) to a value greater than 100 (default: 120.0%).

    Now when you manipulate the controller, the background will move 66.67% that of the *mg* and the *fg* will move 20% more than the *mg*, giving the illusion of depth/parallax.

## Effect

- **Horizontal or Vertical Pan**: simulates a rotation of the camera, animates the position of the layers without parallax.
- **Zoom**: simulates zooming, animates the scale of the layers without parallax
- **Truck In Out**: simulates truck in or out, animates the scale of the layers with parallax
- **Tilt**: animates layer rotations
- In the "**Advanced behaviors**" section, you can automatically animate shoulder cameras, camera shakes...
