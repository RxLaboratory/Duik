# ![](../../img/duik/icons/composition_settings.svg){style="width:1em;"} Layer Manager

The layer manager is there to help you create, rename, and tag layers.

The layer tags set by Duik are actually markers on the first frame of the layer, showing the type of the layer and other useful information. They also contain more data hidden from the user but needed by some tools like the auto-rig.

![](../../img/duik/tools/layer-tools.png)

The first line are quick buttons to create different kind of layers.

- ![](../../img/duik/icons/null.svg){style="width:1em;"} **Null layer**.  
    This creates a special Null layer made with a shape layer instead of a solid. This has two main advantages: it keeps the project panel tidy without adding to many items, and makes it possible to render the null layer if needed (by just unchecking the *guide layer* option).
- ![](../../img/duik/icons/solid.svg){style="width:1em;"} **Solid**.  
    Similarly to the *null layer* button, this creates a solid made with a shape layer and a simple rectangle. Another advantage here is that you can easily change its size with the *size* property of the rectangle, and its color can be animated.
- ![](../../img/duik/icons/adjustment.svg){style="width:1em;"} **Adjustment layer**.  
    Again, Duik uses a shape layer instead of a solid to create adjustement layers. The additional advantage here is that the content of the layer can be used as the alpha of the adjustment layer (i.e. a mask for the effects).
- ![](../../img/duik/icons/circle.svg){style="width:1em;"} ![](../../img/duik/icons/square.svg){style="width:1em;"} ![](../../img/duik/icons/rounded_square.svg){style="width:1em;"} ![](../../img/duik/icons/polygon.svg){style="width:1em;"} ![](../../img/duik/icons/star.svg){style="width:1em;"} **Primitives**.  
    The next buttons are a way to create primitive shapes perfectly centered in the composition with all their transform values initiated to `0` (or `100 %` for the scale and opacity).
- ![](../../img/duik/icons/bone.svg){style="width:1em;"} **Duik [bone](../bones/index.md)**&nbsp;[^bone] (custom armature).  
- ![](../../img/duik/icons/move_rotate.svg){style="width:1em;"} **Duik [controller](../controllers/index.md)**&nbsp;[^ctrl].  
- ![](../../img/duik/icons/zero.svg){style="width:1em;"} **Duik [zero](../constraints/tools/zero.md)**&nbsp;[^zero].  
- ![](../../img/duik/icons/locator.svg){style="width:1em;"} **Duik [locator](../constraints/tools/locator.md)**&nbsp;[^loc].

[^link]: *cf. [Bones](../bones/index.md) / Tools / [Link Art](../bones/tools/link-art.md)*.

[^bone]: *cf. [Bones](../bones/index.md)*.

[^ctrl]: *cf. [Controllers](../controllers/index.md)*.

[^zero]: *cf. [Links and Constraints](../constraints/index.md) / Tools / [Zero](../constraints/tools/zero.md)*.

[^locator]: *cf. [Links and Constraints](../constraints/index.md) / Tools / [Locator](../constraints/tools/locator.md)*.

!!! tip
    With a "shape solid" created with Duik, you can easily make sure it keeps the size of the composition, even when the composition is resized or if its copied and pasted in another composition. Just add this expression in the *size* property of the rectangle:  
    `[thisComp.width, thisComp.height];`

    You can even easily make sure the solid's size is a fraction of the composition size by multiplying this:  
    `[thisComp.width, thisComp.height] * 0.5;`  
    will set the solid to be half the size (a quarter of the area) of the composition.

The ![](../../img/duik/icons/autorig.svg){style="width:1em;"} ***Auto-Rename and tag*** button is a smart tool which automatically sets the group, side, type, and name of the selected layers according to their original name. It detects words, prefixes and suffixes such as `L` or `Left`, and separators such as `_` or `-` to deduce all attributes which should be associated to the layer, then sets the correct tag and renames them according to the Duik naming scheme (the way Duik names the layers when it creates them).

!!! note
    That's what the [*Link art*](../bones/tools/link-art.md)&nbsp;[^link] tool does, when set to use the layer names.

You can use the last section of the panel to set specific attributes to the selected layers, or copy the attributes from one layer to others using the ![](../../img/duik/icons/eye_dropper.svg){style="width:1em;"} *Pick selected layer* button.

![META](authors:Nicolas "Duduf" Dufresne;license:GNU-FDL;copyright:2022-2023;updated:2023-08-23)
