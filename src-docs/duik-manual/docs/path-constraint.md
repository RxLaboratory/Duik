# ![path constraint icon](img/duik-icons/pathconstraint-icon-r.png) Path Constraint

![Path Constraint](img\duik-screenshots\S-Rigging\S-Rigging-Links&Constraints\PathConstraint.PNG)

!!! note
    Available in After Effects CC2018 and above only.

!!! hint
    Available in _Standard_ and _Expert_ modes only.  

The Path Constraint constraints the position of a layer to any Bézier path.

1. Select a Bezier path
2. Click on the "Pick Path" button of the Path Constraint panel
3. Selec the layer to constrain
4. Click on the "Create" button

A "path constraint" effect is added on the layer, where you can animate the percentage to move the layer along the path.

![Path Constraint effect](img\duik-screenshots\S-Rigging\S-Rigging-Links&Constraints\PathConstraint-effect.PNG)

!!! tip
    The position of the layer can still be animated, and you can move it yourself to the path if you want it to be exactly above. In this case, set the percentage to 0% and move the layer above the first vertex of the Bezier path.

If the path itself is animated, the constrained layer will follow the animation of the path, even when the percentage is animated.
