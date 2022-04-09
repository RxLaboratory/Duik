# Notes about performance

This should be moved to the performance recommendations of the Duik Doc / a dedicated doc.

## General

It is a good idea to regularly close and re-start After Effects.

Do not double click on a project in your file explorer to open it. Start After Effects, then open your project. This may improve performance, and it's a way to avoid many bugs and issues in After Effects. Yup, really.

## Anti-aliasing / Draft mode

Activating the *draft* mode (actally deactivating anti-aliasing) on layers improves the performance by only 10% at most.

## Solids

Expressions in Bezier masks on solids have a very bad impact on performance, and using shape layers is faster in this case.

But without expressions, solids are (much) faster, even with continuous rasterization switched on and *fill* and *stroke* effects applied. For simple designs without expressions in the paths, using a solid with masks, these effects, and continuous rasterization switched on is twice faster than a shape layer.

## Shape layers

Overall performance is very good, unless there is a lot of content.

Performance tends to be a bit better (around 10%) with a single layer than with everything exploded in several layers.

## Table

| Item | Better | Gain | Note |
| ---- | ---- | ---- | ---- |
| Best quality | Draft (without anti-aliasing) | 10% | Can be switched on temporarily for the whole comp, and/or always for guide layers, controllers, bones, etc. |
| Multiple shape layers | Single shape layer with groups | 10% | |
| Expressions in bezier masks on solids | Shape layers | **80%** | For some reason, expressions in masks are much heavier than in shape layer Bézier paths. |
| Simple shape layers (only fills and stroks) | Solids + masks + *Fill* and *Stroke* effects + continuous rasterization | **50%** | If you don't need fancy effects available in shape layers, solids are twice faster to render, even with continuous rasterization (which make them appear as vectors like shape layers) |