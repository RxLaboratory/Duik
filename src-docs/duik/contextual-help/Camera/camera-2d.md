With 2D animation, it is usually easier to animate the positions of 2D layers than to set up a 3D space using cameras to create camera movements.

The 2D Multiplane camera tool creates virtual 2D cameras to easily animate all types of camera movements, using only 2D layers.

## Setup

1. Click on the 2D Camera button.
  Duik creates a couple of null objects and a camera controller on top of the composition. You can duplicate the null objects to add more planes to the setup.
2. Parent the background layers to the null objects
3. Animate the position of the camera controller to create standard dollying, the other movements can be animated using the effect on the controller.

## Effect

- Horizontal or Vertical Pan: simulates a rotation of the camera, animates the position of the layers without parallax.
- Zoom;: simulates zooming, animates the scale of the layers without parallax
- Truck In Out: simulates truck in or out, animates the scale of the layers with parallax
- Tilt: animates layer rotations
- In the "Advanced behaviors" section, you can automatically animate shoulder cameras, camera shakes...
