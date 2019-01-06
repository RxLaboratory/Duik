# Duduf Benchmark: compare performances of After Effects.

[TOC]

!!! note  
    With recent projects we worked on at [Rainbox](https://rainboxprod.coop), we had a lot of performance issues with After Effects, as the projects we've built were very heavy, both for animation with complex character rigs, and for compositing with lots of effects, and an extensive use of expressions, big resolutions, and theater quality...  
    We've made a lot of research to be sure to improve the performance the best we could, with questions like "what version of After Effects is the best for animation, and for rendering?", "is it better to draw a solid with masks, or shape layers?"...  
    **In order to answer those questions, we've run some tests, and built some tools. Duben is one of them.**

Duben is a simple tool to benchmark the performance of an installation of After Effects against other versions and hardware.
Duben has been tested with all versions of After Effects since CS6. Under CS6, it might work too, but the UI results won't be accurate due to script limitations on those older versions.

It measures:

- [x] The performance of the [expressions](duben-expressions.md) evaluation
- [x] The the performance when drawing [shapes](duben-shapes.md)
- [x] The performance when computing [effects](duben-effects.md)
- [x] The performance of the [script](duben-script.md) evaluation and running  
- [x] The performance of the [user interface](duben-ui.md) of After Effects

Not implemented yet, but could be useful:

- [ ] 3D Performance  
- [ ] The performance when rendering specific file formats, especially EXR and PNG

## Results

Running a lot of times the script on different versions of After Effects, and different hardwares, will help us know what is the best version we can use and how the hardware influences the performance of After Effects. These results can help choose a new hardware or which version of After Effects will be the best for a specific project.

We will be compiling all the results you send us, and post the details in an *.ods format (open document spreadsheet) here.

!!! important  
    Although having a look at the results of the community may help you in your decision for buying new hardware or choosing which version of After Effects to use, these results may vary on your own system, they are not to be taken as an absolute reality. Also, this script do not test each and every little thing After Effects can do, your experience with the software has to be taken into account too! The most important thing you have to know is that *the latest version of a software is not necessarily the best for you*, and the "best" hardware sometimes makes only very little difference, if not no difference at all. Choose carefully, and the choice is personal.

!!! note  
    You may also take into account the features you need or not (and how they impact performance). Amongst a few important things, *Mercury Transmit* has been added in CC2014. Controlling shapes with expressions seems interesting in CC2018, but be aware that it has a very, very bad performance. *Master Properties* were added in CC2018 too.

Here's an abstract of the results we've got so far:

### Versions of After Effects

From all our tests so far, there are two choices that seems better than the others:

- If you do a lot of **animation and motion design** without a lot of effects, if you're looking for a very responsive software, the best choice is After Effects CC (12.2) which has by far the most responsive UI along with CC2014. It also draws shapes and masks faster than any other versions.  
- If you're more into **compositing or VFX** and using a lot of effects, CC2018 (15.1) seems to be the best choice, as it is the fastest when rendering effects and is not too bad with other features, except for its (very) laggy User Interface. Try to avoid having too many layers in a composition if you're working with it, or hide the layer controls (in the *View* menu).  
- Note that a good compromise if you don't know what is best for you is using CC2015.3 (13.8) which is just a little bit slower than CC2018 with rendering effects, but seems to have a way better User Interface responsiveness. It has indeed the best overall score.

#### Best Main scores

Category             | Best | Second
---------------------|------|-------
**Best Total Score** | CC2015.3 | CC
**Best Renderer Score** | CC 2018 | CC2017
**Best UX/UI Score** | CC | CC2014

#### Worst Main scores

Category             | Versions
---------------------|--------
**Worst Total Score** | CS6, CC2017
**Worst Renderer Score** | CS4, CS6, CC2014
**Worst UX/UI Score** | CC2017, CC2018

#### Details

Category             | First | Second
---------------------|-------|-------
Best Expressions score | CS4 | CC2017
Best Effects score | CC2018 | CC2017
Best Shapes score | CC | CC2017
Best Scripts score | CC2018
Best UI Score | CC | CC2014

### Hardware notes

!!! error  
    This section still has to be written.

## Documentation

1. [How Duben works, how to use it](duben-how-to.md).
2. [Expressions](duben-expressions.md).
3. [Shapes](duben-shapes.md).
4. [Effects](duben-effects.md).
5. [Script](duben-script.md).
6. [User Interface](duben-ui.md).
7. [Total](duben-total.md).
