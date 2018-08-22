# Contribute to the documentation

!!! note
    Anyone can contribute and edit the documentation. In fact, we encourage you to do so!  
    Do not be afraid! As we keep track of all modifications, we can easily fix or revert any mistake you might do.

!!! important
    In order to contribute to the Duduf After Effects Framework (include its tools like Duik, and the documentation), you're going to need a **(free) account on _GitHub_**.  
      This is the platform which keeps our source code and documentation.

      [Sign up here](https://github.com/join)!

## Editing this documentation and the user guides of the tools

**It is very easy to edit this very documentation and all the user guides of the tools (Dugr, Duik, etc.).**

1. **Sign in** to your (newly created) account on _GitHub_, then get back to this documentation to browse it as you wish.

2.  - When you're on a page you want to modify, **click on the _Edit on GitHub_** link at the top of the page.

    - If this is the first time you edit this documentation, **you will be asked to _Fork this repository_**. Do it! Click on the big green button!

3. **Edit the file!** It is written using the [markdown](https://daringfireball.net/projects/markdown/syntax) syntax which you may understant quite easily. There is a tab for previewing your changes at the top of the editor.

4. Once you're done, describe your contribution to help us review it, then click on the green button, **_Propose file change_**.

5. Github will show you what you have modified. If everything is ok, **validate the submission with the _Create pull request_ button**. You can leave another comment if you wish, then validate again with another _Create pull request_ button.

## Writing the contextual help for Duik

**[Duik](Guides/Duik/) now includes a contextual help, which can be shown by _Shift+Clicking_ on any tool**.  
Writing all this help takes a long time, your help is very welcome!

This contextual help is automatically generated from [the wiki of the GitHub repository](https://github.com/Rainbox-dev/DuAEF_Duik/wiki).

1. **Sign in** to your (newly created) account on _GitHub_, then [**browse the wiki as you wish**](https://github.com/Rainbox-dev/DuAEF_Duik/wiki).

2. When you're on a page you want to modify, **click on the _Edit_** button at the top right of the page.

3. **Edit the file!** It is written using the [markdown](https://daringfireball.net/projects/markdown/syntax) syntax which you may understant quite easily. There is a tab for previewing your changes at the top of the editor.

4. Once you're done, explain the change in the _Edit message_ at the bottom of the page, then click on the **_Save Page_** button.

Don't be afraid to contribute and to make mistakes, you won't break anything nor lead to the end of the world.
Any help is appreciated, even the smallest one.

!!! important
    This help is not meant to replace the comprehensive user guide. It is just a quick explanation of what the tools do and how to use them. Try to keep the descriptions short and precise, and keep in mind that people are redirected to the user guide when they click the _More..._ button in the help panel of Duik.

## Code Documentation

As the [coding guidelines](Code-Guidelines.md) state so, we try to document the code at the same time it is written. But there may be some older code which is not documented, or mistakes. If you find any piece of code which is not documented, or mistakes in [the framework reference](Framework-Reference), you can help us improve the documentation.

We use [JSDoc](http://usejsdoc.org/) to write all the [code documentation](Framework-Reference). The html docs are generated from the JSDoc found in DuAEF source code and all its inclusions.

- All Namespaces, Classes, and Functions must be clearly documented as soon as they are added. We do not have a documentation writing step, and ask all contributors to document what they add to the framework.

- In very rare cases, we might choose to *not* document some functions, if we think it's better they remain hidden from the documentation, mostly because we think they're too low-level.  
In this case, a simple comment beginning with `//` must be added just before the declaration of the function to explain briefly what it does, and that it is voluntarily not fully documented.
