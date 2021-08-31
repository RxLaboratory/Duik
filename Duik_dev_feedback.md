- VSCode debugger not working correctly
- ESTK debugger working great even if 20 years old but :
    - no dark mode, missing a lot of modern stuff (auto completion, beautify, etc)
    - need to code in vscode
    - having to code in vscode and debug in ESTK is not great...
- Errors not thrown correctly, very often error is shown when restarting the panel, the line number may be wrong, the error may not be the right one... But Sometimes it works.
- Other scripts polluting the global namespace.
- No security options per-script, just global settings.
- No threads.
- No signals/events/hooks.
- No real UI integration (scripts are "sandboxed" inside their panels, or popup windows), no access to menus or contextual menus, toolbar, etc.
- Tons of workarounds for (not exhaustive). These don't prevent developping tools, it just makes it much more painful than it should be.
    - invalid objects
    - applying presets
    - debug and throwing errors (see above)
    - Having to call stuff like executeCommand, because the API is far from complete
    - A lot of missing methods (like groups for essential props), puppet tool not scriptable, color management not scriptable...
    - No unique ids, no unique names, no unique index : no way to reliably reference any prop
    - No way to store custom data in project files, except by using workarounds (XMP, comments, markers...)
    - Layouting scriptUI before calling show() is unusually slow (even slower than usual) -> UI build must be delayed after the first user interaction. The Window.layout() method is actually so slow (even when there are no changes/for hidden controls) that each small part of the UI must be built only if needed. And then resizing the window is very slow.
- Crashes very often (can even crash because of a typo in a script. Losing work in a project file because of a typo is... frustrating, to say the least).
- The crash report does not always work or is buggy (crash is sent when trying to insert new line in a comment!)
- App preferences are very long to open but we often need to activate/deactivate the debugger (cf above)
- Loading ScriptUI (the Window.layout() method) is very slow, it's a pain when reloading changes in the script
- Have to work with the beta to make sure everything will work, because there's only 6 months between releases and we have to make sure the script won't break just a couple of months after its release. And because the API lacks many things, it's good to have the few new stuff to work and improve scripts instead of sticking with a previous version. But the beta may (often) have serious issues; for example I've been struggling with memory leaks and performance issues.

Won't talk about the fact Ae uses a very old version of JS missing a lot of useful stuff and the fact that perfomance is so bad for scripts as there should be soon UXP with modern JS available. But we've been struggling with extendscript and scriptUI for two decades, it's more than about time.

Actually, if Adobe would use Python - which is the industry standard - that would save a lot of time for cross-application tools... For now, we have to re-develop everything from scratch specifically for Adobe...

Without exagerating, I could be 25% faster when developping Duik.

And as I'm developping Duik 17 I'm very much afraid of UXP as I now know there will be A LOT of stuff to re-do; I hope it will be more comfortable...