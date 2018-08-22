# Camera Rig

If you need to use 3D cameras, you can rig them in a simple way using Duik's "Camera Rig".

This is a simple way to manipulate a two-node camera with the advantages of both a two-node and a one-node camera.

It will create three controllers:

- The main controller will control both the camera and its point of interest, actually controlling the camera as if it had only one node (without a point of interest).
- One position controller is used to control the camera only.
- And a third controller controls only the point of interest.

If you're interested in a more complex rig, with predefined trucks, pans, etc. for easy standard camera motion, and behaviours like shoulder camera, etc. [let us know](https://github.com/Rainbox-dev/DuAEF_Duik/wiki/Bug-Report-&-Feature-Request)! This could be added in a future version of Duik.
