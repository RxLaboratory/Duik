# ![](../../../img/duik/icons/zero.svg){style="width:1em;"} Zero

In After Effects, as in any animation software using parenting between objects, the coordinates of the layers are always given in relation to their parent; this makes the values change when changing parent links.

**Select a layer** and then click the ***![](../../../img/duik/icons/zero.svg){style="width:1em;"} Add Zero*** button to zero out all of its transform properties.  
`[Alt] + [Click]` to reset the transform properties of the selected layer to `0`,  
`[Ctrl] + [Alt] + [Click]` to also reset the opacity to `100 %`.

The *Zero* makes use of this behaviour to ease linking with expressions between layer transforms, even from a composition to another.

A Zero is a standard null object, which has exactly the same transform values as the layer it works with, and it is inserted in the hierarchy, between the layer and its former parent.

The effect is that all of the layer’s transformation values, now given in relation to its *zero* layer, which is at the same place, are initialized to: `[0 px, 0 px]` in position, `0°` in rotation, `[100 %, 100 %]` in scale.

Using zeros on multiple layers, it becomes very easy to link their positions with an expression even if they are not at the same location, and even from one composition to another.

Another useful thing is that using zeros makes it easy to recover the original position of a layer, you just have to set all its coordinates to `0`. Adding zeroes to all controllers when rigging a character to be able to retrieve its rest pose is a very common trick.

!!! warning
    When a zero layer has been added, if you want to change the parent of the layer you're working with, be careful to change the parent of the zero layer and not the actual parent of the layer itself, to keep the zero layer in the hierarchy.