[Duik](https://github.com/Rainbox-dev/DuAEF_Duik/wiki/Duik-User-Guide) > Input/Output

> After Effects might not be the only software you use in your animation pipeline. Duik comes with some tools to help you import and export assets to and from other softwares.

There is a great variety of things you can do with these interchange tools, and this list is constantly evolving with the creation of new pipelines and third-party softwares.

# Import

This is the *Import* panel shown in *Normal* mode:  
![Import Panel](https://raw.githubusercontent.com/Rainbox-dev/DuAEF_Duik/master/docs/media/wiki/screenshots/panels/import_normal.PNG)

- [***Animation***](https://github.com/Rainbox-dev/DuAEF_Duik/wiki/Import-Animation): Imports animations previously exported in a JSON format (XML may be added in future versions).
- ***Rig***: (still in development) Imports a rig previously exported in a JSON format (XML may be added too).
- ***TVP Clip***: Imports clips made in TVPaint. Layers and animation exposure will be kept, exactly as it is in TVPaint.
- [***Krita Animation***](https://github.com/Rainbox-dev/DuAEF_Duik/wiki/Krita): Imports a traditionnal animation made with Krita and previously saved as CSV.
- [***Storyboarder***](https://github.com/Rainbox-dev/DuAEF_Duik/wiki/WUStoryboarder): Imports storyboard files made with Wonderunit Storyboarder.

# Export

This is the *Export* panel shown in *Normal* mode:  
![Export Panel](https://raw.githubusercontent.com/Rainbox-dev/DuAEF_Duik/master/docs/media/wiki/screenshots/panels/export_normal.PNG)

- [***Animation***](https://github.com/Rainbox-dev/DuAEF_Duik/wiki/Export-Animation) Exports animations to a JSON file, which is an open format very easy to work with. You can then re-import this animation in After Effects using Duik, or develop your own tools quite easily to parse them in any other software. XML format may be added in a future version.
- ***Rig*** (still in development) Exports rig descriptions to a JSON file, which is an open format very easy to work with. You can then re-import these rigs in After Effects using Duik, or develop your own tools quite easily to parse them in any other software. XML format may be added in a future version.
- [***Audition***](https://github.com/Rainbox-dev/DuAEF_Duik/wiki/Audition) Exports compositions with layers with audio to an Adobe Audition multi-track session.
