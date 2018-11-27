# ![Motion Trail Icon](img\duik-icons\motiontrail-icon-r.png) Motion Trail

!!! note
    Available in After Effects CC2018 and above only.

![motion trail panel](img\duik-screenshots\S-Animation\S-Animation-Tools\MotionTrail-panel.PNG)  

The *Motion Trail* tool draws the trajectory of any layer in a shape layer, and can make trails behind (or in front of) them.

## Setup

1. Select the layer(s)
2. Click on the *Motion Trail* button

A "Motion Trail" layer is added to the comp. It is a shape layer used to draw the trails. An effect is added on this layer for each motion trail created.

## Effect

![motion trail effect](img\duik-screenshots\S-Animation\S-Animation-Tools\MotionTrail-effect.PNG)

Use the effects of the "Motion Trail" layer to adjust all the trails.

- The "Motion source" is the layer used to draw the trail.

- You can set the in and out (in frames relative to the current time) to adjust the length of the trail.
  Note: long trails can have a big impact on the performance.

- By default, the motion is sampled each frame of the composition. If the movement is very fast, you might want more samples for a smoother trail. In this case, you can switch to Automatic sampling which will try to adjust depending on the velocity and choose the best sampling while trying to keep better performance, or sub-frame sampling which is the heavier way to sample the motion.
  In Automtic and sub-frame sampling you can adjust the number of samples, which directly impacts the quality of the trail but can have a big impact on performance too.

- In the display section, you can change and animate basic appearance settings. Keep in mind that "Motion trails" are standard shape layers and you can do much more with them by modifying yourself the content.

## Additionnal panel

![motion trail option](img\duik-screenshots\S-Animation\S-Animation-Tools\MotionTrail-optn.PNG)  

In the additionnal panel, you can choose to create a new layer when you create new motion trails, or to add them all on the existing layer if any.
You can also set the color of new motion trails.
