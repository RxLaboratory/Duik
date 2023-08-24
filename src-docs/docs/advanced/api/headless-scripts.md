# Create a headless script with Duik

Using the Duik API, it is very easy to create simple headless scripts, which don't use any user interface, to automate your workflow, or to[ **assign keyboard shortcuts**](shortcuts.md) to Duik features or your own automations for example.

## Create the file

Let's assume [you've already downloaded the API](getting-started.md), and saved it in the same folder where you're creating your headless script.

Now, **create a new text file** with any *text editor*[^1], and name it using the `.jsx` extension, which is the usual extension for After Effects scripts. In this example, we're creating a script which will automatically parent all selected layers to the one selected at last, let's call it `Auto-Parent.jsx`.

First, we're going to add what's is called an *anonymous function*. It's a standard function, but without any name. All the script will be written inside this function; this is a simple way to make sure everything stays contained and nothing leaks to the global space, which could break other scripts.

This is how the script looks like with just this anonymous function:

```js
(function(){

})();
```

The first line creates the function, the last line closes and executes it. We're going to write the script in between.

## Include the API

The first thing to do is to include the API with:

```js
    #include "DuAEF_Duik_api.jsxinc"
```

Note that this will work only if the API is located next to the script, in the same folder. If not, you can use a path[^2] to the API instead of only the name.

After the inclusion, we need to call the [`DuAEF.init` function](http://duik.rxlab.io/DuAEF.html#.init) to prepare everything.

```js
    DuAEF.init( "Auto-Parent", "1.0.0", "Your (company) Name" );
```

The three arguments are:

- A name for the script
- The version of the script
- Your name or the name of your company

## The code to run

Now that everything is ready, we can write the actual code. If this wasn't a headless script, we would start by writing the User Interface, and then show it to the user.

As it's not the case, we just need to tell the API we're going to run without UI.

```js
    DuAEF.enterRunTime();
```

And now, let's do something!

Our goal is to create a script which will parent all selected layers to the one which was selected last. Duik can do that for us, it's the [`autoParent` function](http://duik.rxlab.io/Duik.Constraint.html#.autoParent)!

As Duik comes with many features, they're sorted in *namespaces*, which actually correspond to the panels of Duik. The *Auto-Parent* method is located in the *Constraint* panel and namespace.

```js
    Duik.Constraint.autoParent();
```

And that's all! We've finished the script.

Note that the [`autoParent` function](http://duik.rxlab.io/Duik.Constraint.html#.autoParent) can take one argument, to tell it to parent only orphans (i.e. the layers which do not have any parent yet). If that's what you want you could write `Duik.Constraint.autoParent(true);` instead.

Almost [all features of Duik](duik-features.md) are available as very [simple functions in the API](duik-features.md).

## The complete script

This is the finished script, with some comments[^3] to help you learn and understand.

```js
// First, create an anonymous function.
// This is very important to make sure we don't leak anything
// to the global space and won't break anything by mistake.
(function(){

    // Here we include the Duik API
    #include "DuAEF_Duik_api.jsxinc"

    // Running the init() method of DuAEF is required to setup everything properly.
    DuAEF.init( "Auto-Parent", "1.0.0", "RxLaboratory" );

    // There's no User Interface, which would have to be built here.
    // Let's go right to the execution.

    // This method has to be run once before any other method from the API.
    DuAEF.enterRunTime();

    // Run the Auto-Parent method
    // See: http://duik.rxlab.io/Duik.Constraint.html#.autoParent
    Duik.Constraint.autoParent();

// Close the anonymous function.
})();
```

You can now use this script to assign a **[keyboard shortcut](shortcuts.md)** for parenting layers.

[^1]:
    We recommend [*Visual Studio Code*](https://code.visualstudio.com/), but it can be anything: *Windows Notepad*, [*Notepad++*](https://notepad-plus-plus.org/), [*Brackets*](https://brackets.io/)...  
    It must *not* be a word processor though (like *Microsoft Word* or *LibreOffice Writer*).

[^2]:
    It can be either an **absolute** path, which starts with a `/` on Mac or a drive letter like `C:\\` or `C:/` on Windows, or a **relative** path. Note that path separators can be `/` or `\\`, your choice.  
    Examples: `"C:/my scripts/DuAEF_Duik_api.jsx"` (absolute) or `../DuAEF_Duik_api` (relative, `../` denotes the parent folder).

[^3]:
    In After Effects scripts, comments start with `//`. You can also create a comment block: start it with `/*`, write the comment which can span on several lines, and close it with `*/`.