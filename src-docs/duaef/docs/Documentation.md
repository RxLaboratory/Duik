# Documentation contribution

## Editing this documentation and user guides

It is very easy to edit this very documentation and all the user guides of the tools (Dugr, Duik, etc.).

1- You're going to need a **(free) account on _GitHub_**. This is the platform which keeps our source code and documentation. [Sign up here](https://github.com/join)!

2- **Sign in** to your (newly created) account on _GitHub_, then get back to this documentation to browse it as you wish.

3- When you're on a page you want to modify, **click on the _Edit on GitHub_** link at the top of the page.

4- If this is the first time you edit this documentation, **you will be asked to _Fork this repository_**. Do it! Click on the big green button!

## Writing the help for Duik

**[Duik](https://github.com/Rainbox-dev/DuAEF_Duik/wiki/Duik) now includes a contextual help, which can be shown by *Shift+Clicking* on any tool** (if the tool has been documented).  
Writing all this help takes a long time, your help is very welcome!

This contextual help is generated from simple text files you can write and edit with any simple text editor. You can find the existing documentation in [this folder](https://github.com/Rainbox-dev/DuAEF_Duik/tree/master/src/tools%20(ScriptUI)/Duik/help).

If you don't know how to contribute on github, you can simply download the files you want to edit, or create new ones, and submit them by creating a [new issue](https://github.com/Rainbox-dev/DuAEF_Duik/issues/new) and attaching all your files, assembled in a zip archive.

These help files have to comply with this naming convention:
- Each file must be in a subfolder corresponding to the panel of Duik where the tool is included (one of: *Structures, Constraints, Automations, Controllers, Tools, Animation, Animation Tools, Cameras, Import, Export, Settings*).
- Each file is named after the tool it documents, without any extension, all in lower case.
Example, documenting the *Arm* Structure must be done in the file */Sructures/arm*

The documentation has to be written in English first, which is the language used to develop Duik; then everything can be translated to any language. Read the [translation guide](../Translation) to contribute to the translation of Duik.

Don't be afraid to contribute and to make mistakes, you won't break anything nor lead to the end of the world.
Any help is appreciated, even the smallest one.

## Duik User Guide

The [comprehensive user guide](https://github.com/Rainbox-dev/DuAEF_Duik/wiki/Duik-User-Guide) for Duik is available here on Github. If you notice any mistake, or want to contribute more by adding missing pages, images, etc. just sign-up and you will be able to edit the pages very easily!

## Code Documentation

As the [coding guidelines](../Code-Guidelines) state so, we try to document the code at the same time it is written. But there may be some older code which is not documented, or mistakes. If you find any piece of code which is not documented, or mistakes in [the framework reference](https://rainbox-dev.github.io/DuAEF_Duik/), you can help us improve the documentation.

We use [JSDoc](http://usejsdoc.org/) to write all the [code documentation](https://rainbox-dev.github.io/DuAEF_Duik/). The html docs are generated from the JSDoc found in DuAEF and all its inclusions.

- All Namespaces, Classes, and Functions must be clearly documented as soon as they are added. We do not have a documentation writing step, and ask all contributors to document what they add to the framework.

- In very rare cases, we might choose to *not* document some functions, if we think it's better they remain hidden from the documentation, mostly because we think they're too low-level. In this case, a simple comment beginning with `//` must be added just before the declaration of the function to explain briefly what it does, and that it is voluntarily not fully documented.
