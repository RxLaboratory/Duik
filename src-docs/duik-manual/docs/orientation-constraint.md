# ![Orientation Constraint Icon](img/duik-icons/orientationconstraint-icon-r.png) Orientation Constraint

![Orientation Constraint](img\duik-screenshots\S-Rigging\S-Rigging-Links&Constraints\OrientationConstraint.PNG)

!!! hint
    Available in _Standard_ and _Expert_ modes only.
    
The Orientation Constraints links the rotation of a layer to the orientations of other layers.

This is a very useful tool when you need a layer to stay always aligned with another layer, without translating with it.

You can also use this constraint to link the orientation of a controller to the orientation of any layer in the rig, this is a quick and easy way to control rotations in a rig, without parenting.

Select a layer and click on the "Orientation Constraint" button.
An effect is added on the layer to let you select the constraint and set its weight to adjust the influence.

![Orientation Constraint effect](img\duik-screenshots\S-Rigging\S-Rigging-Links&Constraints\OrientationConstraint-effect.PNG)

To constrain a layer to several other layers, you can duplicate the effect, and adjust the weight of each constraint.

!!! hint
    If you add the constraint onto a layer but do not select any other layer to constrain to, the constrained layer will keep its own orientation no matter what, even if its parent rotates. This is exactly what the *IK Goal* did in previous versions of Duik.
