# Parent Across Compositions

# Parenting

Sometimes, you may need to parent a layer to another one which is inside a precomposition, or on the contrary you may need to parent a layer to another one outside of the current composition, in a parent composition.

Duik Bassel makes this easy with the "Parent across compositions" tool.

This is the tool, in *Standard Mode*:  
![](https://raw.githubusercontent.com/Rainbox-dev/DuAEF_Duik/master/docs/media/wiki/screenshots/duik-tools/parent_accross_comps.PNG)

1. Select the layers to parent (the children), as you would with standard parenting in After Effects.
2. In the panel of Duik, select the composition containing the layer which you want to be the parent. In the list, only containing and precompositions of the current composition will be displayed. It is not possible to parent across compositions which have no relationship.
3. Select the layer you want to be the parent.
4. Click the "Parent" button. Duik will create a "Locator" in the composition of the parent and another one in the current composition and use them to do the parenting.

!!! hint
     When you parent to a layer inside a precomposition, if you precompose again the precomposition layer, the children layers may move. There is a simple way to prevent this:  
    1. Create a null layer.  
    2. Set its transformations to be exactly the same as those of the precomposition layer - including the anchor point. You can copy and paste them to do it quickly.  
    3. Parent all locators to this new null layer instead of the precomposition layer.  
    4. Now you can precompose the precomposition :)

# Locators (Standard and Expert mode only)

Locators, which are used by the "Parent accross compositions" tool, can be very useful in some cases. They are null layers which follow another layer no matter what and get all its transformations.

You can add a locator in a composition at any time, and the "Extract locators" button will extract all locators from a selected precomposition layer to make them available directly inside the main (parent) composition. This is exactly the principle behind the "Parent across compositions" tool.
