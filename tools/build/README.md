# Duik Build tools

This folder contains some useful tools to quickly build (and release) Duik and the Duik API Documentation.

## Dependencies

- [DuBuilder](https://github.com/Rainbox-dev/DuAEF_DuBuilder), and add its path to the PATH environment variable.
- [nodejs](https://nodejs.org/en/)
- [jsdoc](https://jsdoc.app/), installed with nodejs `npm install -g jsdoc`
- Authorize jsdoc to run from powershell: `Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope CurrentUser`
- Install the better-docs theme for jsdoc: `npm install --save-dev better-docs`
- Install the tsd-jsdoc theme for jsdoc: `npm install --save-dev tsd-jsdoc`

## Windows

Run `build-duik.bat` to build Duik in an `output` subfolder. Everything will be built there, and the API doc will be generated and also updated on the repo.

**Important note**: for this batch file to work and to be able to build Duik, you need to have DuBuilder available and in the PATH environment variable of Windows. You also need to add the folder containing DuAEF in the settings of DuBuilder. [See the page about DuBuilder on rainboxlab.org](https://rxlaboratory.org/tools/dubuilder/).

## Mac OS

We still need to build a command file for Mac. Contributions are welcome!
