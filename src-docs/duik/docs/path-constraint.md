# Path Constraint

!!! note
    Available in After Effects CC2018 and above only.

!!! hint
    Available in _Standard_ and _Expert_ modes only.  

The *Path Constraint* constraints the position of a layer to any Bézier path.

1. Select some layers
2. Select a Bézier path property (shape or mask)
3. Click the "Path Constraint" button

!!! note
    When clicking on the button, if no path property was found, *Duik* will show another panel to pick a path. In this case:

    - Select the desired path
    - Click on the "Pick Path" button
    - Select the layers to constrain
    - Click on "Constrain layer" button

A "Path Constraint" effect is added on the layer, where you can animate the percentage to move the layer along the path.

![Effect](img/duik-screenshots/S-Rigging/S-Rigging-Links&Constraints/PathConstraint-effect.PNG)

!!! tip
    The position of the layer can still be animated, and you can move it yourself to the path if you want it to be exactly above. In this case, set the percentage to 0% and move the layer above the first vertex of the Bézier path.

If the path itself is animated, the constrained layer will follow the animation of the path, even when the percentage is animated.
