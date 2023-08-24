# ![](../../../img/duik/icons/bake.svg){style="width:1em;"} Bake controllers

Duik controllers may be standard After Effects shape layers, with a bunch of expressions and a simple effect to control them. The controller appearance is controlled by this effect and expressions, and this reduces the performance, to the point it can be a big issue in complex projects.

*Baking*[*](../../../misc/glossary.md) the selected controllers removes all these expressions (and deactivates any dynamic display) to improve the performance.

!!! tip
    Hidden controllers, even if they're not baked, should not have a big impact on performance.

!!! note
    The [*Extract controllers*](../extract.md)&nbsp;[^1] tool automatically bakes extracted controllers. This can optionally be changed in the *Extract controllers* settings though.

▷ Read the [*Advanced / Performance*](../../../advanced/performance.md) section for more tips about how to improve performance in After Effects and using Duik.

[^1]: *cf. [Controllers](../index.md) / [Extract Controllers](../extract.md)*


![META](authors:Nicolas "Duduf" Dufresne;license:GNU-FDL;copyright:2022-2023;updated:2023-07-26)
