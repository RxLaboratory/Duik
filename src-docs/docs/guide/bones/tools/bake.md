# ![](../../../img/duik/icons/bake.svg){style="width:1em;"} Bake bones

Duik bones are standard After Effects shape layers, with a bunch of expressions and simple effects to control them. The bone appearance, the [envelops](../envelops.md)[^1] and the [noodles](../noodles.md)[^2] are all controlled by these effects and expressions, and this reduces the performance, to the point it can be a big issue in complex projects.

*Baking*[*](../../../misc/glossary.md) the selected bones removes all these expressions (and deactivates this dynamic display) to improve the performance.

!!! tip
    Hidden bones, even if they're not baked, should not have a big impact on performance.

!!! note
    The Auto-Rig automatically bakes rigged bones. This can optionally be changed in the Auto-Rig settings though.

▷ Read the [*Advanced / Performance*](../../../advanced/performance.md) section for more tips about how to improve performance in After Effects and using Duik.

## Baking envelops

When baking the envelops of the bones, they become static. This means you won't be able to change or animate their size anymore, and they won't stretch if you pull on the bone either. You can hold the `[Alt]` key when baking bones to keep the dynamic envelops, with a cost on performance.

!!! tip
    Envelops are *just* a group in the shape layer contents. That means that even if you've baked them, you can still manually modify and animate them!

## Baking noodles

As a *static* noodle without expressions and automation doesn't make any sens, Duik will never bake visible and active noodles, but it will automatically remove all deactivated noodles to improve performance.

If you plan to use all noodles, including deactivated ones, you can hold the `[Ctrl]` key when baking bones.

[^1]: *cf. [Bones and Auto-Rig / Envelops](../envelops.md)*

[^2]: *cf. [Bones and Auto-Rig / Noodles](../noodles.md)*
