# ![](../../../img/duik/icons/locator.svg){style="width:1em;"} Locators

*Locators*, which are used by the ![](../../../img/duik/icons/parent_across_comp.svg){style="width:1em;"} [*Parent across compositions*](../parent.md)&nbsp;[^1] tool, can be very useful in some cases. They are null layers which follow another layer no matter what and get (and expose the values of) all its absolute transformations.

You can add a locator in a composition at any time, and the **![](../../../img/duik/icons/extract_locator.svg){style="width:1em;"} *Extract locators*** tool will extract all locators from a selected precomposition layer to make them available directly inside the main (containing) composition. This is exactly the principle behind the ![](../../../img/duik/icons/parent_across_comp.svg){style="width:1em;"} [*Parent across compositions*](../parent.md)&nbsp;[^1] tool.

When extracting locators, you have the option to use either expressions or essential properties. You can `[Shift] + [Click]` on the ![](../../../img/duik/icons/extract_locator.svg){style="width:1em;"} *Extract locators* button to access this option. This option will also be used when parenting a layer across compositions, if the child layer is in a precomposition (and not a “parent” composition).

!!! warning
    Do not modify the expressions / add keyframes on the transform properties of the locators, as this may break some other Duik tools. If you need to rig locators, just insert another null layer in the hirerachy: as a child of the locator, and parent the initial children of the locator.

[^1]: *cf.* [*Constraints*](../index.md) / [*Parent Constraints*](../parent.md).
