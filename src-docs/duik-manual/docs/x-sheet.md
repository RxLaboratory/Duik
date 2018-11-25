# ![Xsheet Icon](img\duik-icons\xsheet-icon-r.png) X-Sheet

*X-Sheet* is a simple way to adjust the animation exposure of the properties, the layers or the whole composition.

This is a very useful tool if you are compositing traditionnal animation or trying to achieve a traditionnal look on CG animations.
It can change the framerate of the composition or of the properties at any time, mixing framerates (what's called the "exposure" in traditionnal animation) in the same composition, for different layers or at different times.

## Setup

![xsheet panel](img\duik-screenshots\S-Animation\S-Animation-Tools\XSheet-panel.PNG)

You can use the *X-Sheet* either as an adjustment layer for the whole comp, or on properties.

To use it as an adjustment layer, just click on the "X-Sheet" button. To add it on properties, select the properties before clicking in the button.

## Effect

There are four ways to adjust the exposure of the animations / the compostion.

- By Frame Duration: This way, you just have to set the exposure with the "Frame Duration" value.  
For example, setting this value to 2 in a 24fps comp will run the animation at 12fps, setting in to 3 in the same comp will run it at 8fps.  
This value can be animated to change the exposure at any time.

The three other methods do not use an exposure / framerate value, but keyframes or markers to set the times when the frame must change. This allows a very precise control on the exposure, and works like a X-Sheet in traditionnal animation.

- The "X-sheet" method uses keyframes on the "X-Sheet" value of the effect: it will change the frame at each keyframe on the checkbox, no matter the value of the checkbox itself (it does not matter to check or uncheck it, it is only the time of the keyframe which is used).

- The last two methods works the same way but using composition or layer markers instead of keyframes. The displayed frame will be changed at each marker time.

## Additionnal panel

![xsheet option](img\duik-screenshots\S-Animation\S-Animation-Tools\XSheet-optn.PNG)

- You can use the additionnal panel to set an option to try to auto-detect the best exposure for selected properties to achieve a nice traditionnal look. This feature is a bit experimental but may work well with the most simple animations.
