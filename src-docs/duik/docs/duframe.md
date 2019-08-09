# ![DuFrame Icon](img\duik-icons\frameguide-icon-r.png) **DuFrame**: framing grids and guides.

![frame guide panel](img\duik-screenshots\S-Camera\FrameGuide-panel.PNG)

**Duframe is a very simple tool which creates different types of grids and guides on a Shape Layer, which you can extensively configure, to help the composition of the image.**

![DuFrame GIF](https://rainboxprod.coop/rainbox/wp-content/uploads/frame.gif)

It is [available as a preset (_*.ffx_)](https://github.com/Rainbox-dev/DuAEF_Duik/tree/master/Release/DuFrame) which you can apply to an empty Shape Layer via the menu "Animation/Apply Preset..." in After Effects.  
It is also available in the camera panel of [Duik Bassel](index.md). ([Download here](https://github.com/Rainbox-dev/DuAEF_Duik/tree/master/Release/DuFrame)).

![Default Frame](https://raw.githubusercontent.com/Rainbox-dev/DuAEF_Duik/master/docs/media/wiki/screenshots/duframe/example1.PNG)

This is the default frame and guides added when you apply the preset.

## Frame

The first effect added to the layer lets you configure the frame.

![Frame Effect](https://raw.githubusercontent.com/Rainbox-dev/DuAEF_Duik/master/docs/media/wiki/screenshots/duframe/frameFX.PNG)

* **Format presets**  

    1. *Custom* lets you specify the format using the _Format_ value.
    2. *Composition* will compute the current aspect ratio of the composition, so you can know what it is in the _Format_ value.
    3. The other formats in the list are relatively common formats (some older, some more recent) which can be useful. The current standard for video is *16/9*, and for digital cinema they are *DCP Flat* and *DCP Scope*.

* **Format**  
This value lets you read the format of the selected preset, or set your own format if you've set the preset to *Custom*.
* **Appearance**  
The values in this group are used to adjust the appearance of the frame.
* **Computed Size** (Read only)  
This is the size of the resulting frame, in pixels.

## Grids

The other effects are used to adjust the grids and guides.

You can have as many guides as you want, you just have to duplicate a grid effect to add a new one. The only limitation is that you cannot have twice the same type of grid or guide, but you can always duplicate the layer itself if you need.

You can temporarily hide a specific grid or guide by disabling the corresponding effect.

![Grid Effect](https://raw.githubusercontent.com/Rainbox-dev/DuAEF_Duik/master/docs/media/wiki/screenshots/duframe/gridFX.PNG)

There are a lot of different grids, and if you need another type, just [ask for it](../../../contributing-guide) ;)

* **Safe Frames** displays standard "action" and "title" safe frames, which represents resepectively 80% and 90% of the surface of the entire frame.
* **Digital Frames** shows the standard digital formats (*4/3*, *16/9*, *1.85*, *2.35*) contained in the current frame. This way you can make sure your composition works even if the image is later cropped to another format.
* **Golden Rectangle** divides the image using the [golden ratio](https://en.wikipedia.org/wiki/Golden_ratio).
* **Golden Fibonacci** draws the famous [Fibonacci spiral](https://en.wikipedia.org/wiki/Fibonacci_number), but adjusted using the golden ratio to fit the entire image.
* **Real Fibonacci** draws the true Fibonacci spiral, with its accurate proportions.
* **Isometric** draws an isometric guide very helpful when designing... isometric perspectives.

![Isometric Grid](https://raw.githubusercontent.com/Rainbox-dev/DuAEF_Duik/master/docs/media/wiki/screenshots/duframe/example2.PNG)  
Isometric Grid

![Golden rectangle and Golden Fibonacci](https://raw.githubusercontent.com/Rainbox-dev/DuAEF_Duik/master/docs/media/wiki/screenshots/duframe/example3.PNG)  
Golden rectangle and Golden Fibonacci guides
