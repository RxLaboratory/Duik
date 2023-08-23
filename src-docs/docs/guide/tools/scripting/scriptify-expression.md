# ![](../../../img/duik/icons/scriptify_expression.svg){style="width:1em;"} Scriptify Expression

Select a property with an expression to convert this expression to a string easy to include in a `.jsx` script. You can just copy and paste the generated script into your own script to quickly use the expression.

A scriptified expression looks like this:

```js
var propertyNameExp = ['// A comment',
	'var someVar = 12;',
	'var result = someVar * thisLayer.effect("some slider")(1).value;',
	'result;'
	].join('\n');
```

In this example, the `propertyNameExp` is a string, the expression itself, and can be applied as is from the script in any property like:

```js
var prop = app.project.activeItem.layer(1).transform.opacity;
prop.expression = propertyNameExp;
```

Of course, this `propertyNameExp` variable will actually be named after the real name of the property it's extracted from.

The string is first created as an array of lines, which is then joined with the new line character, to make it easier to read and edit in the source code of your script. That's the best way we've found yet to include expressions in scripts. Note that the `join()` function is fast enough so that's never an issue for the performance (Duik does that with hundreds of lines per expressions without any issue). Especially compared to the slowness of After Effects when actually applying the expression in some properties.
