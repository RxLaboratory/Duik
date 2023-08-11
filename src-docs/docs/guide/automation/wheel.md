# ![](../../img/duik/icons/wheel.svg){style="width:1em;"} Wheel

The *Wheel* automates the rotation of layers according to their translation[^formula].

![](../../img/illustration/Design_for_Four_Wheel_Dog_Cart,_no._3928_MET_DP882482.jpg)  
*Design for Four Wheel Dog Cart, no. 3928,  
Brewster & Co., Herman Stahmer, 1884   
Public domain.*{style="font-size:0.8em;"}

1. **Select** the layers.
2. Click the ![](../../img/duik/icons/wheel.svg){style="width:1em;"} ***Wheel*** button

## Effect

The Wheel can be adjusted in the effects of the layer.

![](../../img/duik/automation/wheel-effect.png)

The ***Radius*** is automatically set by Duik, but in some specific cases Duik may not be able to measure it accurately. In this case, you'll have to set te correct value for the wheel to rotate at the right speed.

!!! tip
    You can use the [*Measure Distance*](../constraints/tools/measure.md) [^measure] tool to measure the distance between the anchor points of two layers. Use a null layer to measure the radius of the wheel.

If ever you need to animate a wheel rolling on the ceiling instead of the floor, check the ***Reverse*** option...

Set the ***Trajectory*** according to the type of trajectory followed by the wheel. Be careful, this can greatly reduce the performance.

- *Horizontal* works only if the wheel rolls on a (almost) horizontal plane.  
    In this case, Duik just uses the X Position of the layer to get the traveled distance. This has the best performance as it's a simple subtraction.
- *Straight* works if the wheel follows a (almost) straight line.  
    In this case, Duik gets the length of the segment between the starting and ending points as the traveled distance. This is a bit slower than the *Horizontal* option but the difference should not be noticeable in most cases.
- *Curved* works in all cases.  
    This has the worst performance: for each frame of the composition, Duik adds the traveled distance from the previous frame; it's a *cumulative expression*. On long compositions, it can be very slow to compute[^slow].

When using the *curved* mode and you need motion blur, you may increase a bit the *Motion Blur Precision* value to fix motion blur artifacts, but be careful as this will make the performance drop drastically[^slow2].

[^formula]: The formula to automate the rotation of a wheel is actually pretty simple: `distance / radius` gives the rotation angle in radians, `(distance / radius) x 180 / π` gives it in degrees.

[^measure]: *cf. [Links and Constraints](../constraints/index.md) / Tools / [Measure Distance](../constraints/tools/measure.md)*.

[^slow]: Because there's no way to reliably store any data with expressions in After Effects, Duik actually has to re-compute everything for each frame of the composition. This means that for each frame, it needs to add up all previous frame values. The total number of values to be computed for a given composition is a [*triangular number*](http://en.wikipedia.org/wiki/Triangular_number) (see [en.wikipedia.org/wiki/Triangular_number](http://en.wikipedia.org/wiki/Triangular_number)) given by the formula `(f² + f) / 2` where `f` is the number of frames in the composition. Because of the `f²` in the formula, this number grows very fast with the duration of the composition.

[^slow2]: As stated above, the number of values to compute with a cumulative expression like the curved-trajectory wheel is a triangular number which grows fast with the number of frames in the composition. When you change the *Motion Blur Precision*, it's the same as doubling, tripling, etc. the number of frames of the composition (the expression has to sub-sample the frames). When set to `2`, that means the total number of values to be computed is `( (2f)² + 2f ) / 2` which is more than the double, `3`, `( (3f)² + 3f ) / 2` is even worse, etc.
