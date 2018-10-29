## ![Export anim Icon](img\duik-icons\exportanim-icon-r.png) Animation

![Export Anim ](img\duik-screenshots\S-IOTools\Export\Export-anim-panel.PNG)

You can export After Effects animations with Duik.

1. Select the layers and/or the keyframes to export
2. Click on the *Export Animation* button

The exported data will be stored in a standard and open JSON (text) file.
You can then [re-import the animation](../Import/#Animation) to other projects/layers in After Effects, or use it in another software.

!!! tip
    It can be useful in After Effects to store the motion data appart for the After Effects project file, to make it quicker and easier to re-use it or even build an animation library for any kind of animations.

!!! hint
    This JSON data can be pretty easily parsed in any other software with only a little development work. It can be a game engine, another animation software, conversion to a web animation format... It's up to you, if you know a little bit about writing scripts.  
    The format is not yet documented, but easy to understand just by reading the file. It is very close to how animations are stored in After Effects.

## ![Export rig Icon](img\duik-icons\exportrig-icon-r.png) Rig

![Export rig ](img\duik-screenshots\S-IOTools\Export\export-rig-transp.png)

!!! note
    Still in development

Exports rig descriptions to a JSON file, which is an open format very easy to work with. You can then re-import these rigs in After Effects using Duik, or develop your own tools quite easily to parse them in any other software. XML format may be added in a future version.

## ![Export audition Icon](img\duik-icons\audition-icon-r.png) Audition

![Export Audition ](img\duik-screenshots\S-IOTools\Export\Export-audition.PNG)

If you have some layers with audio in After Effects, you can export the audio to Audition using this tool.

Duik will build a multi-track session in Audition, creating one clip for each layer with audio in the composition. Audio in precomposition is not supported (yet).  
Audio levels and their keyframes will be transfered to audition too, but if the channels (left and right) do not have the same levels, only the average level will be set in Audition.

### ![export audition optn](img\duik-icons\circle-little_r.png) Audition options

This is the *Audition* options panel shown in *Normal* mode:  
![Export Audition optn ](img\duik-screenshots\S-IOTools\Export\Export-audition-optn.PNG)

- **Audio Active Only**: check this to export only the layers with audio enabled. If it is unchecked, muted layers will be exported too.
- **Transcode and conform media**: if this button is checked, Duik will use ffmpeg to extract audio from videos and conform the files before importing them in Audition. This is the best way to import any format, but the media files used in Audition will not be the same than the media files used in After Effects. There is no loss of quality, as Duik will create uncompressed PCM audio (*.wav) matching your settings.
- **Open session in Audition** will automatically launch Audition and open the file after the export is complete.

When you click the *Export* button, you will be asked to save the Audition session file (\*.sesx). The transcoded media files will be stored in a folder called *Imported Files* next to it.
