# Shapes

To test shapes, Duben creates and renders shapes, and measure the time spent to render them.  
Three ways of drawing shapes are compared:

* Solids with masks, *fill* effect, and *stroke* effect
* Solids with masks, *fill* effect, and *stroke* effect, and continuous rasterization
* Shape layers with a path, fill, and stroke.

The path and stroke size are the same for all methods.
There are transformations applied on the layers too, to test continuous rasterization.
