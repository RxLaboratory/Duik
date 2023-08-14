# ![](../../../img/duik/icons/unlink.svg){style="width:1em;"} Edit Mode

Sometimes, you need to adjust the location of a specific bone, but you don't want to move all its children as well (child bones and art layers). In this case, with the bone selected, toggle the *Edit Mode* using Duik.

Duik will automatically and temporarily unparent all children so you can easiy relocate the bone, and then deactivate the edit mode.

!!! Tip
    Although the *Edit Mode* button in the bones panel works only for bone layers, there is another [*Edit Mode* button in the *Links and Constraints* panel](../../constraints/tools/edit-mode.md) working for all layers.

When the edit mode is toggled, the bone name changes and it turns red to warn you, until you switch it off.

![](../../../img/duik/bones/edit_mode.png)  
*The forarm bone has been toggled to the edit mode.*

!!! warning
    In current versions of Duik, the edit mode does not work if the bones have already been rigged with the Auto-rig or other constraints.
