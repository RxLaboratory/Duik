# Spatial Interpolation

![](../../img/duik/animation/spatial-interpolation.png)

These are a few buttons to help you quickly switch the spatial interpolation type of the selected keyframes.

The ![](../../img/duik/icons/autorig.svg){style="width:1em;"} ***Fix*** button automatically fixes spatial interpolation issues on the selected keyframes, which happen when one copies a keyframe and pastes it a bit later and the copied keyframe is not using a linear spatial interpolation. In this case, there may be a wrong movement in between the two keyframes because of the Bézier spatial interpolation. This can be fixed by setting the right linear interpolation on the two keyframes. That's what does the *fix* button, by detecting if two contiguous keyframes have the same value.

1. **Select** keyframes on spatial properties.
2. Click the ![](../../img/duik/icons/autorig.svg){style="width:1em;"} ***Fix*** button.  
    All Bézier interpolations between contiguous keyframes of the same value (and only them) are set to linear.

![](../../img/illustration/Galileo_spacecraft_trajectory_and_key_mission_events.png)  
*Galileo spacecraft trajectory and key mission events,  
NASA, 2003  
Public domain.*{style="font-size:0.8em;"}
