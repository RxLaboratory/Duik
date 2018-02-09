# DuAEF
Duduf After Effects ExtendScript Framework

## What's this?

***DuAEF*** is a set of **classes**, **methods** and **tools** to ease the scripting process in **After Effects**, as long as adding features (like [pngquant](https://pngquant.org/), [ffmpeg](https://ffmpeg.org/), or [json](http://json.org/)) not available in After Effects/ExtendScript.
It is very easy to use and **[documented](https://rainbox-dev.github.io/DuAEF_Duik/)**.

## How to use the framework in an After Effects script?

Just include the framework in your script with this simple code:

    #include DuAEF.jsxinc //includes all libraries, as separated files (you'll need the complete /libs/ folder)
    //OR
    #include DuAEF_full.jsxinc //includes the whole framework with one single file.
    
After one of these two lines, all objects and methods from DuAEF will be available.

As you can see, you can either use only the "DuAEF_full.jsxinc" file which contains the whole framework, or "DuAEF.jsxinc" file to keep every library in separated files. In most cases, you should use the "full" file. The second one might be easier to use if you plan to modify or personnalize the framework.

## Comprehensive reference

The framework reference is available in the [docs](docs) folder, **[click here to view it](https://rainbox-dev.github.io/DuAEF_Duik/)**.
    
## Other tools

- The [tools](https://github.com/Rainbox-dev/DuAEF/tree/master/src/tools) subfolder contains some useful scripts, which can be used as example cases of DuAEF use.
- [DuBuilder](https://github.com/Rainbox-dev/DuAEF/tree/master/DuBuilder) is a stand-alone application written in Qt/C++ to build the scripts. It replaces all includes with the actual source code and lets you distribute your scripts as single files instead of a main script with a lot of includes.
You can [download the latest (windows-only) version here](https://rainboxprod.coop/downloads/duaef/DuBuilder_0.0.1-Alpha_win64.zip).

## Libraries

The framework is divided into libraries.  
All libraries are in the [libs](libs) subfolder, the source code is fully documented.  
There are cross-dependencies between the libraries, so you should not include just some of them, it's easier to include the whole framework with the file "DuAEF_full.jsxinc"

- [DuAECore](https://github.com/Rainbox-dev/DuAEF/blob/master/libs/DuAECoreLib.jsxinc) contains After Effects related objects and methods.
- [DuBinary](https://github.com/Rainbox-dev/DuAEF/blob/master/libs/DuBinaryLib.jsxinc) provides tools to include and extract binary files directly in your script files, allowing to deploy only one .jsx files containing any needed image, preset or executable.
- [DuFFMpeg](https://github.com/Rainbox-dev/DuAEF/blob/master/libs/DuFFMpegLib.jsxinc) provides tools to transcode medias using ffmpeg, all in ExtendScript. It includes the FFmpeg binary executable file.
- [DuJS](https://github.com/Rainbox-dev/DuAEF/blob/master/libs/DuJSLib.jsxinc) contains JavaScript/ExtendScript useful tools to manipulate Strings, Arrays, Regular Expressions, Math, etc.
- [DuProcess](https://github.com/Rainbox-dev/DuAEF/blob/master/libs/DuProcessLib.jsxinc) manages external processes. It provides easy-to-use, cross-platform tools to launch command line tools, and a process queue feature.
- [DuQuant](https://github.com/Rainbox-dev/DuAEF/blob/master/libs/DuQuantLib.jsxinc) is an interface to pngquant, a powerful tool to add lossy compression to PNG files, very useful for web design, proxies, or any other case where lightweight PNG images are needed.
- [DuRenderer](https://github.com/Rainbox-dev/DuAEF/blob/master/libs/DuRendererLib.jsxinc) is an interface to the After Effects renderer, both in the UI or as a background renderer. It also provides PNG lossy compression with pngquant and will provide FFmpeg support to add formats to the standard After Effects renderer.
- [JSON](https://github.com/Rainbox-dev/DuAEF/blob/master/libs/JSON.jsxinc) is the standard JavaScript [json](http://json.org) implementation.
