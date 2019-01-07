# Zero

!!! hint
    Available in _Standard_ and _Expert_ modes only.

In After Effects, as in any animation software using parenting between objects, the coordinates of the layers are always given in relation to their parents; this makes the values change when changing parent links.

The Zero makes use of this behaviour to ease linking with expressions between layer transforms, even from a composition to another.

A Zero is a standard null object, which has exactly the same transform values as the layer it works with, and it is inserted in the hierarchy, between the layer and its former parent.

The effect is that all of the layer’s transforms, now given in relation to its zero, which is at the same place, are initialized to: [0,0] in position, 0 in rotation, [100%,100%] in scale.

Using zeros on several layers, it becomes very easy to link their positions with an expression even if they are not at the same place, and even from one composition to another.

Another useful thing is that using zeros makes it easy to recover the original position of a layer, you just have to set all its coordinates to 0. Adding zeroes to all controllers when rigging a character to be able to retrieve its rest pose is a very common trick.

To create a zero, select the layer(s) and click the "Zero" button.

!!! warning
    When a zero has been added, if you want to change the parent of the layer, be careful to change the parent of the zero and not the actual parent of the layer itself, to keep the zero in the hierarchy.
