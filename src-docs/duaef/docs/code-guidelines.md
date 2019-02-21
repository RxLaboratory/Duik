# Code guidelines

We try to follow as closely as possible following conventions, this make our code easily maintainable and readable. Some of our code still needs to be updated to follow these convention, but we do our best to respect them when adding new code.

## Language

We develop DuAEF and Duik with the [Adobe ExtendScript](https://en.wikipedia.org/wiki/ExtendScript) language, which is based on the [ECMAScript](https://fr.wikipedia.org/wiki/ECMAScript) standard, and very close to [JavaScript](https://fr.wikipedia.org/wiki/JavaScript) (and in a lesser way to [ActionScript](https://fr.wikipedia.org/wiki/ActionScript)).

## Documentation

We use [JSDoc](http://usejsdoc.org/) to write all the code documentation. The html docs are generated from the JSDoc found in DuAEF and all its inclusions.

- All Namespaces, Classes, and Functions must be clearly documented as soon as they are added. We do not have a documentation writing step, and ask all contributors to document what they add to the framework.

- In very rare cases, we might choose to *not* document some functions, if we think it's better they remain hidden from the documentation, mostly because we think they're too low-level. In this case, a simple comment beginning with `//` must be added just before the declaration of the function to explain briefly what it does, and that it is voluntarily not fully documented.

## Naming Conventions

- **Class names** and **Namespace names**:
    - Starting with an uppercase
    - Separate words with an uppercase
    - Example: `function PropertyInfo()`, `DuAEF.DuAE.App = {}`
- **Function names**, **Variable names** and **Function argument names**:
    - Starting with a lowercase
    - Separate words with an uppercase
    - Example: `var layerProperties;`, `function doSomething(fisrtArg, secondArg)`
    - This applies also for object members: `this.isReadOnly`

## Formatting

- **Indentation**:
    - Indentation is made with **Tab characters** and **not** spaces characters.
    - Curly braces on their own line:

```js
function Something()
{
...
}
```  

And not:  

```js
function Something() {
...
}
```

- But also:
    - Separate functions with one blank line
    - Terminate files with one blank line
    - Avoid trailing spaces as the end of each file

## Good practices

The implementation of [ExtendScript](https://en.wikipedia.org/wiki/ExtendScript) by Adobe is based on an (very) old [ECMAScript](https://fr.wikipedia.org/wiki/Ecmascript) version. There are some good practises listed here to help avoid common bugs and performance issues.

- Declaring **optionnal arguments** and their default values for the functions:
The first lines of the functions must take care of optionnal arguments. Here is the best way to handle them:  

```js
function doSomething(boolArgument, intArgument)
{
   //Set default to true
   if (typeof boolArgument === 'undefined') boolArgument = true;
   //Set default to 10
   if (typeof intArgument === 'undefined') intArgument = 12;
}
```

- Loops count must be assigned to a variable before the loop, in order to improve performance. There are two ways to do this:

```js
var num = theArray.length;
for (var i = 0; i < num; i++)
{   
   ...
}
```  
Or the variable can be assigned directly inside the `for` statement:  
```js
for (var i = 0, num = theArray.length; i < num; i++)
{   
   ...
}
```
