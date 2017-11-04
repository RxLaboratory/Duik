# DuBinary
Tools to include and extract binary files directly in your script files, allowing to deploy only one .jsx files containing any needed image, preset or executable.

You can easily convert binaries to text (`*.jsxinc`) files using [the tools provided](../tools) with DuAEF.
You can then include those `*.jsxinc` files inside your scripts.

## Here are some usage examples:

### To use the library, simply include it in the beginning of your scripts

`#include DuBinaryLib.jsxinc`

### To extract and use a binary from its `*.jsxinc` file.

```javascript
//First, include the text representation of the file
#include executable.exe.jsxinc

// Now, a variable called `executable` (the original file name without extension) is available, you can pass this object to the `DuBinary.toFile()` method to extract it and get an ExtendScript File object representation of it.
// Note: This object is an instance of a `DuBinaryFile` class, which contains all information and a string representation of the original binary file

var execFile = DuBinary.toFile(executable);
//Now, the file exists in the file system, and execFile is an ExtendScript File object.

// The `DuBinary.toFile()` method extracts the file to the Application Data folder by default.
execFile.fsName; // C:\users\duduf\appData\Roaming\DuAEF\icon.png (Example on Windows)
```

### You can specify the output file name.

```javascript
#include preset.ffx.jsxinc
var presetFile = DuBinary.toFile(preset,"C:/test/test_preset.ffx");
presetFile.fsName; // C:\test\test_preset.exe");
```

### You can directly use PNG string in ScriptUI without extracting the file

```javascript
#include icon.png.jsxinc
var button = somePanel.add('iconbutton',undefined,icon.binAsString);
```

### If you don't want to include the file in the script

```javascript
var stringFile = new File("C:\test\image.jpg.jsxinc");
var jpgFile = DuBinary.convertToBinaryFile(stringFile); // Warning, this method uses `$.eval()` which is a bad security issue. This will be changed in the future, but for now, do not use this method for anything else than debugging and testing.
```
