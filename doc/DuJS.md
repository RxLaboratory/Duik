# DuBinary
JavaScript/ExtendScript useful tools to manipulate strings, Arrays, Regular Expressions, Math, etc.

This library just has a lot of useful methods, see [the reference](https://htmlpreview.github.io/?https://raw.githubusercontent.com/Rainbox-dev/DuAEF/master/doc_html/DuJS.html) to list them.

## Here are some usage examples:

### To use the library, simply include it in the beginning of your scripts

`#include DuJSLib.jsxinc`

### File System

```javascript
// File System tools are in the DuJS.fs object
var fs = DuJS.fs;
// Get all PNG files in the C:\Example folder, including its subfolders:
var pngFolder = new Folder("C:/Example/");
var pngFiles = fs.getFilesInFolder(pngFolder,"*.png");

```

### Regular Expression

```javascript
// Regular Expression tools are in the DuJS.regExp object
var regExp = DuJS.regExp;
// Escape regular expression special characters in a string, which then can be used as a regular expression
var regExpString = regExp.escapeRegExp("A {string} with regular expressions [special] characters!");
// Result: A \{string\} with regular expressions \[special\] characters\!
```

### String

```javascript
// String tools are in the DuJS.string object
var str = DuJS.string;
// replace ALL occurences of a substring in a string
// The last parameter makes the search case insensitive
var newString = str.replace("This is the original string. Really, the ORIGINAL one","original","new",false);
// Result: This is the new string. Really, the new one

// If you omit the last parameter, the search will be case sensitive
var newString = str.replace("This is the original string. Really, the ORIGINAL one","original","new");
// Result: This is the new string. Really, the ORIGINAL one
```
