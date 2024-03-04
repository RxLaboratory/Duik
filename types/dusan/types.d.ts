/**
 * The Duduf ExtendScript Framework.<br />
by {@link https://rxlaboratory.org RxLaboratory} and {@link http://duduf.com Duduf}.<br />
WARNING: all objects marked deprecated will be removed in the version 1.1.0 of the framework.
 * @example
 * // Encapsulate everything to avoid global variables!
// The parameter is either undefined (stand alone script) or the panel containing the ui (ScriptUI)
(function(thisObj)
{
     // Include the framework
     #include "DuESF.jsxinc";
     
     // Running the init() method of DuAEF is required to setup everything properly.
     DuESF.init( "YourScriptName", "1.0.0", "YourCompanyName" );
     
     // These info can be used by the framework to improve UX, but they're optional
     DuESF.chatURL = 'http://chat.rxlab.info'; // A link to a live-chat server like Discord or Slack...
     DuESF.bugReportURL = 'https://github.com/RxLaboratory/DuAEF_Dugr/issues/new/choose'; // A link to a bug report form
     DuESF.featureRequestURL = 'https://github.com/RxLaboratory/DuAEF_Dugr/issues/new/choose'; // A link to a feature request form
     DuESF.aboutURL = 'http://rxlaboratory.org/tools/dugr'; // A link to the webpage about your script
     DuESF.docURL = 'http://dugr.rxlab.guide'; // A link to the documentation of the script
     DuESF.scriptAbout = 'Duduf Groups: group After Effects layers!'; // A short string describing your script
     DuESF.companyURL = 'https://rxlaboratory.org'; // A link to your company's website
     DuESF.rxVersionURL = 'http://version.rxlab.io' // A link to an RxVersion server to check for updates
     
     // Build your UI here, declare your methods, etc.

     // This will be our main panel
     var ui = DuScriptUI.scriptPanel( thisObj, true, true, new File($.fileName) );
     ui.addCommonSettings(); // Automatically adds the language settings, location of the settings file, etc

     DuScriptUI.staticText( ui.settingsGroup, "Hello world of settings!" ); // Adds a static text to the settings panel
     DuScriptUI.staticText( ui.mainGroup, "Hello worlds!" ); // Adds a static text to the main panel
     
     // When you're ready to display everything
     DuScriptUI.showUI(ui);

     // Note that if you don't have a UI or if you don't use DuScriptUI to show it,
     // you HAVE TO run this method before running any other function:
     // DuESF.enterRunTime();
 
})(this);
 */
declare namespace DuESF {
    /**
     * The Current DuESF Version
     */
    const version: DuVersion;
    /**
     * Set to true and enable debug mode if you're a developper
     */
    var debug: boolean;
    /**
     * The name of the script using this instance of DuESF. Must be set by {@link DuESF.init}.
     */
    const scriptName = "DuESF";
    /**
     * The version of the script using this instance of DuESF. Must be set by {@link  DuESF.init}.
     */
    const scriptVersion: DuVersion;
    /**
     * An icon for this script
     */
    var scriptIcon: string;
    /**
     * The url for the forum about the script
     */
    var forumURL: string;
    /**
     * The url for a chat server about the script
     */
    var chatURL: string;
    /**
     * The url for reporting bugs
     */
    var bugReportURL: string;
    /**
     * The url for donations, support, like...
     */
    var donateURL: string;
    /**
     * The url about the script
     */
    var aboutURL: string;
    /**
     * The url to the documentation of the script
     */
    var docURL: string;
    /**
     * The text about the script
     */
    var scriptAbout: string;
    /**
     * The name of the company/organisation/individual developping this tool
     */
    var companyName: string;
    /**
     * The URL to the company's website
     */
    var companyURL: string;
    /**
     * An icon for this company
     */
    var companyIcon: string;
    /**
     * The URL to a rxVersion server used to check for updates
     */
    var rxVersionURL: string;
    /**
     * A URL where people can help localizing the script
     */
    var translateURL: string;
    /**
     * Is this script a prerelease version? This info is used when checking for updates.
     */
    var isPreRelease: boolean;
    /**
     * The current DuESF File
     */
    const file: File;
    /**
     * Enum for states.
     */
    enum State {
        NOT_SET = -1,
        INIT = 0,
        RUNTIME = 1
    }
    /**
     * The current state of the script
     */
    var state: DuESF.State;
    /**
     * True if the script is run for the first time (new or the version has changed since last run)
     */
    const scriptFirstRun = true;
    /**
     * The applicatiosns DuESF can be used with.
     */
    enum HostApplication {
        AFTER_EFFECTS = "aftereffects",
        ILLUSTRATOR = "illustrator",
        PHOTOSHOP = "photoshop",
        INDESIGN = "indesign"
    }
    /**
     * The host application
     */
    var host: DuESF.HostApplication;
    /**
     * The version of the host application
     */
    var hostVersion: DuVersion;
    /**
     * The list of functions to run with {@link DuESF.init}. You can add your own methods here.<br />
    They're run after the settings have been loaded, but before everything else (especially the translator).
     */
    var preInitMethods: ((...params: any[]) => void)[];
    /**
     * The list of functions to run with {@link DuESF.init}. You can add your own methods here.<br />
    They're run after the settings and translator have been loaded.
     */
    var initMethods: ((...params: any[]) => void)[];
    /**
     * The list of functions to run with {@link DuESF.enterRunTime}. You can add your own methods here.<br />
    They're run after the UI has been created and just before runtime
     */
    var enterRunTimeMethods: ((...params: any[]) => void)[];
    /**
     * The settings used by DuESF
     */
    var settings: DuSettings;
    /**
     * This method has to be called once at the very beginning of the script, just after the inclusion of DuESF <code>#include DuESF.jsxinc</code>
     * @param [scriptName = "DuESF"] - The name of your script, as it has to be displayed in the UI and the filesystem
     * @param [scriptVersion = "0.0.0"] - The version of your script, in the form "XX.XX.XX-Comment", for example "1.0.12-Beta". The "-Comment" part is optional.
     * @param [companyName = "RxLaboratory"] - The name of the company/organisation/individual developping this script.
     */
    function init(scriptName?: string, scriptVersion?: string, companyName?: string): void;
    /**
     * This method has to be called once at the end of the script, when everything is ready and the main UI visible (after any prompt or setup during startup).
     */
    function enterRunTime(): void;
    /**
     * Removes all DuESF parts from memory. Call this if you've updated before you reload DuESF.
     */
    function delete(): void;
    /**
     * The settings to store the script specific settings.
     */
    var scriptSettings: DuSettings;
}

/**
 * Assigns a default value to a var if it's undefined.
 * @example
 * foo = def( foo, 12 ); // if foo was undefined, it is now 12, else it's unchanged.
 * @param val - The variable to set
 * @param defaultVal - The default value
 * @returns The var
 */
declare function def(val: any, defaultVal: any): any;

/**
 * Checks if a value is defined. Convenience replacement for `typeof val !== 'undefined`
 * @param val - The value
 */
declare function isdef(val: any): boolean;

/**
 * Improved typeof which returns the type of object instead of 'object'
 * @param exp - The expression to check.
 * @returns The type always in lower case.
 */
declare function jstype(exp: any): string;

/**
 * System tools
 */
declare namespace DuSystem {
    /**
     * The current OS, true if we're on Mac OS
     */
    const mac: boolean;
    /**
     * The current OS, true if we're on Windows
     */
    const win: boolean;
    /**
     * A string identifying the version of the OS; may vary depending on the host application
     */
    const osVersion: string;
    /**
     * Opens a URL in the default browser.<br />
     * @param url - The URL
     */
    function openURL(url: string): void;
}

/**
 * Paths related methods
 */
declare namespace DuPath {
    /**
     * Units to use for sizes.
     */
    enum SizeUnit {
        BIT = "b",
        BYTE = "B",
        KB = "kB",
        MB = "MB",
        GB = "GB",
        TB = "TB"
    }
    /**
     * Joins multiple paths togetther.
     * @param [parts] - The parts to join togehter
     * @param [sep = "/"] - The separator to use. If not defined, will look for the first sep in the path.
     * @returns The final path
     */
    function join(parts?: string[], sep?: string): string;
    /**
     * Converts a number of Bytes to kB or MB or GB or TB
    For conversion to bits, a Byte is considered to be 8 bits.
     * @param size - The size in Bytes to convert
     * @param [to = DuPath.SizeUnit.MB] - The unit to convert to, one of: b, kB, MB, GB, TB
     * @param [decimals = 2] - The number of decimals to round the result
     * @returns The result of the conversion
     */
    function sizeFromBytes(size: int, to?: DuPath.SizeUnit, decimals?: int): float;
    /**
     * Returns the name of the given path or file, as displayed by the filesystem
     * @example
     * DuPath.getName(new File("D:\\code\\open\\Duik\\shape test.test")) // "shape test.test"
    DuPath.getName("D:/code/open/Duik/other shape.test") // "other shape.test"
     * @param [pathOrFile] - The file or the path
     * @returns The basename
     */
    function getName(pathOrFile?: string | File | Folder): string;
    /**
     * Returns the basename of the given path or file
     * @example
     * DuPath.getBasename(new File("D:/code/open/Duik/shape.test")) // "shape"
    DuPath.getBasename("D:/code/open/Duik/shape.test") // "shape"
     * @param [pathOrFile] - The file or the path
     * @returns The basename
     */
    function getBasename(pathOrFile?: string | File): string;
    /**
     * Returns the extension of the given path or file
     * @example
     * DuPath.getExtension(new File("D:/code/open/Duik/shape.other.test")) // "test"
    DuPath.getExtension("D:/code/open/Duik/shape.test") // "test"
     * @param [pathOrFile] - The file or the path
     * @returns The extension
     */
    function getExtension(pathOrFile?: string | File): string;
    /**
     * Switch the extension of the given path. Create a new path from a given path and a given extension.
     * @param [pathOrFile] - The file or the path
     * @param [newExtension] - The new extension
     * @returns The new path
     */
    function switchExtension(pathOrFile?: string | File, newExtension?: string): string;
    /**
     * Generates a new unique name for a file
     * @param newName - The wanted new name
     * @param folder - The folder
     * @param [increment = true] - true to automatically increment the new name if it already ends with a digit
     * @returns The unique name, with a new number at the end if needed.
     */
    function newUniqueName(newName: string, folder: Folder, increment?: boolean): string;
    /**
     * Increments the last number before the extension in a filename
     * @param file - The file
     * @returns The incremented fileName
     */
    function incrementName(file: File): string;
    /**
     * Removes all forbidden characters from a string to be used as a filename
     * @param name - The filename to fix
     * @param [placeholder = '.'] - The string used to replace the forbidden characters
     * @returns The fixed filename
     */
    function fixName(name: string, placeholder?: string): string;
    /**
     * Checks if the given path represents an existing file
     * @param path - The path to check
     */
    function isFile(path: File | Folder | string): boolean;
    /**
     * Checks if the given path represents an existing folder
     * @param path - The path to check
     */
    function isFolder(path: File | Folder | string): boolean;
}

/**
 * Folder related methods
 */
declare namespace DuFolder {
    /**
     * Recursively remove all content from folder and the folder itself. Warning, this does not move files to the recycle bin and can not be undone.
     * @param folder - the path or Folder object to wipe.
     */
    function wipeFolder(folder: string | Folder): void;
    /**
     * Recursively gets all files in a folder using a name filter
    Returns an array of File objects.
     * @param folder - The Folder
     * @param [filter = "*"] - A search mask for file names, specified as a string or a function.
    A mask string can contain question mark (?) and asterisk (*) wild cards. Default is "*", which matches all file names.
    Can also be the name of a function that takes a File or Folder object as its argument. It is called for each file or folder found in the search; if it returns true, the object is added to the return array.
     * @returns The files found.
     */
    function getFiles(folder: Folder, filter?: string | ((...params: any[]) => any)): any[];
    /**
     * Tests if a folder can be read
     * @param folder - The folder
     */
    function canRead(folder: Folder | string): boolean;
    /**
     * Tests if a folder can be written
     * @param folder - The folder
     */
    function canWrite(folder: Folder | string): boolean;
    /**
     * The default user data folder.<br />
    Replaces the Folder.userData provided by ESTK which does not work properly with mac network sessions.<br />
    In windows, the value of %APPDATA% ("C:\Documents and Settings\username\Application Data")<br />
    In Mac OS, "~/Library/Application Support"
     */
    var userData: Folder;
}

/**
 * JS Objects related methods
 */
declare namespace DuJSObj {
    /**
     * Sorts object keys and returns a new sorted object.
     * @param obj - The object to sort.
     * @param [reverse = false] - Set to true to sort in the reverse order.
     * @param [compareFn] - Specifies a function that defines the sort order. Note that this parameter is ignored if reversed is true.<br />
    If omitted, the keys are converted to strings, then sorted according to each character's Unicode code point value.
     * @returns The new sorted object.
     */
    function sort(obj: any, reverse?: boolean, compareFn?: (...params: any[]) => any): any;
    /**
     * Deletes all properties from an object, except a predefined list.
     * @param obj - The object to clear.
     * @param [ignoredProperties] - The properties to keep
     */
    function clear(obj: any, ignoredProperties?: string[]): void;
}

/**
 * Tools for debugging
 */
declare namespace DuDebug {
    /**
     * Set this attribute to a DuDebugLog you have created to automatically add some debug infos to the log (like catched errors).
     */
    var debugLog: DuDebugLog | null;
    /**
     * The log levels
     */
    enum LogLevel {
        VERBOSE = 0,
        DEBUG = 1,
        WARNING = 2,
        CRITICAL = 3,
        FATAL = 4,
        NO_DEBUG = 5
    }
    /**
     * Logs a message to DuDebug.DuDebugLog if it has been set.
     * @param message - The message to log
     * @param [level = DuDebug.LogLevel.DEBUG] - The level of the message
     */
    function log(message: string, level?: DuDebug.LogLevel): void;
    /**
     * This methods shows an alert with an error thrown if DuESF.debug is set to true, and logs it in DuESF.debug.DuDebugLog if it has been set.<br />
    The error is actually thrown only if JS Debugging is enabled in the host application, otherwise it is just shown in an alert.
     * @param error - An error thrown and catched
     */
    function error(error: Error | string): void;
    /**
     * Runs a method/script safely, i.e. enclosed in a try...catch, and logs any error thrown.<br />
    arguments can be added after the first parameter, they will be passed to the callback.<br />
    The callback is enclosed in a function to make sure it does not create global variables.
     * @param callback - The method to run, or a script as a string
     * @returns The return of the callback, null if it fails.
     */
    function safeRun(callback: ((...params: any[]) => any) | string): any;
    /**
     * Inspects a javascript object and outputs all of its attributes
     * @param obj - The object to inspect.
     * @param [ownProperties = true] - Whether to inspect only the own properties of the object.
     * @returns The report.
     */
    function inspect(obj: any, ownProperties?: boolean): string;
    /**
     * Alerts a nice TypeError description, if {@link DuESF.debug} is true, and logs it if there's a log.<br />
    Note that it does not actually throws an error.
     * @param variable - The failing argument
     * @param varName - The failing argument name
     * @param varType - The expected type
     * @param [functionName] - The name or description of the function throwing the error.
     * @returns The (multiline) description for the error
     */
    function throwTypeError(variable: any, varName: string, varType: string, functionName?: string): string;
    /**
     * Alerts a nice UndefinedError description, if {@link DuESF.debug} is true, and logs it if there's a log..<br />
    Note that it does not actually throws an error.
     * @param varName - The name of the arg which should not be undefined
     * @param [functionName] - The name or description of the function throwing the error.
     * @returns The (multiline) description for the error
     */
    function throwUndefinedError(varName: any, functionName?: any): string;
    /**
     * Alerts a nice Error description, if {@link DuESF.debug} is true, and logs it if there's a log..<br />
    Note that it does not actually throws an error.
     * @param message - The message to show
     * @param [functionName] - The name or description of the function throwing the error.
     * @param [error] - A JS error.
     * @param [neverThrow = false] - If true, will prevent actually throwing the error even if the debugger is enabled.
     * @returns The (multiline) description for the error
     */
    function throwError(message: any, functionName?: any, error?: Error, neverThrow?: boolean): string;
    /**
     * Checks if the given variable has the correct type,<br />
    alerts a nice error if not using {@link DuDebug.throwUndefinedError()} or {@link DuDebug.throwTypeError()}.
     * @param variable - The variable to check
     * @param argName - The variable name
     * @param [argType] - The expected type name (as return by {@link jstype()}). If not provided, checks only if the var is undefined
     * @param [functionName] - The name or description of the function throwing the error.
     * @returns The (multiline) description for the error if any and {@link DuESF.debug} is true, false if there's an error and {@link DuESF.debug} is false, true if everything is ok.
     */
    function checkVar(variable: any, argName: string, argType?: string, functionName?: any): string | boolean;
}

/**
 * Constructs a new debug logger
 * @property running - true if the timer is running, false if it is stopped.
 * @param [pathOrFile] - The log file. By default, located next to the script settings file
(if constructed <strong>after</strong> {@link DuESF.init()}).
 * @param [clear = true] - Whether to clear the previous log file before starting
 * @param [logLevel = DuDebug.LogLevel.DEBUG] - The log level.
 * @param [enabled = DuESF.debug] - true to enable the log and start recording
 */
declare class DuDebugLog {
    constructor(pathOrFile?: string | File, clear?: boolean, logLevel?: DuDebug.LogLevel, enabled?: boolean);
    /**
     * The log file.
     */
    static readonly file: File;
    /**
     * The log level.
     */
    static level: DuDebug.LogLevel;
    /**
     * true to enable the log and record logs.
     */
    static enabled: DuDebug.LogLevel;
    /**
     * Logs a message
     * @param message - The message to log
     * @param [level = DuDebug.LogLevel.DEBUG] - The level of the message
     */
    log(message: string, level?: DuDebug.LogLevel): void;
    /**
     * Starts the debugger timer.
     * @param [message] - A message to display in the log
     * @param [level = DuDebug.LogLevel.VERBOSE] - The level of the message
     */
    startTimer(message?: string, level?: DuDebug.LogLevel): void;
    /**
     * Stops the debugger timer.
     * @param [message] - A message to display in the log
     * @param [level = DuDebug.LogLevel.DEBUG] - The level of the message
     */
    stopTimer(message?: string, level?: DuDebug.LogLevel): void;
    /**
     * Checks the time elapsed since the timer has started<br />
    If the timer is not running, it will be started.
     * @param message - A message to display in the log
     * @param [level = DuDebug.LogLevel.DEBUG] - The level of the message
     * @returns The time elapsed in milliseconds
     */
    checkTimer(message: string, level?: DuDebug.LogLevel): int;
    /**
     * true if the timer is running, false if it is stopped.
    */
    running: boolean;
}

/**
 * Constructs a new DuList object
 * @property isCollection - true if the original list is an After Effects Collection, false otherwise
 * @property isArray - true if the original  list is an Array, false otherwise
 * @param [obj] - If a single obj is passed, it's used as the only element in the list
 */
declare class DuList {
    constructor(obj?: any | any[] | Collection | DuList);
    /**
     * True if the original list is an After Effects Collection, false otherwise.
     */
    readonly isCollection: boolean;
    /**
     * True if the original list is an Array, false otherwise
     */
    readonly isArray: boolean;
    /**
     * The original list, an Array or an After Effects Collection.
     */
    readonly list: any[] | Collection;
    /**
     * The current index of the iterator.
     */
    readonly current: number;
    /**
     * True if the iterator is at the start.
     */
    readonly atStart: boolean;
    /**
     * True if the iterator has reached the end.
     */
    readonly atEnd: boolean;
    /**
     * True if the iterator is between 0 and length-1. Note that on creation, the iterator is always invalid, but calling {@link DuList#next DuList.next()} moves it to the beginning and makes it valid.
     */
    readonly valid: boolean;
    /**
     * Returns the number of items in the list
     * @returns The number of items.
     */
    length(): number;
    /**
     * Alias for {@link DuList#length DuList.length()}
     */
    count(): void;
    /**
     * Accessor. First item is always 0, last is always length()-1<br />
    Does not move the iterator to the index; to move the iterator use {@link DuList.goTo} instead.
     * @param index - The index of the item. If it is out of range (negative or > length()-1), returns null
     * @returns The item at the given index.
     */
    at(index: number): any;
    /**
     * Gets the first index of a value, or -1 if not found
     * @param value - The value to find. Must be compatible with the == operand if you don't provide a comparison function
     * @param [comparisonFunction] - A function which compares two values which returns true if the values are considered the same.
     * @returns The index of the value, -1 if not found
     */
    indexOf(value: any, comparisonFunction?: (...params: any[]) => any): number;
    /**
     * Checks if the list contains the item
     * @param value - The value to find. Must be compatible with the == operand if you don't provide a comparison function
     * @param [comparisonFunction] - A function which compares two values which returns true if the values are considered the same.
     */
    contains(value: any, comparisonFunction?: (...params: any[]) => any): boolean;
    /**
     * Checks if the list has duplicated values
     * @returns true if the list has duplicated values. Always false for Ae Collections as they can't have duplicated items.
     */
    hasDuplicates(): boolean;
    /**
     * Returns all duplicated values found in the list
     * @returns The duplicated values. An empty list for Ae Collections as they can't have duplicated items.
     */
    getDuplicates(): DuList;
    /**
     * Removes all duplicated values from the list, and returns them.<br />
    The internal list may be converted to an Array if needed.<br />
    The iterator invalidated.
     * @param [comparisonFunction] - A function which compares two values which returns true if the values are considered the same.
     * @returns The duplicated (and removed) values. An empty list for Ae Collections as they can't have duplicated items.
     */
    removeDuplicates(comparisonFunction?: (...params: any[]) => any): DuList;
    /**
     * Compares two arrays.<br />
    The items in the arrays must be compatible with the == operand if you don't provide a comparison function
     * @param other - The other list
     * @param [comparisonFunction] - A function which compares two values which returns true if the values are considered the same.
     * @param [floatPrecision = -1] - The precision for (float) number comparison, number of decimals. Set to -1 to not use.
     * @returns true if the two arrays contain the same values
     */
    equals(other: any[] | Collection | DuList, comparisonFunction?: (...params: any[]) => any, floatPrecision?: number): boolean;
    /**
     * Returns true if the list is empty
     */
    isEmpty(): boolean;
    /**
     * Gets the last item in the list
     * @returns The last item, null if the list is empty.
     */
    last(): any;
    /**
     * Gets the first item in the list
     * @returns The first item, null if the list is empty.
     */
    first(): any;
    /**
     * Converts the stored list to an Array if it was a Collection.<br />
    This enables the modification of the list, but changes in the list will not be reflected in the application (if a layer is removed from the list, it is not removed in the application).
     */
    convertToArray(): void;
    /**
     * Removes the item at the given index. The internal list may be converted to an Array if needed.<br />
    The iterator invalidated.
     * @param index - The index.
     */
    remove(index: number): void;
    /**
     * Removes the first value from the list. The value must be checkable with the <code>==</code> operator if no <code>comparisonFunction</code> is provided.<br />
    The internal list may be converted to an Array if needed.<br />
    The iterator invalidated.
     * @param value - The value.
     * @param [comparisonFunction] - A function which compares two values which returns true if the values are considered the same.
     */
    removeOne(value: any, comparisonFunction?: (...params: any[]) => any): void;
    /**
     * Removes all occurences of the value from the list. The value must be checkable with the <code>==</code> operator if no <code>comparisonFunction</code> is provided.<br />
    The internal list may be converted to an Array if needed.<br />
    The iterator invalidated.
     * @param value - The value.
     * @param [comparisonFunction] - A function which compares two values which returns true if the values are considered the same.
     * @returns The number of items removed.
     */
    removeAll(value: number, comparisonFunction?: (...params: any[]) => any): number;
    /**
     * Reimplements the Array.sort() method.<br />
    The internal list may be converted to an Array if needed.<br />
    The iterator is invalidated.
     * @param compareFunction - Specifies a function that defines the sort order. If omitted, the array elements are converted to strings, then sorted according to each character's Unicode code point value.
     * @returns The sorted array. Note that the array is sorted in place, and no copy is made.
     */
    sort(compareFunction: (...params: any[]) => any): any[];
    /**
     * Adds one or more elements to the end of the list and returns the new length of the list.<br />
    The internal list may be converted to an Array if needed.
     * @param elements - The element(s) to add to the end of the array. You can pass an array or multiple arguments
     * @returns The new length of the list.
     */
    push(elements: any[]): number;
    /**
     * Mergeserge two lists.<br />
    This method does not change the existing list, but instead returns a new list.
     * @param other - The other list.
     * @returns The new list.
     */
    concat(other: any[] | DuList): DuList;
    /**
     * Adds one or more elements to the end of the list and returns the new length of the list, only if the value is not already in the list<br />
    The internal list may be converted to an Array if needed.
     * @param comparisonFunction - A function which compares two values which returns true if the values are considered the same.
     * @param element0 - The element(s) to add to the end of the array. You can pass an array or a list of separated arguments
     * @returns The new length of the list.
     */
    pushUnique(comparisonFunction: (...params: any[]) => any, element0: any[]): number;
    /**
     * Alias for {@link DuList#push DuList.push()}
     */
    append(): void;
    /**
     * Alias for {@link DuList#pushUnique DuList.pushUnique()}
     */
    appendUnique(): void;
    /**
     * Merges the new array to the current list.<br />
    Note that to the contrary of the <code>Array.concat()</code> method, this does not create a new list, but modifies the current one in place.<br />
    The internal list may be converted to an Array if needed.
     * @param arr - The other array.
     * @returns The new length of the list.
     */
    merge(arr: any[]): number;
    /**
     * Merges the new array to the current list.<br />
    Will only add items if they're not already in the list.<br />
    Note that to the contrary of the <code>Array.concat()</code> method, this does not create a new list, but modifies the current one in place.<br />
    The internal list may be converted to an Array if needed.
     * @param arr - The other array/list.
     * @param [comparisonFunction] - A function which compares two values which returns true if the values are considered the same.
     * @returns The new length of the list.
     */
    mergeUnique(arr: any[] | DuList, comparisonFunction?: (...params: any[]) => any): number;
    /**
     * Reimplementation of the <code>Array.join</code> function.<br />
    For collections, the name of the item will be used, or any other property which makes sense as a string list.
     * @param separator - The separator to use
     * @returns The new length of the list.
     */
    join(separator: string): string;
    /**
     * Replaces all occurences of a value with another value.<br />
    The internal list may be converted to an Array if needed.
     * @param previousValue - The current value
     * @param newValue - The new value
     * @param [comparisonFunction] - A function which compares two values which returns true if the values are considered the same.
     * @returns The number of occurences which were updated.
     */
    replace(previousValue: any, newValue: any, comparisonFunction?: (...params: any[]) => any): number;
    /**
     * Removes the last element of the list and returns it.<br />
    The internal list may be converted to an Array if needed.
     * @returns The last element or null if the list is empty.
     */
    pop(): any | null;
    /**
     * Reinits the iterator, i.e. go to index -1 so that the next call to {@link DuList.next} returns the first item.
     */
    reinitIterator(): void;
    /**
     * Sets the iterator on the index
     * @param index - The index
     * @returns The item at index, or null if the index is invalid
     */
    goTo(index: number): any;
    /**
     * Goes to the end of the Iterator
     * @returns The item at the end, or null if length is 0
     */
    goToEnd(): any;
    /**
     * Goes to the start of the Iterator
     * @returns The item at the start, or null if length is 0
     */
    goToStart(): any;
    /**
     * Increments the Iterator<br />
    Must be called at least once to validate the iterator
     * @returns The next item, or null if there isn't
     */
    next(): any;
    /**
     * Decrements the Iterator
    if it's called while valid is false, goes to the end
     * @returns The previous item, or null if there isn't
     */
    previous(): any;
    /**
     * Executes a function on each item of the List
     * @param callBack - The function to execute, which takes one parameter: an item of the list
     * @param [reverse = false] - Set this to true to iterate from the end.
     */
    do(callBack: (...params: any[]) => any, reverse?: boolean): void;
    /**
     * Checks if this is an Array or an After Effects collection type or a {@link DuList}
     * @param list - The list to check
     * @returns true if this is a Cllection or an Array or a {@link DuList}
     */
    static isList(list: any[] | Collection | DuList): boolean;
    /**
     * Checks if the param is an AE collection or an Array
     * @param collection - The list to check
     * @returns true if collection is a collection, false if it's an array
     */
    static isAECollection(collection: any[] | Collection): boolean;
    /**
     * true if the original list is an After Effects Collection, false otherwise
    */
    isCollection: boolean;
    /**
     * true if the original  list is an Array, false otherwise
    */
    isArray: boolean;
}

/**
 * Constructs a new color object
 * @property red - The red value
 * @property green - The green value
 * @property blue - The blue value
 * @property alpha - The alpha value
 * @param [floatRGBA = [0,0,0,1]] - An [R,G,B,A] float Array.<br />
Negative values are clamped to 0.<br />
Alpha > 1 is clamped to 1.<br />
Colors are stored in 32 bit float to keep the maximum precision.
 */
declare class DuColor {
    constructor(floatRGBA?: float[]);
    /**
     * Returns the color as a float Array with alpha
     * @param [clamped = true] - Set to false to keep the values > 1.0
     * @returns an [R,G,B,A] Array.
     */
    floatRGBA(clamped?: boolean): float;
    /**
     * Returns the color as a float Array without alpha
     * @param [clamped = true] - Set to false to keep the values > 1.0
     * @returns an [R,G,B] Array.
     */
    floatRGB(clamped?: boolean): float;
    /**
     * Returns the color as an 8-bit int Array with alpha
     * @returns an [R,G,B,A] Array.
     */
    intRGBA(): int;
    /**
     * Returns the color as an 8-bit int Array without alpha
     * @returns an [R,G,B] Array.
     */
    intRGB(): int;
    /**
     * true if [R,G,B,A] in the range 0.0 ... 1.0
     * @returns true if the color is valid
     */
    isValid(): boolean;
    /**
     * Returns the hexcode for this color
     * @returns The hex code, without the leading '#'.
     */
    hex(): string;
    /**
     * Returns the hexcode for this color, including the alpha (at the end)
     * @returns The hex code, without the leading '#'.
     */
    hexA(): string;
    /**
     * Returns the HSL values
     * @returns the HSL
     */
    floatHSL(): float[];
    /**
     * Returns the HSLA values
     * @returns the HSL
     */
    floatHSLA(): float[];
    /**
     * Creates a new color darker than the current one
     * @param [ratio = 200] - A percentage: 200 means twice darker, 50 twice lighter
     * @returns The new color
     */
    darker(ratio?: int): DuColor;
    /**
     * Creates a new color lighter than the current one
     * @param [ratio = 200] - A percentage: 200 means twice lighter, 50 twice darker
     * @returns The new color
     */
    lighter(ratio?: int): DuColor;
    /**
     * Compares two colors
     * @param [ignoreAlpha = false] - Set to true to consider colors to be equal if they differ only by their alpha.
     * @param [precision = 4] - The precision to use (the number of decimals to compare).
     * @returns true if the colors are the same.
     */
    equals(ignoreAlpha?: boolean, precision?: int): boolean;
    /**
     * Creates a JSON string representation of the color; Actually an RGBA float Array.
     * @returns The JSON
     */
    toJSON(): string;
    /**
     * Creates a color adjusted according to the brightness setting of the application.<br />
    For now, works only in After Effects
     * @returns The new color
     */
    adjusted(): DuColor;
    /**
     * Creates a new DuColor from a hex code/array
     * @param hexColor - The hexadecimal color
     * @returns The color
     */
    static fromHex(hexColor: string | int[]): DuColor;
    /**
     * Creates a new color from HSL(A) values
     * @param hsl - the HSL(A) values
     * @returns the color.
     */
    static fromHSL(hsl: float[]): DuColor;
    /**
     * Creates a new color from an 8-bit int RGB(A) array
     * @param source - The 8-bit int RGB(A) array
     */
    static fromInt(source: int[]): DuColor;
    /**
     * Creates a color from a JSON string; Actually a JSON RGBA float Array.
     * @param json - The JSON string
     * @returns The color
     */
    static fromJSON(json: string): DuColor;
    /**
     * Generates a random color, with the alpha == 1.0
     * @returns The color
     */
    static random(): DuColor;
    /**
     * Checks if this color is valid ([R,G,B,A] in the range 0.0 ... 1.0)
     * @param color - The floatRGBA color to validate
     * @param [ignoreAlpha = false] - Will return true even if the array does not have any alpha value
     * @returns true if the color is valid
     */
    static isValid(color: float[], ignoreAlpha?: boolean): boolean;
    /**
     * Generates a random color
     * @returns The color as an [R,G,B,A] Array with float values between 0.0 and 1.0
     */
    static randomFloatRGBA(): float[];
    /**
     * Converts an hexadecimal color to a floatRGBA Array
     * @param hexColor - The hexadecimal color
     * @param [isString = true] - Whether hexColor is a string or an Array of int of base 16
     * @returns The color as an [R,G,B,A] Array with float values between 0.0 and 1.0
     */
    static hexToRGB(hexColor: string | int[], isString?: boolean): float[];
    /**
     * Converts an RGB color to a hex string
     * @param rgbColor - The rgb color
     * @returns The color as an hex string
     */
    static rgbToHex(rgbColor: float[]): string;
    /**
     * Converts an HSL color to RGB
     * @param color - The RGBA color array
     * @returns the HSLA color array
     */
    static hslToRgb(color: float[]): float[];
    /**
     * Converts an RGB color to HSL
     * @param color - The HSLA color array
     * @returns the RGBA color array
     */
    static rgbToHsl(color: float[]): float[];
    /**
     * Converts an 8bpc color array to a 32bpc float color array
     * @param color - The RGB(A) color array in 8bpc (0-255 range)
     * @returns the RGBA color array
     */
    static eightBpcToFloat(color: int[]): float[];
    /**
     * The red value
    */
    red: float;
    /**
     * The green value
    */
    green: float;
    /**
     * The blue value
    */
    blue: float;
    /**
     * The alpha value
    */
    alpha: float;
}

declare namespace DuColor {
    /**
     * Enum for predefined colors. float [R,G,B,A]
     */
    enum Color {
        TRANSPARENT = "",
        BLACK = "",
        WHITE = "",
        OBSIDIAN = "",
        ABYSS_GREY = "",
        VERY_DARK_GREY = "",
        DARK_GREY = "",
        LIGHT_GREY = "",
        VERY_LIGHT_GREY = "",
        RAINBOX_RED = "",
        ORANGE = "",
        YELLOW_ORANGE = "",
        YELLOW = "",
        GREEN = "",
        LIGHT_GREEN = "",
        LIGHT_BLUE = "",
        LIGHT_PURPLE = "",
        AE_DARK_GREY = "",
        AFTER_EFFECTS_BLUE = "",
        RX_PURPLE = "",
        APP_BACKGROUND_COLOR = "",
        APP_HIGHLIGHT_COLOR = "",
        APP_TEXT_COLOR = "",
        AE_ORANGE = ""
    }
}

/**
 * Constructs a new DuSettings instance.
 * @property namespace - A namespace to group your settings.
 * @property file - The file to store the settings
 * @property data - The settings as a js object
 * @param [namespace = DuESF.scriptName] - A namespace to group your settings.
 * @param [file = Folder.myDocuments/namespace/namespace_settings.json] - The file to store the settings
 */
declare class DuSettings {
    constructor(namespace?: string, file?: File | string);
    /**
     * loads data from the settings file
     */
    load(): void;
    /**
     * Saves data to the file.<br />
    Warning: DuESF does not check if it has write access on the files, you should check that first using methods specific to the host application.
     * @returns true if the file has been correctly written
     */
    save(): boolean;
    /**
     * Sets the file to be used to save the settings
     * @param file - The file or path to the file
     */
    setFile(file: File | string): void;
    /**
     * Reset the settings to their default values (removes the settings file!)
     */
    reset(): void;
    /**
     * Gets a value from the settings. The key can be a path separated by /
     * @param key - The setting to get
     * @param [defaultValue = null] - The default value if the key is not set in the settings
     * @returns The value
     */
    get(key: string, defaultValue?: any): any;
    /**
     * Sets a value to the settings. The key can be a path separated by /
     * @property key - The setting to set
     * @property value - The value to set
     */
    set(): void;
    /**
     * A namespace to group your settings.
    */
    namespace: string;
    /**
     * The file to store the settings
    */
    file: File;
    /**
     * The settings as a js object
    */
    data: any;
}

/**
 * gettext.jsxinc.<br />
by {@link http://duduf.com Duduf} and Guillaume Potier.<br />
 * @example
 * // Encapsulate everything to avoid global variables!
(function()
{
        #include "../lib/gettext.js"

        i18n = i18n();

        i18n.setMessages('messages', 'en', {
            'Test failed!': 'Test successfull!',
        }, 'nplurals=2; plural=n>1;');

        i18n.setLocale('en');

        alert(i18n._('Test failed!'));
})();
 */
declare namespace translationEngine { }

/**
 * The translation engine
 */
declare var i18n: translationEngine;

/**
 * JSON parser.
 */
declare namespace JSON { }

/**
 * 2D transformation matrix object initialized with identity matrix.
 * @property a - scale x
 * @property b - shear y
 * @property c - shear x
 * @property d - scale y
 * @property e - translate x
 * @property f - translate y
 */
declare class Matrix {
    /**
     * Create and transform a new matrix based on given matrix values, or
    provide SVGMatrix or a (2D) DOMMatrix, WebKitCSSMatrix or another
    instance of a generic matrix.
     * @example
     * var m = Matrix.from(1, 0.2, 0, 2, 120, 97);
    var m = Matrix.from(domMatrix, ctx);
    var m = Matrix.from(svgMatrix);
    var m = Matrix.from(matrix);
     * @param a - number representing a (scale x) in [a-f], or a Matrix object containing properties a-f.
     * @param [b] - b property (shear y) if a is not a matrix object, or optional canvas 2D context.
    If vector is input this will be pre-translate for x.
     * @param [c] - c property (shear x)
     * @param [d] - d property (scale y)
     * @param [e] - e property (translate x)
     * @param [f] - f property (translate y)
     * @param [context] - optional canvas context to synchronize
     * @returns - new Matrix instance
     */
    static from(a: any, b?: any, c?: number, d?: number, e?: number, f?: number, context?: CanvasRenderingContext2D): Matrix;
    /**
     * Short-hand to reset current matrix to an identity matrix.
     */
    reset(): Matrix;
    /**
     * Rotates current matrix by angle (accumulative).
     * @param angle - angle in degrees
     */
    rotate(angle: number): Matrix;
    /**
     * Converts a vector given as `x` and `y` to angle, and
    rotates (accumulative). x can instead contain an object with
    properties x and y and if so, y parameter will be ignored.
     */
    rotateFromVector(x: number | any, y?: number): Matrix;
    /**
     * Scales current matrix accumulative.
     * @param s - scale factor [x, y]. 1 does nothing, any third value (Z) is ignored.
     */
    scale(s: number[]): Matrix;
    /**
     * Apply shear to the current matrix accumulative.
     * @param sx - amount of shear for x
     * @param sy - amount of shear for y
     */
    shear(sx: number, sy: number): Matrix;
    /**
     * Apply skew to the current matrix accumulative. Angles in radians.
    Also see [`skewDeg()`]{@link Matrix#skewDeg}.
     * @param ax - angle of skew for x
     * @param ay - angle of skew for y
     */
    skew(ax: number, ay: number): Matrix;
    /**
     * Set current matrix to new absolute matrix.
     * @param a - scale x
     * @param b - shear y
     * @param c - shear x
     * @param d - scale y
     * @param e - translate x
     * @param f - translate y
     */
    setTransform(a: number, b: number, c: number, d: number, e: number, f: number): Matrix;
    /**
     * Translate current matrix accumulative.
     * @param t - translation [x, y]. Any third value (Z) is ignored.
     */
    translate(t: number[]): Matrix;
    /**
     * Multiplies current matrix with new matrix values. Also see [`multiply()`]{@link Matrix#multiply}.
     * @param a2 - scale x
     * @param b2 - skew y
     * @param c2 - skew x
     * @param d2 - scale y
     * @param e2 - translate x
     * @param f2 - translate y
     */
    transform(a2: number, b2: number, c2: number, d2: number, e2: number, f2: number): Matrix;
    /**
     * Multiplies current matrix with source matrix.
     * @param m - source matrix to multiply with.
     */
    multiply(m: Matrix | Matrix | DOMMatrix | SVGMatrix): Matrix;
    /**
     * Get an inverse matrix of current matrix. The method returns a new
    matrix with values you need to use to get to an identity matrix.
    Context from parent matrix is not applied to the returned matrix.
     * @param [cloneContext = false] - clone current context to resulting matrix
     * @returns - new Matrix instance
     */
    inverse(cloneContext?: boolean): Matrix;
    /**
     * Decompose the current matrix into simple transforms using QR.
     * @returns - an object containing current decomposed values (translate, rotation, scale, skew)
     */
    decompose(): any;
    /**
     * Returns the determinant of the current matrix.
     */
    determinant(): number;
    /**
     * Apply current matrix to `x` and `y` of a point.
    Returns a point object.
     * @param pt - the point to transform ([x, y]).<br />
    If an optionnal Z value is provided, it will be kept without transformation.
     * @returns A new transformed point [x, y]. If pt had a third value, it is returned too, as it was without transformation.
     */
    applyToPoint(pt: number[]): number[];
    /**
     * Returns true if matrix is an identity matrix (no transforms applied).
     */
    isIdentity(): boolean;
    /**
     * Returns true if matrix is invertible
     */
    isInvertible(): boolean;
    /**
     * The method is intended for situations where scale is accumulated
    via multiplications, to detect situations where scale becomes
    "trapped" with a value of zero. And in which case scale must be
    set explicitly to a non-zero value.
     */
    isValid(): boolean;
    /**
     * Compares current matrix with another matrix. Returns true if equal
    (within epsilon tolerance).
     * @param m - matrix to compare this matrix with
     */
    isEqual(m: Matrix | Matrix | DOMMatrix | SVGMatrix): boolean;
    /**
     * Clones current instance and returning a new matrix.
     * @param [noContext = false] - don't clone context reference if true
     * @returns - a new Matrix instance with identical transformations as this instance
     */
    clone(noContext?: boolean): Matrix;
    /**
     * Generates a string that can be used with CSS `transform`.
     * @example
     * element.style.transform = m.toCSS();
     */
    toCSS(): string;
    /**
     * Generates a `matrix3d()` string that can be used with CSS `transform`.
    Although the matrix is for 2D use you may see performance benefits
    on some devices using a 3D CSS transform instead of a 2D.
     * @example
     * element.style.transform = m.toCSS3D();
     */
    toCSS3D(): string;
    /**
     * Returns a JSON compatible string of current matrix.
     */
    toJSON(): string;
    /**
     * scale x
    */
    a: number;
    /**
     * shear y
    */
    b: number;
    /**
     * shear x
    */
    c: number;
    /**
     * scale y
    */
    d: number;
    /**
     * translate x
    */
    e: number;
    /**
     * translate y
    */
    f: number;
}

/**
 * Adds a new Math.seedRandom() method, used as a workaround for a bug in Math.random() with After Effects on Mac OS
 */
declare function seedRandom(): int;

/**
 * ColorPicker v2.0 for Adobe scripting.<br />
2016-5-11 -> 2016-7-24<br />
This is a rebuilt color picker for Adobe scripting.<br />
Support all Adobe softwares such as PS,AI,PR and so on.<br />
See usage on {@link http://github.com/Smallpath/AdobeColorPicker}
 */
declare class colorPicker {
}

/**
 * Base64 codec.
 */
declare namespace Base64 { }

/**
 * Constructs a new version object
 * @property fullVersion - The complete version name
 * @property versionString - The Major.Minor part as a string
 * @property version - The Major.Minor part as a float
 * @property build - The build is -1 if it cannot be parsed as an int, like "alpha".
 * @property buildString - The build as a string
 * @param [version = '1.0.0'] - The version in the form Major.Minor.Patch
 */
declare class DuVersion {
    constructor(version?: string);
    /**
     * Checks if this version is higher than another.
     * @param otherVersion - The version to compare with.
     * @returns true if this version is more recent than otherVersion
     */
    higherThan(otherVersion: DuVersion | string): boolean;
    /**
     * Checks if this version is higher than or equals another.
     * @param otherVersion - The version to compare with.
     * @returns true if this version is more recent than or the same as otherVersion
     */
    atLeast(otherVersion: DuVersion | string): boolean;
    /**
     * Checks if this version is the same as another.
     * @param otherVersion - The version to compare with.
     * @returns true if this version is the same
     */
    equals(otherVersion: DuVersion | string): boolean;
    /**
     * Compares two versions of an application
     * @param vA - The first version
     * @param [vB = DuESF.scriptVersion] - The other version
     * @returns True if vA is more recent than vB (strict, if they're equal it will return false)
     */
    static compare(vA: string | DuVersion, vB?: string | DuVersion): boolean;
    /**
     * The complete version name
    */
    fullVersion: string;
    /**
     * The Major.Minor part as a string
    */
    versionString: string;
    /**
     * The Major.Minor part as a float
    */
    version: float;
    major: int;
    minor: int;
    patch: int;
    /**
     * The build is -1 if it cannot be parsed as an int, like "alpha".
    */
    build: int;
    /**
     * The build as a string
    */
    buildString: string;
}

declare namespace DuVersion {
    /**
     * Information got from an update query on a RxVersion server, as returned by {@link DuVersion.checkUpdate DuVersion.checkUpdate()}.
     * @property update - Whether this script needs an update.
     * @property version - The available version.
     * @property name - The name of the script.
     * @property description - A description of the version.
     * @property downloadURL - The link to download the current version.
     * @property changelogURL - The link to the changelog.
     * @property donateURL - The link to make a donation.
     * @property date - The date of the version, in the form "yyyy-MM-dd hh:mm:ss".
     * @property message - Information about success/errors.
     * @property success - false if the query failed and the version could not be retrieved.
     * @property accepted - false if the query was wrong or the server did not recognize it. Should always be true.
     *
     * /**
    Checks if a new version is available for the current script,<br/>
    using the DuESF.rxVersionURL if it is set.
     */
    type UpdateReply = {
        update: boolean;
        version: string;
        name: string;
        description: string;
        downloadURL: string;
        changelogURL: string;
        donateURL: string;
        date: string;
        message: string;
        success: boolean;
        accepted: boolean;
    };
}

/**
 * fuzzy-search.jsxinc.<br />
by {@link http://duduf.com Duduf} and Wouter Rutgers.<br />
 * @example
 * // Encapsulate everything to avoid global variables!
(function() {
    #include "fuzzy-search.jsxinc"

    var people = [{
    name: {
        firstName: 'Jesse',
        lastName: 'Bowen',
    },
   state: 'Seattle',
    }];

    var searcher = new FuzzySearch(people, ['name.firstName', 'state'], {
        caseSensitive: true,
    });
    var result = searcher.search('ess');
})();
 */
declare class FuzzySearch {
    constructor();
    /**
     * Searches for items in the haystack
     * @param query - The string to search
     * @returns The matching results. Objects with two attributes: <code>item</code> and <code>score</code>.
     */
    search(query: string): Obbject[];
    /**
     * Caculates the score of a string against a query
     * @param item - The string to test
     * @param query - The string to search
     * @param [caseSensitive = false] - Whether to check the case or not
     * @returns The score, a positive value.<br/>
    - <code>0</code>: no match<br/>
    - <code>1</code>: perfect match<br/>
    - <code>>1</code>: the lower the score, the better the match<br/>
     */
    static match(item: string, query: string, caseSensitive?: boolean): float;
}

/**
 * JavaScript String related methods
 */
declare namespace DuString {
    /**
     * Counts the number of occurences of item in string
     * @param string - The string where to count
     * @param item - the string to search
     * @returns the number of occurences
     */
    function occurences(string: string, item: string): int;
    /**
     * Parses the string as a boolean.<br />
    The following strings are falsy:<br />
    'false', '0', '', 'null', 'undefined', 'NaN'.<br />
    Note that any string consisiting only in any number of 0 will be falsy.
     * @param string - The string to parse
     * @param [caseSensitive = true] - When false, 'FALSE', 'nan', 'UNdefined'... for example will be falsy too.
     * @returns The resulting boolean
     */
    function parseBool(string: string, caseSensitive?: boolean): boolean;
    /**
     * Replaces <strong>all</strong> occurences of a substring by another and returns the new string.
     * @param string - The original string
     * @param find - The substring to replace
     * @param replace - The new substring to insert
     * @param [caseSensitive = true] - Optionnal. Do a case sensitive search of substring.
     * @returns The new string
     */
    function replace(string: string, find: string, replace: string, caseSensitive?: boolean): string;
    /**
     * Replaces all occurences of "{#}" in the string by the args.
     * @param string - The original string
     * @param args - The arguments
     * @returns The new string
     */
    function args(string: string, args: string[] | string): string;
    /**
     * Checks if a string ends with a given suffix
     * @param str - The string to check
     * @param suffix - The suffix
     * @returns Whether the string ends with the given suffix or not
     */
    function endsWith(str: string, suffix: string): boolean;
    /**
     * Checks if a string starts with a given prefix
     * @param str - The string to check
     * @param suffix - The suffix
     * @returns Whether the string ends with the given suffix or not
     */
    function startsWith(str: string, suffix: string): boolean;
    /**
     * Generates a new unique string (numbered)
     * @param newString - The wanted new string
     * @param stringList - The list of strings where the new one must be generateUnique
     * @param [increment = true] - true to automatically increment the new name if it already ends with a digit
     * @param [isFile = false] - when generating name for files, setting this to true will add the increment before the extension
     * @returns The unique string, with a new number at the end if needed.
     */
    function generateUnique(newString: string, stringList: string[], increment?: boolean, isFile?: boolean): string;
    /**
     * Returns a copy of the string without leading and trailing white spaces.
     * @param str - The string to trim
     * @returns The trimmed string
     */
    function trim(str: string): string;
    /**
     * Returns a copy of the string without leading white spaces.
     * @param str - The string to trim
     * @returns The trimmed string
     */
    function leftTrim(str: string): string;
    /**
     * Returns a copy of the string without trailing white spaces.
     * @param str - The string to trim
     * @returns The trimmed string
     */
    function rightTrim(str: string): string;
    /**
     * Returns a copy of the string without leading and trailing white spaces, and without any new line, leaving only standard spaces.
     * @param str - The string to trim
     * @returns The trimmed string
     */
    function fullTrim(str: string): string;
    /**
     * Returns a copy of the string without trailing white spaces and numbers.
     * @param str - The string to trim
     * @returns The trimmed string
     */
    function trimNumbers(str: string): string;
    /**
     * Converts a size in Bytes to a human-readable string with a fitting unit automatically chosen<br />
    Note that the conversion uses 1024 Bytes per kB.
     * @param size - The size in Bytes
     * @returns The stringified size
     */
    function fromSize(size: int): string;
    /**
     * Generates a camel case text from a snake case or standard one
     * @param text - The source text
     * @returns The camelCase version of the text
     */
    function toCamelCase(text: string): string;
    /**
     * Sets the first character of the text to be capital case if it's a letter.<br />
    Note that the string is left trimmed first: any leading white space is removed.
     * @param text - The source text
     * @returns The new text
     */
    function capitalize(text: string): string;
    /**
     * Sets the first character of the text to be lower case if it's a letter.<br />
    Note that the string is left trimmed first: any leading white space is removed.
     * @param text - The source text
     * @returns The new text
     */
    function unCapitalize(text: string): string;
    /**
     * Caculates the score of a string against a query, using Duduf's fuzzy-search.jsxinc
     * @param item - The string to test
     * @param query - The string to search
     * @param [caseSensitive = false] - Whether to check the case or not
     * @returns The score, a positive value.<br/>
    - <code>0</code>: no match<br/>
    - <code>1</code>: perfect match<br/>
    - <code>>1</code>: the lower the score, the better the match<br/>
     */
    function match(item: string, query: string, caseSensitive?: boolean): float;
    /**
     * Same as JS String.split except that it works with a list of separators too
     * @param str - The string to split
     * @param separators - The separator(s)
     * @returns The array of strings.
     */
    function split(str: string, separators: string | string[] | DuList<string>): string[];
    /**
     * Splits the string into same-length substrings.
     * @param str - The string to split
     * @param subStringLength - The length of the substrings
     * @returns The array of strings. The last one may be shorter than <code>subStringLength</code> if the original string length is not a multiple of it.
     */
    function chunk(str: string, subStringLength: int): string[];
    /**
     * Checks if the string contains one of the substrings
     * @param str - The string to check
     * @param subStrs - The substrings to look for
     */
    function contains(str: string, subStrs: string | string[] | DuList<string>): boolean;
    /**
     * Counts the spaces at the beginning of the line
     * @param str - The string
     */
    function indentation(str: string): int;
    /**
     * Checks if the string is indented (starts with a space or tab)
     * @param str - The string to test
     */
    function isIndented(str: string): boolean;
    /**
     * Checks if this string represents a float (strict, the string must include a ".")
     * @param str - The string
     */
    function isFloat(str: string): boolean;
    /**
     * Checks if this string represents an integer
     * @param str - The string
     */
    function isInt(str: string): boolean;
    /**
     * Checks if this string represents a number (int or float)
     * @param str - The string
     */
    function isNumber(str: string): boolean;
}

/**
 * Yaml Parser/Reader
 */
declare namespace YAML {
    /**
     * Parses a string formatted in yaml.
     * @param yaml_string - The yaml to parse
     * @returns null if the yaml could not be parsed
     */
    function load(yaml_string: string): any | null;
    /**
     * Dumps some data as a yaml string.
     * @param data - The data
     * @param [numIdents = 2] - The indentation
     * @returns The Yaml
     */
    function dump(data: any, numIdents?: int): string;
}

/**
 * File related methods
 */
declare namespace DuFile {
    /**
     * The list of legit characters for base64 encoding
     */
    var base64Chars: string[];
    /**
     * Checks if the given path exists
     * @param [path] - The file path
     * @returns True or false
     */
    function exists(path?: string): boolean;
    /**
     * Reads the first line of a file and return its content
     * @param file - The file
     * @returns The content
     */
    function readFirstLine(file: File | string): string;
    /**
     * Reads a whole file and return its content
     * @param file - The file
     * @param [encoding = 'UTF-8'] - The text encoding
     * @returns The content
     */
    function read(file: File | string, encoding?: string): string;
    /**
     * Writes a text file
     * @param file - The file
     * @param content - The content to write
     * @param [append = false] - Appends instead of replacing
     * @param [encoding = 'UTF-8'] - The text encoding
     * @returns true if the file has been correctly written
     */
    function write(file: File, content: string, append?: boolean, encoding?: string): boolean;
    /**
     * Writes a line in a text file
     * @param file - The file
     * @param content - The content to write
     * @param [append = false] - Appends instead of replacing
     * @param [encoding = 'UTF-8'] - The text encoding
     * @returns true if the file has been correctly written
     */
    function writeln(file: File, content: string, append?: boolean, encoding?: string): boolean;
    /**
     * Parses a JSON file
     * @param file - The file
     * @returns The content or null if the file couldn't be parsed
     */
    function parseJSON(file: File): any | null;
    /**
     * Saves a js object to a JSON file
     * @param obj - The object to save
     * @param file - The file or URI
     * @returns true if the file has been correctly written
     */
    function saveJSON(obj: any, file: File | string): boolean;
    /**
     * Parses a CSV file
     * @param file - The file
     * @param [delimiter = ','] - The delimiter used
     * @param [textSeparator = '"'] - The separator for texts
     * @returns The content (a two-dimensionnal Array) or null if the file couldn't be parsed
     */
    function parseCSV(file: File, delimiter?: string, textSeparator?: string): string[] | null;
    /**
     * Encodes a file to a base64 string.
     * @param file - The file or its path
     * @returns The base64 string
     */
    function toBase64(file: string | File): string;
    /**
     * Checks if the base64 string seems valid
     * @param b64 - The string to check
     */
    function checkBase64(b64: string): boolean;
    /**
     * Writes a file from a base64 string.
     * @param b64 - The base64 string
     * @param file - The destination file or its path
     * @returns The File object or null if it fails
     */
    function fromBase64(b64: string, file: string | File): File | null;
    /**
     * Shows the default save file dialog and returns the file selected by the user.<r />
    If the user ommits the extension, the default extension will be appended (Mac OS fix).
     * @param prompt - The prompt text, displayed if the dialog allows a prompt.
     * @param [filter = ''] - The file type filter (windows only)
     * @param [defaultExtension = ''] - The default extension
     * @returns The file or null if the user cancels
     */
    function saveDialog(prompt: string, filter?: string, defaultExtension?: string): File | null;
    /**
     * Gets the number of a frame from an file/image sequence<br />
    The number must be right before the extension.
     * @param path - The path of the frame
     */
    function getSequenceNumber(path: string): void;
    /**
     * Moves a file to a new location
     * @param file - The file
     * @param newURI - The new URI/Path (including file name)
     * @returns the new file object, or null if it could not be moved
     */
    function move(file: string | File, newURI: string | File): File | null;
}

/**
 * JavaScript Regular Expression related methods
 */
declare namespace DuRegExp {
    /**
     * Escape reg exp reserved characters from a string to build a regular expression compatible string
     * @param string - The string to escape
     * @returns The escaped string
     */
    function escape(string: string): string;
    /**
     * The set containing javascript symbols ( +, -, [, etc.). Useful when parsing javascript code.
     */
    const javascriptSymbols = "[\\s=!/*\\-+%()[\\]{};:.]";
    /**
     * The set containing javascript symbols ( +, -, [, etc.) except the dot. Useful when parsing javascript code.
     */
    const javascriptSymbolsNoDot = "[\\s=!/*\\-+%()[\\]{};:]";
    /**
     * The set containing authorized characters for javascript variable. Useful when parsing javascript code.
     */
    const javascriptVarChars = "[a-zA-Z0-9_]";
}

/**
 * Number related methods
 */
declare namespace DuNumber {
    /**
     * Converts a number to a string, adding optionnal leading zeroes
     * @param num - The number
     * @param numDigits - The number of digits in the string. Adds leading zeroes
     * @param [base = 10] - The conversion base
     * @returns The number as a string
     */
    function toString(num: number, numDigits: int, base?: int): string;
}

/**
 * Math related methods
 */
declare namespace DuMath {
    /**
     * Enum for locations.
     */
    enum Location {
        TOP = 1,
        TOP_RIGHT = 2,
        RIGHT = 3,
        BOTTOM_RIGHT = 4,
        BOTTOM = 5,
        BOTTOM_LEFT = 6,
        LEFT = 7,
        TOP_LEFT = 8,
        CENTER = 0
    }
    /**
     * Checks if the given location is on the right side
     * @param location - The location
     */
    function isLocationRight(location: DuMath.Location): boolean;
    /**
     * Checks if the given location is on the center on the horizontal axis
     * @param location - The location
     */
    function isLocationHCenter(location: DuMath.Location): boolean;
    /**
     * Checks if the given location is on the left side
     * @param location - The location
     */
    function isLocationLeft(location: DuMath.Location): boolean;
    /**
     * Checks if the given location is on the top side
     * @param location - The location
     */
    function isLocationTop(location: DuMath.Location): boolean;
    /**
     * Checks if the given location is on the center on the vertical axis
     * @param location - The location
     */
    function isLocationVCenter(location: DuMath.Location): boolean;
    /**
     * Checks if the given location is on the bottom side
     * @param location - The location
     */
    function isLocationBottom(location: DuMath.Location): boolean;
    /**
     * Returns the location of the point relative to the origin. Works with 2D values, the first two coordinates.
    Considers the coordinate [0,0] to be the top left corner of the system: positive values are right, bottom
     * @param point - The point to check
     * @param [origin = [0,0]] - The coordinates of the origin
     * @returns The location
     */
    function relativeLocation(point: float[], origin?: float[]): DuMath.Location;
    /**
     * Generates a random integer between minimum and maximum
     * @param [min = 0] - The minimum value
     * @param [max = 1] - The maximum value
     * @returns The randomly generated integer
     */
    function random(min?: int, max?: int): int;
    /**
     * Generates a random integer between minimum and maximum.<br/>
    The results are distributed along a gaussian (bell) curve.<br/>
    Note that a few (< 10%) values may be outside of the range. Set the <code>bounded</code> to true to avoid that.
     * @param [min = 0] - The minimum value
     * @param [max = 1] - The maximum value
     * @param [bounded = false] - When this is false, a few values may be outside the range. Set it to true to make sure all values are between min and max.
     * @returns The randomly generated integer
     */
    function gaussRandom(min?: int, max?: int, bounded?: boolean): int;
    /**
     * Measures the vector length between two points
     * @param value1 - The first value
     * @param value2 - The second value
     * @returns The length
     */
    function length(value1: int[], value2: int[]): float;
    /**
     * Compares two numbers
     * @param value1 - The first value
     * @param value2 - The second value
     * @param [floatPrecision = -1] - The precision for (float) number comparison, number of decimals. Set to -1 to not use.
     * @returns true if the two values are equal
     */
    function equals(value1: number | Number[], value2: number | Number[], floatPrecision?: int): boolean;
    /**
     * Calculates the log10 of a number
     * @param w - The number
     * @returns The result of log10(x)<br />
    i.e. Math.log(x)/Math.LN10
     */
    function log10(w: float): float;
    /**
     * Calculates the average value in a list
     * @param values - values
     * @returns The average value
     */
    function average(values: number | Number[]): float;
    /**
     * Alias for {@link DuMath.average}.
     */
    function mean(): void;
    /**
     * Clamps the value
     * @param values - values
     * @param [min = 0] - The minimum value
     * @param [max = 1] - The maximum value
     * @returns The clamped values
     */
    function clamp(values: number | Number[], min?: number, max?: number): number | Number[];
    /**
     * Converts the number from degrees to radians
     * @param value - the value
     * @returns The value in radians
     */
    function toRadians(value: number): float;
    /**
     * Converts the number from radians to degrees
     * @param value - the value
     * @returns The value in degrees
     */
    function toDegrees(value: number): float;
    /**
     * The logistic function (sigmoid)
     * @param value - The value
     * @param [midValue = 0] - The midpoint value, at which the function returns max/2
     * @param [min = 0] - The minimum return value
     * @param [max = 1] - The maximum return value
     * @param [rate = 1] - The logistic growth rate or steepness of the function
     * @returns The result in the range [min, max] (excluding min and max)
     */
    function logistic(value: number, midValue?: number, min?: number, max?: number, rate?: number): number;
    /**
     * The inverse logistic function (inverse sigmoid)
     * @param v - The variable
     * @param [midValue = 0] - The midpoint value, at which the function returns max/2 in the original logistic function
     * @param [min = 0] - The minimum return value of the original logistic function
     * @param [max = 1] - The maximum return value of the original logistic function
     * @param [rate = 1] - The logistic growth rate or steepness of the original logistic function
     * @returns The result
     */
    function inverseLogistic(v: number, midValue?: number, min?: number, max?: number, rate?: number): number;
    /**
     * The gaussian function
     * @param value - The variable
     * @param [min = 0] - The minimum return value
     * @param [max = 1] - The maximum return value
     * @param [center = 0] - The center of the peak
     * @param [fwhm = 1] - The full width at half maximum of the curve
     * @returns The result
     */
    function gaussian(value: number, min?: number, max?: number, center?: number, fwhm?: number): number;
    /**
     * A "reversed" gaussian function, growing faster with low value
     * @param value - The variable
     * @param [min = 0] - The minimum return value
     * @param [max = 1] - The maximum return value
     * @param [center = 0] - The center of the peak
     * @param [fwhm = 1] - The full width at half maximum of the curve
     * @returns The result
     */
    function reversedGaussian(value: number, min?: number, max?: number, center?: number, fwhm?: number): number;
    /**
     * The inverse gaussian function
     * @param v - The variable
     * @param [min = 0] - The minimum return value of the corresponding gaussian function
     * @param [max = 1] - The maximum return value of the corresponding gaussian function
     * @param [center = 0] - The center of the peak of the corresponding gaussian function
     * @param [fwhm = 1] - The full width at half maximum of the curve of the corresponding gaussian function
     * @returns The two possible results, the lower is the first in the list. If both are the same, it is the maximum
     */
    function inverseGaussian(v: number, min?: number, max?: number, center?: number, fwhm?: number): Number[];
    /**
     * The inverse of the reversed gaussian function
     * @param value - The variable
     * @param [min = 0] - The minimum return value of the corresponding gaussian function
     * @param [max = 1] - The maximum return value of the corresponding gaussian function
     * @param [center = 0] - The center of the peak of the corresponding gaussian function
     * @param [fwhm = 1] - The full width at half maximum of the curve of the corresponding gaussian function
     * @returns The two possible results, the lower is the first in the list. If both are the same, it is the maximum
     */
    function inverseReversedGaussian(value: number, min?: number, max?: number, center?: number, fwhm?: number): Number[];
    /**
     * The linear function
     * @param value - The variable
     * @param [min = 0] - The minimum input value
     * @param [max = 1] - The maximum input value
     * @param [targetMin = 0] - The minimum output value
     * @param [targetMax = 1] - The maximum output value
     * @param [clamp = false] - Whether to clamp the output value to the target or not.
     */
    function linear(value: number, min?: number, max?: number, targetMin?: number, targetMax?: number, clamp?: boolean): number;
    /**
     * Checks if a point is located inside given bounds
     * @param point - The point
     * @param bounds - The bounds. The number of bounds must be at least twice the number of dimensions, in this order : [a1, a2, ..., x1,x2,y1,y2,z1,z2]
     * @returns true if the point is inside the bounds
     */
    function isInside(point: float[], bounds: float[]): boolean;
    /**
     * Checks the sign of a number
     * @param num - The number to check
     * @returns 1 if num is positive, -1 if negative, 0 in other cases (0, NaN...)
     */
    function sign(num: number): int;
    /**
     * Gets the bounds of the values
     * @param values - A list of values
     * @returns The bounds, for N dimensions: [min1, min2, ..., minN, max1, max2, ..., maxN]
     */
    function bounds(values: Number[][]): float[];
    /**
     * Checks if the direction changes (if the point is at an extreme value). If the values have multiple dimensions, checks each axis individually.
     * @param previousValue - The value just before the point.
     * @param point - The point to check.
     * @param nextValue - The value just after the point.
     * @param [precision = 1] - The precision for floating point comparisons; number of decimals.
     */
    function isExtremePoint(previousValue: number | Number[], point: number | Number[], nextValue: number | Number[], precision?: int): boolean;
    /**
     * Checks if the point is an inflexion point.
     * @param previousVelocity - The derivative (speed) of a point just before the point.
     * @param pointVelocity - The derivative (speed) at the point to check.
     * @param nextVelocity - The derivative (speed) of a point just after the point.
     */
    function isInflexionPoint(previousVelocity: number | Number[], pointVelocity: number | Number[], nextVelocity: number | Number[]): boolean;
    /**
     * Finds the angle formed by three points
     * @param anglePoint - The point at which to measure the angle
     * @param oppositePointA - One of the opposite points
     * @param oppositePointB - The other opposite point
     * @returns The angle in radians.
     */
    function angleFromSides(anglePoint: float[], oppositePointA: float[], oppositePointB: float[]): float;
}

/**
 * Interpolation methods
 */
declare namespace DuInterpolation {
    /**
     * Linear (extra/inter)polation
     * @param value - The variable
     * @param [min = 0] - The minimum input value
     * @param [max = 1] - The maximum input value
     * @param [targetMin = 0] - The minimum output value
     * @param [targetMax = 1] - The maximum output value
     * @param [extrapolate = true] - Whether to extrapolate outside the target.
     */
    function linear(value: number, min?: number, max?: number, targetMin?: number, targetMax?: number, extrapolate?: boolean): number;
    /**
     * Interpolates a value with a bezier curve.
     * @param t - The value to interpolate
     * @param [tMin = 0] - The minimum value of the initial range
     * @param [tMax = 1] - The maximum value of the initial range
     * @param [value1 = 0] - The minimum value of the interpolated result
     * @param [value2 = 1] - The maximum value of the interpolated result
     * @param [bezierPoints = [0.33,0.0,0.66,1.0]] - an Array of 4 coordinates wihtin the [0.0, 1.0] range which describes the Bézier interpolation. The default mimics the native ease() function<br />
    [ outTangentX, outTangentY, inTangentX, inTangentY ]
     * @returns the value.
     */
    function bezier(t: number, tMin?: number, tMax?: number, value1?: number, value2?: number, bezierPoints?: number[]): number;
    /**
     * Interpolates and extrapolates a value with an exponential function.
     * @param t - The value to interpolate
     * @param [tMin = 0] - The minimum value of the initial range
     * @param [tMax = 1] - The maximum value of the initial range
     * @param [value1 = 0] - The minimum value of the interpolated result
     * @param [value2 = 1] - The maximum value of the interpolated result
     * @param [rate = 1] - The raising speed in the range [0, inf].
     * @returns the value.
     */
    function exponential(t: number, tMin?: number, tMax?: number, value1?: number, value2?: number, rate?: number): number;
    /**
     * Interpolates a value with a gaussian function.
     * @param t - The value to interpolate
     * @param [tMin = 0] - The minimum value of the initial range
     * @param [tMax = 1] - The maximum value of the initial range
     * @param [value1 = 0] - The minimum value of the interpolated result
     * @param [value2 = 1] - The maximum value of the interpolated result
     * @param [rate = 0] - The raising speed in the range [-1.0, 1.0].
     * @returns the value.
     */
    function gaussian(t: number, tMin?: number, tMax?: number, value1?: number, value2?: number, rate?: number): number;
    /**
     * Interpolates and extrapolates a value with a logarithmic function.
     * @param t - The value to interpolate
     * @param [tMin = 0] - The minimum value of the initial range
     * @param [tMax = 1] - The maximum value of the initial range
     * @param [value1 = 0] - The minimum value of the interpolated result
     * @param [value2 = 1] - The maximum value of the interpolated result
     * @param [rate = 1] - The raising speed in the range [0, inf].
     * @returns the value.
     */
    function logarithmic(t: number, tMin?: number, tMax?: number, value1?: number, value2?: number, rate?: number): number;
    /**
     * Interpolates and extrapolates a value with a logistic (sigmoid) function.
     * @param t - The value to interpolate
     * @param [tMin = 0] - The minimum value of the initial range
     * @param [tMax = 1] - The maximum value of the initial range
     * @param [value1 = 0] - The minimum value of the interpolated result
     * @param [value2 = 1] - The maximum value of the interpolated result
     * @param [rate = 1] - The raising speed in the range [0, inf].
     * @param [tMid] - The t value at which the interpolated value should be half way. By default, (tMin+tMax)/2
     * @returns the value
     */
    function logistic(t: number, tMin?: number, tMax?: number, value1?: number, value2?: number, rate?: number, tMid?: number): number;
}

/**
 * Date related methods
 */
declare namespace DuDate {
    /**
     * Gets the month number from a literal localized name. 0 is january, 11 is december
     * @param string - The month name
     * @returns The month number
     */
    function getMonth(string: string): int;
    /**
     * Gets the month name from an index. 0 is january, 11 is december
     * @param string - The month index
     * @returns The month name
     */
    function getMonthName(string: int): string;
    /**
     * Returns a pretty formatted string representing the date
     * @param date - The date
     * @returns The date
     */
    function toString(date: Date): string;
}

/**
 * Constructs a new string representation of a binary file
 * @param binAsString - The string representation.
 * @param fileName - The name of the original file.
 * @param [category = ''] - A Category for the file, will be used as a subfolder to extract files. Can have subcategories like "category/subcategory".
 */
declare class DuBinary {
    constructor(binAsString: string, fileName: string, category?: string);
    /**
     * The string representation of the binary file.
     */
    static binAsString: string;
    /**
     * The name of the original file.
     */
    static fileName: string;
    /**
     * A Category for the file, will be used as a subfolder to extract files. Can have subcategories like "category/subcategory".
     */
    static category: string;
    /**
     * Returns a string representation of the {@link DuBinary} which can be written in a jsxinc file.
     * @returns The source.
     */
    toSource(): string;
    /**
     * Writes the file.
     * @example
     * //First, include the text representation of the file (Add a # before the include word)
    include executable.exe.jsxinc
    // Now, a variable called `executable` (the original file name without extension) is available, it's an instance of DuBinary.
    var execFile = executable.extract();
    //Now, the file exists in the file system, and execFile is an ExtendScript File object.
    // The `DuBinary.extract()` method extracts the file to the Application Data folder by default.
    execFile.fsName; // C:\users\duduf\appData\Roaming\RxMaboratory\AdobeScripts\DuESF\icon.png (Example on Windows)
     * @example
     * //You can specify the output file name. (Add a # before the include word)
    include preset.ffx.jsxinc
    var presetFile = preset.extract("C:/test/test_preset.ffx");
    presetFile.fsName; // C:\test\test_preset.exe");
     * @param [outputFileName = DuFolder.duesfData/category/binaryfilename] - The output filename.
     * @param [onlyAtFirstRun = true] - Does not extract the file if it already exists and this is not the first time this version of the script is being used.<br />
    The file will be extracted only if the script is new or has just been updated (the version changed).
     * @returns The file created, null if the file could not be written.<br />
    If the file is not written, check user permissions, and check if the file and network access preference is checked.
     */
    toFile(outputFileName?: string, onlyAtFirstRun?: boolean): File | null;
    /**
     * Writes the DuBinary to a jsxinc file
     * @param outputFilePath - The file path for the output.
     * @param [varName = File name without extension] - The name of the variable used to store the javascript object.
     * @returns the new jsxinc file.
     */
    toJsxincFile(outputFilePath: string, varName?: any): File;
    /**
     * Creates a {@link DuBinary} object from an existing file
     * @param file - The File to convert
     * @param [category] - A Category for the file, will be used as a subfolder to extract files. Can have subcategories like "category/subcategory".
     * @returns The {@link DuBinary} object containing the file as a string
     */
    static fromFile(file: File, category?: string): DuBinary;
    /**
     * Converts a file to a jsxinc file
     * @param file - The binary file to convert
     * @param [category] - A Category for the file, will be used as a subfolder to extract files. Can have subcategories like "category/subcategory". Default is the name of the folder containing the file.
     * @param [outputFilePath = Same folder, same name with .json extension] - The file name for the output.
     * @param [varName = File name without extension] - The name of the variable used to store the javascript object.
     * @returns The jsxinc file created
     */
    static toJsxincFile(file: File, category?: string, outputFilePath?: string, varName?: string): File;
    /**
     * Creates a file from a DuBinary object representation.
     * @example
     * //First, include the text representation of the file (Add a # before the include word)
    include executable.exe.jsxinc
    // Now, a variable called `executable` (the original file name without extension) is available, you can pass this object to the `DuBinary.toFile()` method to extract it and get an ExtendScript File object representation of it.
    // Note: This object is an instance of a `DuBinary` class, which contains all information and a string representation of the original binary file
    var execFile = DuBinary.toFile(executable);
    //Now, the file exists in the file system, and execFile is an ExtendScript File object.
    // The `DuBinary.toFile()` method extracts the file to the Application Data folder by default.
    execFile.fsName; // C:\users\duduf\appData\Roaming\DuAEF\icon.png (Example on Windows)
     * @example
     * //You can specify the output file name. (Add a # before the include word)
    include preset.ffx.jsxinc
    var presetFile = DuBinary.toFile(preset,"C:/test/test_preset.ffx");
    presetFile.fsName; // C:\test\test_preset.exe");
     * @param DuBinary - The DuBinary object containing the string representation.<br />
    This object will be replaced by the File object created.<br />
    If a file object is provided (the file has already been extracted), does nothing.
     * @param [outputFileName = DuFolder.duesfData/DuAEF/scriptName/category/binaryfilename] - The output filename.
     * @param [onlyAtFirstRun = true] - Does not extract the file if it already exists and this is not the first time this version of the script is being used.<br />
    The file will be extracted only if the script is new or has just been updated (the version changed).
     * @returns The file created, null if the file could not be written.<br />
    If the file is not written, check user permissions, and check if the file and network access preference is checked.
     */
    static toFile(DuBinary: DuBinary, outputFileName?: string, onlyAtFirstRun?: boolean): File | null;
    /**
     * Converts a JS file to a binary file
     * @example
     * //If you don't want to include the file in the script. (Add a # before the include word)
    var stringFile = new File("C:\test\image.jpg.jsxinc");
    var jpgFile = DuBinary.convertToBinaryFile(stringFile);
    // Warning, this method uses `$.eval()` which is a bad security issue.
    // Do not use this method for anything else than debugging and testing.
     * @param jsFile - The JS file to convert
     * @param [outputFileName = DuFolder.duesfData/category/binaryfilename] - The output filename.
     * @returns The binary file created, or null if failed
     */
    static convertToBinaryFile(jsFile: File, outputFileName?: string): File;
}

/**
 * Constructs a new DuProcess instance
 * @param processPath - The path to the process executable binary
 * @param [args] - The common arguments used to run the process. You can append arguments each time you run the process with start(args)
 * @param [timeout = 0] - Waiting timeout after process start, in ms, 0 to avoid waiting, -1 for infinite.
If the process times out, process will not be killed, the script will just stop waiting.
 */
declare class DuProcess {
    constructor(processPath: string, args?: string[], timeout?: int);
    /**
     * The path to the process executable binary
     */
    static readonly processPath: string;
    /**
     * The common arguments used to run the process. You can append arguments each time you run the process with start(args)
     */
    static args: any[];
    /**
     * Waiting timeout after process start, in ms, 0 to avoid waiting, -1 for infinite.<br />
    If the process times out, process will not be killed, the script will just stop waiting. Default: 0
     */
    static timeout: int;
    /**
     * True if the process path leads to an application package (.app folder containing at least "/Contents/MacOS") on mac. False otherwise.
     */
    static readonly isAppPackage: boolean;
    /**
     * An Array of arguments array.<br />
    Arrays of arguments in the queue will be processed one after each other.<br />
    Update the Array and launch the queue with startQueue()
     */
    static queue: string[][];
    /**
     * The latest command which has been run.
     */
    static readonly latestCommand: string;
    /**
     * Starts the process
     * @param args - Args to append to {@link DuProcess.args} before starting
     * @param [timeout] - Overrides the default timeout.
     */
    start(args: any[], timeout?: int): void;
    /**
     * Starts the queue
     * @param [timeout] - Overrides the default timeout.
     */
    startQueue(timeout?: int): void;
    /**
     * Waits for the process to finish
     * @param [timeout] - Overrides the default timeout.
     */
    waitForFinished(timeout?: int): void;
    /**
     * Builds and returns the command line
     * @param [args] - Args to append to DuProcess.args before starting
     * @returns The command
     */
    buildCmd(args?: string[]): string;
    /**
     * Builds and returns the command line to launch the current queue
     * @returns The command
     */
    buildQueueCmd(): string;
    /**
     * Starts a command (in another thread).
     * @param cmd - The command to start
     */
    startCmd(cmd: string): void;
    /**
     * Runs a command with some arguments.
     * @param process - The process or a path to the process.
     * @param [args = []] - The arguments to pass to the command.
     * @param [detached = false] - The script won't wait for the command to finish.
     * @returns The output from the command.
     */
    static run(process: string | File, args?: string[], detached?: boolean): string;
    /**
     * True if the process path leads to an application package (.app folder containing at least "/Contents/MacOS") on mac. False otherwise.
     */
    static readonly isAppPackage: boolean;
}

/**
 * Constructs a queue of different processes
 * @param [processes] - The DuProcess Array
 */
declare class DuProcessQueue {
    constructor(processes?: DuProcess[]);
    /**
     * The DuProcess list
     */
    static processes: DuProcess[];
    /**
     * Starts the processes
     */
    start(): void;
}

/**
 * XML tools
 */
declare namespace DuXML {
    /**
     * Parses the value of the XML object.<br />
    If this object length is not 1, an Array is returned
     * @param xml - The xml to parse
     * @param [type = 'string'] - The type, one of 'string', 'bool', 'int', 'float' or 'date'.
     * @returns The value or an Array of values
     */
    function getValue(xml: XML, type?: string): any[] | any;
}

/**
 * XMP tools
 */
declare namespace DuXMP {
    /**
     * Loads the XMP library if it has not been loaded yet. There is no need to call this function as it's called automatically by DuESF methods if needed.<br />
    Call it once if you plan to use XMP without the methods in DuESF.<br />
    Note that the XMP library is added statically as <code>ExternalObject.AdobeXMPScript</code>.
     */
    function init(): void;
}

/**
 * Zip methods. This lib needs the 7zip command line tool <code>7za.exe</code> to be located next to the script on Windows.
 */
declare namespace DuZip {
    /**
     * The path to 7za.exe or 7z.exe (windows only, mac uses the internal command 'zip')
     */
    var processPath: string;
    /**
     * Compresses the content of a folder
     * @param folder - The folder to zip
     * @param [archiveName = folder.name + ".zip"] - The archive name
     * @param [wipeFolder = false] - Set to true to remove the original folder as soon as the zip is ready
     * @returns The zip file
     */
    function compressFolderContent(folder: Folder, archiveName?: string, wipeFolder?: boolean): File;
}

/**
 * An Open Cel Animation document<br />
This is not a real class, and cannot be instanciated.<br />
Use {@link DuOCA.load} to create an OCA object.
 * @property ocaVersion - The version of OCA used to export this document
 * @property name - The name of this project
 * @property width - The width, in pixels
 * @property height - The height, in pixels
 * @property frameCount - The duration, in frames
 * @property frameRate - The frame rate, in frames per second
 * @property pixelAspect - The pixel aspect ratio
 * @property layers - The layers
 * @property startTime - The frame number at which the animation starts
 * @property endTime - The frame number at which the animation ends
 * @property colorDepth - Bits per channel used in the document
 * @property backgroundColor - The background color
 * @property originApp - The application name from which the document was exported.
 * @property originAppVersion - The version of the origin application.
 * @property folder - The folder containing the oca files.
 * @property path - The URI to the folder containing the oca files.
 */
declare class DuOCADocument {
    /**
     * The version of OCA used to export this document
    */
    ocaVersion: string;
    /**
     * The name of this project
    */
    name: string;
    /**
     * The width, in pixels
    */
    width: int;
    /**
     * The height, in pixels
    */
    height: int;
    /**
     * The duration, in frames
    */
    frameCount: int;
    /**
     * The frame rate, in frames per second
    */
    frameRate: float;
    /**
     * The pixel aspect ratio
    */
    pixelAspect: float;
    /**
     * The layers
    */
    layers: OCALayer[];
    /**
     * The frame number at which the animation starts
    */
    startTime: int;
    /**
     * The frame number at which the animation ends
    */
    endTime: int;
    /**
     * Bits per channel used in the document
    */
    colorDepth: DuOCA.colorDepths;
    /**
     * The background color
    */
    backgroundColor: float[];
    /**
     * The application name from which the document was exported.
    */
    originApp: string;
    /**
     * The version of the origin application.
    */
    originAppVersion: string;
    /**
     * The folder containing the oca files.
    */
    folder: Folder;
    /**
     * The URI to the folder containing the oca files.
    */
    path: string;
}

/**
 * An OCA Layer<br />
This is not a real class, and cannot be instanciated.<br />
Use {@link DuOCA.load} to create an OCA object containing the layers.
 * @property name - The layer name
 * @property frames - The keyframes of the animation for this layer.
 * @property childLayers - The child layers if this layer is a group.
 * @property type - The type of the layer. See the Layer Types section below
 * @property fileType - The type of the files used for the frames. The file extension, without the initial dot.
 * @property blendingMode - The blending mode of the layer
 * @property inheritAlpha - The inherit alpaha option (preserve transparency)
 * @property animated - Whether this layer is a single frame or not.
 * @property position - The coordinates of the center of the layer, in pixels [X,Y] in the document coordinates.
 * @property width - The width, in pixels.
 * @property height - The height, in pixels.
 * @property label - A label for the layer.
 * @property opacity - The opacity, in the range 0.0-1.0
 * @property visible - True if the layer is visible
 * @property reference - Whether the layer is a guide or reference, and should not be rendered.
 * @property passThrough - Whether the layer is in pass through mode. Only for grouplayer.
 */
declare class DuOCALayer {
    /**
     * The layer name
    */
    name: string;
    /**
     * The keyframes of the animation for this layer.
    */
    frames: OCAFrame[];
    /**
     * The child layers if this layer is a group.
    */
    childLayers: OCALayer[];
    /**
     * The type of the layer. See the Layer Types section below
    */
    type: DuOCA.LayerType;
    /**
     * The type of the files used for the frames. The file extension, without the initial dot.
    */
    fileType: string;
    /**
     * The blending mode of the layer
    */
    blendingMode: DuOCA.BlendingModes;
    /**
     * The inherit alpaha option (preserve transparency)
    */
    inheritAlpha: boolean;
    /**
     * Whether this layer is a single frame or not.
    */
    animated: boolean;
    /**
     * The coordinates of the center of the layer, in pixels [X,Y] in the document coordinates.
    */
    position: int[];
    /**
     * The width, in pixels.
    */
    width: int;
    /**
     * The height, in pixels.
    */
    height: int;
    /**
     * A label for the layer.
    */
    label: int;
    /**
     * The opacity, in the range 0.0-1.0
    */
    opacity: float;
    /**
     * True if the layer is visible
    */
    visible: boolean;
    /**
     * Whether the layer is a guide or reference, and should not be rendered.
    */
    reference: boolean;
    /**
     * Whether the layer is in pass through mode. Only for grouplayer.
    */
    passThrough: boolean;
}

/**
 * An OCA Frame<br />
This is not a real class, and cannot be instanciated.<br />
Use {@link DuOCA.load} to create an OCA object containing the layers.
 * @property name - The layer name
 * @property fileName - The path and name of the file of the frame. It is the absolute path from the root of the OCA folder.
 * @property frameNumber - The frame in the document at which the frames starts to be visible
 * @property opacity - The opacity, in the range 0.0-1.0
 * @property position - The coordinates of the center of the layer, in pixels [X,Y] in the document coordinates.
 * @property width - The width, in pixels.
 * @property height - The height, in pixels.
 * @property duration - The duration of the frame, in frames.
 */
declare class DuOCAFrame {
    /**
     * The layer name
    */
    name: string;
    /**
     * The path and name of the file of the frame. It is the absolute path from the root of the OCA folder.
    */
    fileName: string;
    /**
     * The frame in the document at which the frames starts to be visible
    */
    frameNumber: int;
    /**
     * The opacity, in the range 0.0-1.0
    */
    opacity: float;
    /**
     * The coordinates of the center of the layer, in pixels [X,Y] in the document coordinates.
    */
    position: int[];
    /**
     * The width, in pixels.
    */
    width: int;
    /**
     * The height, in pixels.
    */
    height: int;
    /**
     * The duration of the frame, in frames.
    */
    duration: int;
}

/**
 * Open Cel Animation interchange tools
 */
declare namespace DuOCA {
    /**
     * The different layer types
     */
    enum LayerType {
        PAINT = "paintlayer",
        VECTOR = "vectorlayer",
        GROUP = "grouplayer"
    }
    /**
     * Loads an OCA document from a json file
     * @param file - The .json file or its path
     * @returns The OCA document or null if the file could not be parsed or opened
     */
    function load(file: File | string): DuOCADocument | null;
}

/**
 * Methods to manage URLS
 */
declare namespace DuURL {
    /**
     * The list of escaped characters in URLs
     */
    enum EscapedChars {
        "%" = "%25",
        " " = "%20",
        "#" = "%23",
        $ = "%24",
        "&" = "%26",
        "@" = "%40",
        "`" = "%60",
        "/" = "%2F",
        ":" = "%3A",
        ":" = "%3B",
        "<" = "%3C",
        "=" = "%3D",
        ">" = "%3E",
        "?" = "%3F",
        "[" = "%5B",
        "\" = "%5C",
        "]" = "%5D",
        "^" = "%5E",
        "{" = "%7B",
        "|" = "%7C",
        "}" = "%7D",
        "~" = "%7E",
        "\"" = "%22",
        "‘" = "%27",
        "+" = "%2B",
        "," = "%2C"
    }
    /**
     * Escapes common characters from a string to be included in a GET request URL.
     * @param str - The string to escape.
     * @returns The escaped string.
     */
    function escape(str: string): string;
    /**
     * Builds a query, made of "key=value" pairs.
     * @param arr - An associative array with key/value pairs. Values will be escaped.
     * @returns The query, with the leading ?.
     */
    function buildRequest(arr: any): string;
    /**
     * Builds a HTTP GET request. The user-agent is named after DuESF.scriptName.
     * @param host - The host, without port, without http part; for example: "duduf.com" or "version.rxlab.io"
     * @param [subfolders] - The subfolders.
     * @param [argsArray] - An associative array with key/value pairs. Values will be escaped.
     * @param [httpVersion = "1.1"] - An associative array with key/value pairs. Values will be escaped.
     * @returns The query ready to be posted with a socket
     */
    function buildGET(host: string, subfolders?: string[], argsArray?: any, httpVersion?: string): string;
}

/**
 * Methods related to ScriptUI
 */
declare namespace DuScriptUI {
    /**
     * The list of strings used by the UI.
     */
    enum String {
        ABOVE = "Above",
        ABOVE_SHORT = "Ab",
        ADD_ITEM_OR_CAT = "Add new item or category",
        AE_BLUE = "After Effects Blue",
        AE_BLUE_TIP = "The After Effects highlighting blue",
        AE_ORANGE = "After Effects Orange (CS6)",
        AE_ORANGE_TIP = "The After Effects highlighting orange from good ol'CS6",
        APPLY = "Apply",
        APPLY_ALL = "Apply all",
        APPLY_SETTINGS = "Apply changes to the settings.",
        APPLY_SETTINGS_ALERT = "You may need to restart the script for all changes to take effect.",
        ARM = "Arm",
        ARTHROPOD = "Arthropod",
        AUDIO = "Audio",
        AXIS = "Axis",
        BACK_PREVIOUS = "Back",
        BACK_LOCATION = "Back",
        BACK_LOCATION_SHORT = "Bk",
        BIRD = "Bird",
        BODY = "Body",
        BONE = "Bone",
        BUG_REPORT = "Bug report",
        BUG_REPORT_TIP = "Bug report\nFeature request\n\nTell us what's wrong or request a new feature.",
        CAM = "Cam",
        CAMERA = "Camera",
        CANCEL = "Cancel",
        CALF = "Calf",
        CATEGORY = "Category",
        CHARACTER = "Character",
        CHANNEL = "Channel",
        CHECK_UPDATE = "Check for updates",
        CIRCLE = "Circle",
        CLAWS = "Claws",
        CLEAR_LIB_TIP = "Clears the current search and category",
        CLOSE = "Close",
        COLOR = "Color",
        COLOR_HIGHLIGHT_TIP = "Set the highlight color.",
        COPY = "Copy",
        CREATE = "Create",
        CUSTOM = "Custom",
        CUSTOM_COLOR_TIP = "Select a custom color.",
        CLOSE_SETTINGS = "Close settings",
        DEFAULT = "Default",
        DEV_MODE = "Dev and Debug mode",
        DEV_MODE_TIP = "Use at your own risk!",
        DIGITIGRADE = "Digitigrade",
        EAR = "Ear",
        EDIT = "Edit",
        EDIT_ITEM_OR_CAT = "Edit selected item or category",
        EDIT_SETTINGS = "Edit settings",
        EFFECTS = "Effects",
        EXPERT = "Expert",
        EXPERT_UI_TIP = "The smallest UI, for expert users.",
        EYE = "Eye",
        EYES = "Eyes",
        EYEBROW = "Eyebrow",
        FEATHER = "Feather",
        FEATHERS = "Feathers",
        FEATURE_REQUEST = "Feature request",
        FEATURE_REQUEST_TIP = "Feature request\nRequest something new.",
        FILE = "File",
        FIN = "Fin",
        FINGERS = "Fingers",
        FISH = "Fish",
        FISHBONE = "Fishbone",
        FISHBONES = "Fishbones",
        FISH_SPINE = "Fish spine",
        FOOT = "Foot",
        FOREARM = "Forearm",
        FRAME = "Frame",
        FRAMES = "Frames",
        FRONT = "Front",
        FRONT_LEG = "Front leg",
        FRONT_SHORT = "Fr",
        FUNDING_BAR_TIP = "Thank you for your donations!",
        FUNDING_BAR_TIP_DETAILS = "This month, the {#} fund is ${#}.\nThat's {#}% of our monthly goal ( ${#} )\n\nClick on this button to join the development fund!",
        GROUPS = "Groups",
        HAIR = "Hair",
        HAND = "Hand",
        HEAD = "Head",
        HEEL = "Heel",
        HELP = "Help",
        HELP_TIP = "Get help.",
        HIPS = "Hips",
        HOMINOID = "Hominoid",
        HOOF = "Hoof",
        INVERT = "Invert",
        INVERTED = "Inverted",
        ISOLATE = "Isolate",
        ITEM = "Item",
        LANGUAGE_TIP = "Set the language of the interface.",
        LAYER = "Layer",
        LAYERS = "Layers",
        LEFT = "Left",
        LEFT_SHORT = "L",
        LEG = "Leg",
        LIMB = "Limb",
        LOCATION = "Location",
        LOCATION_SHORT = "Loc",
        MAGIC = "Magic is happening",
        MAIN = "Main",
        MASKS = "Masks",
        MAXIMUM = "Maximum",
        MIDDLE = "Middle",
        MIDDLE_SHORT = "Md",
        MINIMUM = "Minimum",
        MORE_OPTIONS_TIP = "[Shift]: More options...",
        MOUTH = "Mouth",
        NAME = "Name",
        NECK = "Neck",
        NEXT = "Next",
        NONE = "None",
        NORMAL_MODE = "Normal mode",
        NOSE = "Nose",
        NULL_OBJECT = "Null",
        OK = "OK",
        OPACITY = "Opacity",
        OPEN = "Open",
        OPEN_FOLDER = "Open folder",
        ORIGINAL = "Original",
        PATH = "Path",
        PAW = "Paw",
        PENIS = "Penis",
        PINCER = "Pincer",
        PIN_TIP = "Keeps this panel open",
        PLANTIGRADE = "Plantigrade",
        PREVIOUS = "Previous",
        POLYGON = "Polygon",
        POSITION = "Position",
        PROPERTIES = "Properties",
        RANDOM_TIP = "Set a random value.",
        RECTANGLE = "Rectangle",
        REFRESH_LIB = "Refresh library",
        REMOVE = "Remove",
        REMOVE_ITEM_OR_CAT = "Remove selected item or category",
        RESET_SETTINGS = "Reset the settings to their default values.",
        RIGHT = "Right",
        RIGHT_SHORT = "R",
        ROOKIE = "Rookie",
        ROOKIE_UI_TIP = "The easiest-to-use mode, but also the biggest UI.",
        ROTATION = "Rotation",
        ROUNDED_RECTANGLE = "Rounded rectangle",
        RUN_EXECUTE = "Run",
        RX_PURPLE = "RxLab Purple",
        RX_PURPLE_TIP = "The RxLaboratory Purple",
        RX_RED = "Rainbox Red",
        RX_RED_TIP = "The Rainbox Productions Red",
        SAVE_AS = "Save as",
        SCALE = "Scale",
        SCRIPTING = "Scripting",
        SELECT_LAYERS = "Select layers",
        SELECT_GROUPS = "Select groups",
        SET_QUALITY = "Set quality",
        SETTINGS = "Settings",
        SETTINGS_FILE = "Settings file",
        SETTINGS_FILE_TIP = "Set the location of the settings file.",
        SHOULDER = "Shoulder",
        SHOULDERS = "Shoulders",
        SHOULDERS_AND_NECK = "Shoulders & neck",
        SIDE = "Side",
        SIZE = "Size",
        SNAKE = "Snake",
        SPINE = "Spine",
        STANDARD = "Standard",
        STANDARD_UI_TIP = "The standard not-too-big UI.",
        START_TYPING_CMD = "Start typing something...",
        TAIL = "Tail",
        TAIL_SHORT = "Tl",
        TARGET = "Target",
        TEXT = "Text",
        TEXTURE = "Texture",
        THIGH = "Thigh",
        TIMELINE = "Timeline",
        TIP_BONE = "Tip",
        TRANSFORM = "Transform",
        TOES = "Toes",
        TORSO = "Torso",
        TYPE = "Type",
        UI_MODE_TIP = "Select the UI mode.",
        UNDER = "Under",
        UNDER_SHORT = "Un",
        UNGULATE = "Ungulate",
        VERTEBRAE = "Vertebrae",
        VULVA = "Vulva",
        WING = "Wing",
        WORKING = "Working...",
        X_POSITION = "X Position",
        Y_POSITION = "Y Position"
    }
    /**
     * The list of available icons.
     */
    enum Icon {
        ADD = "w12_add",
        AE_BLUE = "w8_ae_blue",
        AE_ORANGE = "w8_ae_orange",
        BACK = "w12_back",
        BOX_CHECKED = "w12_box_checked",
        BOX_UNCHECKED = "w12_box_unchecked",
        BUG = "w16_bug",
        BUG_REPORT = "w12_bugreport",
        CHECK = "w12_check",
        CLOSE = "w12_close",
        DOWNLOAD = "w16_download",
        EDIT = "w12_edit",
        EXPERT = "w16_expert",
        EYE_DROPPER = "w12_eye_dropper",
        EYE_DROPPER_BIG = "w16_eye_dropper",
        FEATURE = "w12_feature",
        FILE = "w12_file",
        FOLDER = "w12_folder",
        FOLDER_CLOSED = "w12_folder_closed",
        GO_TO = "w12_goto",
        HEART = "w12_heart",
        HELP = "w12_help",
        LANGUAGE = "w16_language",
        LANGUAGE_FILE = "w16_language_file",
        LANGUAGE_SMALL = "w12_language",
        LIST = "w16_list",
        MENU = "w12_menu",
        MORE = "w12_more",
        NEXT = "w12_next",
        OPTIONS = "w12_options",
        PARENT = "w12_parent",
        PIN = "w12_pin",
        PINNED = "w12_pinned",
        PLACEHOLDER = "w16_placeholder",
        PROGRESS = "w320_progress",
        RAINBOX_RED = "w8_rx_red",
        RANDOM = "w16_random",
        REMOVE = "w12_remove",
        RESET = "w12_reset",
        ROOKIE = "w16_rookie",
        RUN = "w12_run",
        RX_PURPLE = "w8_rx_purple",
        SETTINGS = "w12_settings",
        SETTINGS_FILE = "w16_settings_file",
        STANDARD = "w16_standard",
        UPDATE = "w12_update",
        USER = "w16_user",
        SEARCH = "w12_search",
        SORT = "w12_sort",
        SORT_UP = "w12_sort_up",
        SORT_DOWN = "w12_sort_down"
    }
    /**
     * Creates a titlebar
     * @param container - The ScriptUI Object which will contain and display the titlebar.
     * @param [title = ""] - The title.
     * @param [closeButton = true] - Wether to add a close button
     * @param [pinButton = true] - Wether to add a pin button
     * @returns The titlebar
     */
    function titleBar(container: Panel | Window | Group, title?: string, closeButton?: boolean, pinButton?: boolean): DuTitleBar;
    /**
     * Creates the main panel for a script
     * @example
     * var ui = DuScriptUI.mainPanel(this,"Test Script");
    var refreshButton = ui.content.add('button',undefined,"Refresh");
    refreshButton.onClick = function() { ui.refreshUI( new File($.fileName) ); }; //reloads the current script
    DuScriptUI.showUI(ui);
     * @param container - The container ('this' in the root of the calling script), either a Panel (when launched from the 'Window' menu) or null (when launched from 'file/scripts/run...')
     * @param [scriptName = DuESF.scriptName] - A name for this UI
     * @param [contentAlignment = DuScriptUI.defaultColumnAlignment] - The alignment of the content in the panel
     * @param [borderless = false] - When true, creates a borderless window if container is not a panel
     * @returns The panel created, either a ScriptUI Panel or a ScriptUI Window.
     */
    function mainPanel(container: Panel | null, scriptName?: string, contentAlignment?: string[], borderless?: string): DuPanel;
    /**
     * Creates a borderless popup
     * @example
     * var popup = DuScriptUI.popUp( );
    var popupButton = DuScriptUI.button( myUI, "My Buttton for the popup" );
    popup.tieTo( popupButton ); // will show the popup when the button is clicked, just above it.
     * @param title - The title of the popup
     * @param [alignment = [ "fill", "top" ]] - The alignement of this window
     * @param [modal = false] - Set the popup to a modal dialog
     * @returns The popup, a ScriptUI Window which is borderless, with a 'tieTo(control)' method.
     */
    function popUp(title: string, alignment?: string[], modal?: boolean): DuPopup;
    /**
     * Resizes and shows the main panel of a script
     * @param ui - The UI created by Duik.ui.createUI
     * @param [enterRunTime = false] - Set to true to automatically set DuESF to runtime state<br />
    Set this to false if the ui shown is not the actual main panel of the script and it is shown before the main panel has been loaded.
     */
    function showUI(ui: Panel | Window, enterRunTime?: boolean): void;
    /**
     * Creates the main panel of a script
     * @example
     * var ui = DuScriptUI.mainPanel(this,"Test Script");
    var refreshButton = ui.content.add('button',undefined,"Refresh");
    refreshButton.onClick = function() { ui.refreshUI( new File($.fileName) ); }; //reloads the current script
    DuScriptUI.showUI(ui);
     * @param container - The container ('this' in the root of the calling script), either a Panel (when launched from the 'Window' menu) or null (when launched from 'file/scripts/run...')
     * @param [addSettingsButton = true] - Whether to create a button to open the settings or not
     * @param [addHelpButton = false] - Whether to create a button to open the help panel or not
     * @param [scriptFile] - The main script file, needed for the refresh button in debug mode
     * @returns The panel created, either a ScriptUI Panel or a ScriptUI Window.
     */
    function scriptPanel(container: Panel | null, addSettingsButton?: boolean, addHelpButton?: boolean, scriptFile?: File): DuScriptPanel;
    /**
     * Creates a popup to ask for a simple string
     * @param title - The title of the popup
     * @param defaultString - The placeholder for the edit text
     * @returns The popup, with an <code>onAccept( str )</code> callback.
     */
    function stringPrompt(title: string, defaultString: string): DuPopup;
    /**
     * Finds the window containing this ScriptUI Control
     * @param scriptUIControl - The ScriptUI Control
     * @returns The containing ScriptUI Window
     */
    function parentWindow(scriptUIControl: Control): Window;
    /**
     * Creates a button with an optionnal icon. Must have at least an icon or a text, or both.
     * @param container - The ScriptUI Object which will contain and display the button.
     * @param [text] - The label of the button. Default: empty string
     * @param [image] - The path to the icon (or a PNG as a string representation). Default: empty string
     * @param [helpTip] - The helptip. Default: empty string
     * @param [addOptionsPanel = false] - Adds a panel for options and a button to access it.
     * @param [orientation = 'row'] - The orientation of the button (icon, text, options button). Default will be changed to 'column' if there's no text.
     * @param [alignment = 'left'] - The alignment of the button content ('center', 'right' or 'left' for 'row', 'top' 'bottom', 'center' for column).
     * @param [localize = true] - Set to false if the text must not be translated.
     * @param [ignoreUIMode = false] - Will show texte even if the ui mode is set to > 1 in the script settings
     * @param [optionsWithoutButton = false] - Don't add an "ok" button to the options popup
     * @param [optionsButtonText] - Change the displayed text of the bottom button of the options
     * @param [optionsWithoutPanel = false] - Don't create the options popup panel (use <code>DuButton.onOptions</code> to add your own callback when the options are requested)
     * @returns The image button created.
     */
    function button(container: Panel | Window | Group, text?: string, image?: string | DuBInary, helpTip?: string, addOptionsPanel?: boolean, orientation?: boolean, alignment?: boolean, localize?: boolean, ignoreUIMode?: boolean, optionsWithoutButton?: boolean, optionsButtonText?: string, optionsWithoutPanel?: boolean): DuButton;
    /**
     * Creates a small button.
     * @param container - The ScriptUI Object which will contain and display the button.
     * @param text - The label of the button. Default: empty string
     * @param [helpTip] - The helptip. Default: empty string
     * @param [value] - A user value stored in the button, which is passed to the onClick method
     * @returns The image button created.
     */
    function smallbutton(container: Panel | Window | Group, text: string, helpTip?: string, value?: any): DuButton;
    /**
     * Creates a button displaying the version of the script and redirecting to the about url.
     * @param container - The ScriptUI Object which will contain and display the button.
     * @param [image = DuESF.scriptIcon] - The path to the icon or a png binstring. Default: empty string
     * @returns The version button created.
     */
    function versionButton(container: Panel | Window | Group, image?: string | DuBinary): DuButton;
    /**
     * Creates a button opening the bug report url.
     * @param container - The ScriptUI Object which will contain and display the button.
     * @param [showLabel = false] - When true, the button includes a "Bug Report" label.
     * @returns The bug button created.
     */
    function addBugButton(container: Panel | Window | Group, showLabel?: boolean): DuButton;
    /**
     * Creates a button opening the help panel.
     * @param container - The ScriptUI Object which will contain and display the button.
     * @param [showLabel = false] - When true, the button includes a "Help" label.
     * @returns The help button created.
     */
    function addHelpButton(container: Panel | Window | Group, showLabel?: boolean): DuButton;
    /**
     * Creates a button opening the help panel.
     * @param container - The ScriptUI Object which will contain and display the button.
     * @param [showLabel = false] - When true, the button includes a "Help" label.
     * @returns The help button created.
     */
    function addTranslateButton(container: Panel | Window | Group, showLabel?: boolean): DuButton;
    /**
     * Creates a button opening the link for like/follow/donation
     * @param container - The ScriptUI Object which will contain and display the button.
     * @param [showLabel = false] - When true, the button includes a <code>"I ♥ " + DuESF.scriptName</code> label.
     * @returns The like button created.
     */
    function addDonateButton(container: Panel | Window | Group, showLabel?: boolean): DuButton;
    /**
     * Displays a prompt to select the language of the script.<br />
    Won't do nothing if the script already has a language set in the settings.<br />
    Use this method before launching the script.
     * @param callback - The function to execute when the user has chosen the language.<br />
    This function should be the one which loads the script.
     * @param [ui] - A container to display the UI. A modal Dialog is created if omitted
     */
    function askLanguage(callback: (...params: any[]) => any, ui?: Panel | Window): void;
    /**
     * Checks if the script can be updated
     * @param [callback] - The function to execute when the user has clicked on the "dismiss" button.
     * @param [ui] - A container to display the UI. A modal Dialog is created if omitted
     * @param [showAlert] - Whether to show an alert if the check failed or if the version is up-to-date.
     */
    function checkUpdate(callback?: (...params: any[]) => any, ui?: Panel | Window, showAlert?: boolean): void;
    /**
     * Resets the layout of the whole ui containing a scriptUI item.
     * @param item - The ScriptUI element which needs to be resized
     * @param [force] - Needs to be true if you need to layout before <code>DuESF.state</code> is <code>DuESF.State.RUNTIME</code>.<br />
    That should be the case only for the main UI; Note that you should not need it anyway, {@link DuScriptUI.showUI} does that for you.
     */
    function layout(item: ScriptUI, force?: boolean): void;
    /**
     * Changes the color of the text of a ScriptUI Object
     * @param text - The ScriptUI Object
     * @param color - The new color
     * @param [adjusted = false] - lightens the color if the brightness setting of Ae is not set on the darkest one
     */
    function setTextColor(text: ScriptUI, color: DuColor, adjusted?: boolean): void;
    /**
     * Changes the color of the background of a ScriptUI Object
     * @param uiItem - The ScriptUI Object
     * @param color - The new color [R,V,B,A] Array
     * @param [adjusted = true] - lightens the color if the brightness setting of Ae is not set on the darkest one
     */
    function setBackgroundColor(uiItem: ScriptUI, color: any[], adjusted?: boolean): void;
    /**
     * Adds a group in a container, using  DuScriptUI default alignments, and DuScriptUI.defaultSpacing. Margins are set to 0.
     * @param container - Where to create the group
     * @param [orientation] - The orientation to use. One of "column", "row" or "stack". By default, "column" if added in a row, "row" if added in a column.
     * @returns The group created
     */
    function group(container: Panel | Window | Group, orientation?: string): Group;
    /**
     * Adds separator with an optionnal name in the group
     * @param container - Where to create the separator
     * @param [name] - The name displayed
     * @param [checkable = false] - When true, adds a checkbox to the separator
     * @param [drawLine = true] - Draws a line when there is no name. When false, the separator is an empty space
     * @param [translatable = true] - If false, the name won't be translated
     * @returns The separator
     */
    function separator(container: Panel | Window | Group, name?: string, checkable?: boolean, drawLine?: boolean, translatable?: boolean): DuSeparator;
    /**
     * Creates a checkbox with an optionnal icon. Must have at least an icon or a text, or both.
     * @param container - The ScriptUI Object which will contain and display the button.
     * @param text - The label of the button. Default: empty string
     * @param [image] - The path to the icon. Default: empty string
     * @param [helpTip = ''] - The helptip. Default: empty string
     * @param [textChecked = text] - The label of the button displayed when it is checked.
     * @param [imageChecked] - The image to show when it is checked
     * @param [orientation = 'row'] - The orientation
     * @returns The checkbox created.
     */
    function checkBox(container: Panel | Window | Group, text: string, image?: string | DuBinary, helpTip?: string, textChecked?: string, imageChecked?: string | DuBinary, orientation?: string): DuCheckBox;
    /**
     * Moves the coordinates so that the size completely fits inside an existing screen
     * @param location - The coordinates [top, left]
     * @param size - The rectangle size, an object which has two properties: width and height
     * @returns the new location
     */
    function moveInsideScreen(location: int[], size: Dimension): int[];
    /**
     * Centers the coordinates in their screen
     * @param location - The coordinates [top, left]
     * @param size - The rectangle size, an object which has two properties: width and height
     * @returns the new location
     */
    function centerInScreen(location: int[], size: Dimension): int[];
    /**
     * Gets the corners of the screen the closest to (or containing) the location
     * @param location - The coordinates
     * @returns The screen object with a top, left, right and bottom property.
     */
    function getClosestScreen(location: int[]): any;
    /**
     * Creates a drop down selector, using image buttons
     * @param container - The ScriptUI Object which will contain and display the selector.
     * @param [helpTip] - The help tip to show on the selector
     * @returns - The selector
     */
    function selector(container: Window | Panel | Group, helpTip?: string): DuSelector;
    /**
     * Creates a nice edittext where the edit text is shown only on click.
     * @param container - The ScriptUI Object which will contain and display the nice edit text.
     * @param text - The initial text in the edit.
     * @param [prefix = ""] - A text prefix to display.
     * @param [suffix = ""] - A text suffix to display.
     * @param [placeHolder = ""] - A place holder default text.
     * @param [helpTip = ""] - The helpTip of this control
     * @param [localize = true] - Whether to translate the texts of this control
     * @returns The custom Group containing the edit text.
     */
    function editText(container: Window | Panel | Group, text: string, prefix?: string, suffix?: string, placeHolder?: string, helpTip?: string, localize?: boolean): DuEditText;
    /**
     * Creates a statictext (with an optionnal color).
     * @param container - The ScriptUI Object which will contain and display the nice edit text.
     * @param text - The initial text in the edit.
     * @param [color] - The color of the text. By default, uses a slightly darker text than the Host App text color
     * @param [localize = true] - Set this to false to never translate this text.
     * @param [multiLine = false] - Set this to true to add a multiline text. Auto detected by default if the text contains the newline character.
     * @returns The ScriptUI StaticText created.
     */
    function staticText(container: Window | Panel | Group, text: string, color?: DuColor, localize?: boolean, multiLine?: boolean): StaticText;
    /**
     * Creates a folder selector with a field for the path and a browse button<br />
     * @param container - The ScriptUI Object which will contain and display the panel.
     * @param [text = "Browse..."] - The text to display on the button.
     * @param [textField = true] - Whether to show the text field for the path.
     * @param [helpTip = ''] - The helptip for this control.
     * @param [orientation = 'row'] - The orientation of the control (button+edittext).
     * @returns The control.
     */
    function folderSelector(container: Window | Panel | Group, text?: string, textField?: boolean, helpTip?: string, orientation?: string): DuFolderSelector;
    /**
     * Creates a file selector with a field for the path and a browse button.
     * @param container - The ScriptUI Object which will contain and display the panel.
     * @param [text = "Browse..."] - The text to display on the button.
     * @param [textField = true] - Whether to show the text field for the path.
     * @param [helpTip = ''] - The helptip for this control.
     * @param [image] - The image to use as an icon; a "file" icon by default.
     * @param [mode = 'open'] - The open mode, either 'open' or 'save'.
     * @param [filters] - The file type filters.
     * @param [orientation = 'row'] - The orientation of the control (button+edittext).
     * @returns The control.
     */
    function fileSelector(container: Window | Panel | Group, text?: string, textField?: boolean, helpTip?: string, image?: string | DuBinary, mode?: string, filters?: string, orientation?: string): DuFileSelector;
    /**
     * Creates a slider.
     * @param container - The ScriptUI Object which will contain and display the nice edit text.
     * @param [defaultValue = 0] - The initial value.
     * @param [min = 0] - The minimal value.
     * @param [max = 100] - The maximal value.
     * @param [orientation = 'column'] - Either 'row' or 'column'
     * @param [invertedAppearance] - Revert the slider with max value on the left
     * @param [prefix] - A text prefix to display.
     * @param [suffix] - A text suffix to display.
     * @param [textAlignment = 'center'] - The alignment of the text.<br />
    One of 'left', 'center', 'right' for column orientation,<br />
    And 'top', 'center', 'bottom' for row orientation.
     * @param [valueButtons = []] - A list of predefined values to add as buttons.
     * @returns The custom Group containing the slider.
     */
    function slider(container: Window | Panel | Group, defaultValue?: int, min?: int, max?: int, orientation?: string, invertedAppearance?: boolean, prefix?: string, suffix?: string, textAlignment?: string, valueButtons?: int[]): DuSlider;
    /**
     * Creates a layout to add forms to a UI, using ScriptUI groups.<br />
    You can easily add controls/fields to this form using DuScriptUI.addField
     * @param container - The ScriptUI Object which will contain and display the form.
     * @returns The custom Group containing the form.
     */
    function form(container: Window | Panel | Group): DuForm;
    /**
     * Creates a panel with tabs
     * @param container - The ScriptUI Object which will contain and display the panel.
     * @param tabOrientation - The orientation to use for tab buttons.
     * @returns The panel.
     */
    function tabPanel(container: Window | Panel | Group, tabOrientation: string): DuTabPanel;
    /**
     * Builds all the tabs from all the tab panels
     */
    function buildAllTabs(): void;
    /**
     * Creates a new color selector and adds it to the container
     * @param [helpTip] - The help tip to show on the selector
     */
    function colorSelector(container: Window | Panel | Group, helpTip?: string): DuColorSelector;
    /**
     * Creates a multi button popup
     * @param container - The ScriptUI Object which will contain and display the multi button.
     * @param [text] - The text.
     * @param [image] - The path to the icon (or a PNG as a string representation). Default: empty string
     * @param [helpTip] - The help tip to show on the multi button
     * @param [ignoreUIMode = false] - Will show texte even if the ui mode is set to > 1 in the script settings
     * @returns - The multiButton
     */
    function multiButton(container: Window | Panel | Group, text?: string, image?: string | DuBInary, helpTip?: string, ignoreUIMode?: boolean): DuSelector;
    /**
     * Show this progress bar before long operations with {@link DuProgressBar.show} and DuESF will update it.
     */
    var progressBar: DuProgressBar;
    /**
     * Creates a toolbar with a lighter background
     * @param container - The ScriptUI Object which will contain and display the toolbar.
     * @param [numCols] - The number of columns to use when adding the buttons.
     * @returns The toolbar, a ScriptUI Group
     */
    function toolBar(container: Panel | Window | Group, numCols?: int): Group;
    /**
     * Adds a new {@link DuLibrary} to the container.
     * @param container - The ScriptUI Object which will contain and display the library.
     * @param library - A library object. Key/value pairs, values being {@link DuLibraryItem} objects, keys being their display name.
     * @param [options] - Options and other values.
     */
    function library(container: Panel | Window | Group, library: DuLibraryItem, options?: any): void;
    /**
     * Creates a {@link DuSettingField} which can be enabled or disabled
     * @param container - The ScriptUI Object which will contain and display the setting.
     * @param [text] - The label of the setting
     * @param [minimumLabelWidth] - The minmimum width of the label
     * @returns The setting created.
     */
    function settingField(container: Panel | Window | Group, text?: string, minimumLabelWidth?: int): DuSettingField;
    /**
     * Adds a function to be run periodically, which will be connected to several UI events, fired when the user interacts with the UI.
     * @param func - The function to connect to the UI
     * @param [timeOut = 3000] - A timeOut in milliseconds which prevents the function to be run too often
     * @returns a unique identifier to be used to remove the function later, with {@link DuScriptUI.removeEvent}.
     */
    function addEvent(func: (...params: any[]) => any, timeOut?: int): int;
    /**
     * Removes a function previously added with {@link DuScriptUI.addEvent}.
     * @param id - The id of the function
     */
    function removeEvent(id: int): void;
    /**
     * The default alignment of children of containers with "column" orientation
     */
    var defaultColumnAlignment: String[];
    /**
     * The default alignment of children of containers with "row" orientation
     */
    var defaultRowAlignment: String[];
    /**
     * The default alignment of children of containers with "stack" orientation
     */
    var defaultStackAlignment: String[];
    /**
     * The default spacing of containers
     */
    var defaultSpacing: int;
    /**
     * The default margins of containers
     */
    var defaultMargins: int;
    /**
     * A bar used to show current funding status.
     */
    var fundingBar: ProgressBar;
    /**
     * A label used to show current funding status.
     */
    var fundingLabel: StaticText;
    /**
     * Runs the installation wizard for the script (asks for files and network access, asks the language...).
     * @param callback - The function to execute when ready.<br />
    This function should be the one which loads the script.
     * @param [ui] - A container to display the UI. A modal Dialog is created if omitted
     * @param [scriptName = DuESF.scriptName] - The name of the script, used in the UI.
     * @param [reInit = false] - Set to true to display to prompt to reinit/reinstall the script below the button to ask for file access.
     * @param [reInitMethod] - A function to run in order to reinit/reinstall the script as soon as we get file access, before running the callback
     */
    function setupScript(callback: (...params: any[]) => any, ui?: Panel | Window, scriptName?: string, reInit?: boolean, reInitMethod?: (...params: any[]) => any): void;
    /**
     * Creates a drop down selector for layers
     * @param container - The ScriptUI Object which will contain and display the selector.
     * @param [helpTip = ""] - The help tip.
     * @returns - The selector
     */
    function layerSelector(container: Window | Panel | Group, helpTip?: string): DuAELayerSelector;
    /**
     * Creates a drop down selector for compositions
     * @param container - The ScriptUI Object which will contain and display the selector.
     * @param [helpTip = ""] - The help tip.
     * @returns - The selector
     */
    function compSelector(container: Window | Panel | Group, helpTip?: string): DuAECompSelector;
    /**
     * Creates a two-column group to allow the user to pick layers
     * @param container - The ScriptUI Object which will contain and display the selector.
     * @returns The picker.
     */
    function layerPicker(container: Window | Panel | Group): DuAELayerPicker;
    /**
     * Creates a dialog with a DuAELayerPicker<br />
    Use {@link DuScriptUI.showUI} to show it after creation.
     * @param title - The title of the dialog.
     * @returns The dialog window.
     */
    function layerPickerDialog(title: string): DuAELayerPickerDialog;
    /**
     * Creates a selector to choose a selection mode
     * @param [minimalMode = DuAE.SelectionMode.SELECTED_PROPERTIES] - The lowest mode to use
     * @returns The selector
     */
    function selectionModeSelector(minimalMode?: DuAE.SelectionMode): DuSelector;
}

/**
 * For use with {@link DuScriptUI}.<br />
A title bar.<br />
This is not a real class, and cannot be instanciated.<br />
Use {@link DuScriptUI.titleBar} to create  title bar.<br />
The itle bar inherits the <code>Group</code> object from ScriptUI and has all of its properties and methods.
 * @property pinned - True when the title bar has been pinned and the corresponding panel should not be hidden.
 * @property onClose - The function to execute when the close button is clicked
 * @property onPin - The function to execute when the pin button is clicked
 */
declare class DuTitleBar {
    /**
     * True when the title bar has been pinned and the corresponding panel should not be hidden.
    */
    pinned: boolean;
    /**
     * The function to execute when the close button is clicked
    */
    onClose: DuTitleBar~onClose;
    /**
     * The function to execute when the pin button is clicked
    */
    onPin: DuTitleBar~onPin;
}

declare namespace DuTitleBar {
    /**
     * The function to execute when the close button is clicked
     */
    type onClose = () => void;
    /**
     * The function to execute when the pin button is clicked
     * @param pinned - Wether the bar has been pin or not
     */
    type onPin = (pinned: boolean) => void;
}

/**
 * For use with {@link DuScriptUI}.<br />
A Panel or Window.<br />
This is not a real class, and cannot be instanciated.<br />
Use {@link DuScriptUI.mainPanel} to create a Panel.<br />
The DuPanel inherits the Panel or Window object from ScriptUI and has all of its properties and methods.
 */
declare class DuPanel {
    /**
     * The ScriptUI group where the new controls must be added. Do not add any control directly inside the DuPanel.
     */
    content: Group;
    /**
     * A function to reload a script in this panel.
     * @param file - The script to reload.
     * @returns true on success, false otherwise.
     */
    refreshUi(file: File): boolean;
}

/**
 * For use with {@link DuScriptUI}.<br />
A borderless popup, to be tied to a ui control.<br />
This is not a real class, and cannot be instanciated.<br />
Use {@link DuScriptUI.popUp} to create a Popup.<br />
The DuPopup inherits the Window object from ScriptUI and has all of its properties and methods.
 * @property content - The ScriptUI group where the new controls must be added. Do not add any control directly inside the DuPopup.
 * @property pinned - true if this popup is "pinned", which means it won't hide when the user clicks outside of the window.
 * @property build - You can use this callback to add a function which builds the UI of the popup, it will be called on first display.
 */
declare class DuPopup {
    /**
     * Ties the popup to a ui control. The popup will be shown just above the control when it is clicked.<br />
    The control must have an addEventListener method.
     * @param [control] - The control
     * @param [onShift = false] - If set to true, the popup is tied on Shift + Click only
     * @param [alwaysBlock = false] - If true, the popup will never be automatically shown. Call show() to show it.
     */
    static tieTo(control?: ScriptUI, onShift?: boolean, alwaysBlock?: boolean): void;
    /**
     * Pins the popup (it won't be hidden anymore when deactivated).
     * @param [pinned = true] - true to pin the popup, false to un-pin it.
     */
    static pin(pinned?: boolean): void;
    /**
     * Hides the popup.
     */
    static hidePopup(): void;
    /**
     * Hides the popup (alias for {@link DuPopup.hidePopup}).
     */
    cancel(): void;
    /**
     * Sets this parameter to <code>true</code> to prevent the next show of the popup.<br />
    This will prevent it from showing once (and only once).
     */
    static block: boolean;
    /**
     * The ScriptUI group where the new controls must be added. Do not add any control directly inside the DuPopup.
    */
    content: Group;
    /**
     * true if this popup is "pinned", which means it won't hide when the user clicks outside of the window.
    */
    pinned: boolean;
    /**
     * You can use this callback to add a function which builds the UI of the popup, it will be called on first display.
    */
    build: DuPopup~build;
}

declare namespace DuPopup {
    /**
     * You can use this callback to add a function which builds the UI of the popup, it will be called on first display.<br />
    This allows a faster startup of your script by delaying the creation of the tabs which are hidden at startup.<br />
    You can add controls in the <code>this.content</code> object.
     */
    type build = () => void;
}

/**
 * For use with {@link DuScriptUI}.<br />
A Panel or Window.<br />
This is not a real class, and cannot be instanciated.<br />
Use {@link DuScriptUI.scriptPanel} to create a Panel.<br />
 * @property settingsGroup - The ScriptUI group where to add the UI for the settings of the script.
 * @property mainGroup - The ScriptUI group where to add the main UI of the script.
 * @property onApplySettings - Called when the apply settings button is clicked.
 * @property onResetSettings - Called when the reset (default) settings button is clicked.
 */
declare class DuScriptPanel extends DuPanel {
    /**
     * Adds some settings common to all scripts (the file, highlight color, languages...)
     */
    addCommonSettings(): void;
    /**
     * The ScriptUI group where to add the UI for the settings of the script.
    */
    settingsGroup: Group;
    /**
     * The ScriptUI group where to add the main UI of the script.
    */
    mainGroup: Group;
    /**
     * Called when the apply settings button is clicked.
    */
    onApplySettings: DuScriptPanel~onApplySettings;
    /**
     * Called when the reset (default) settings button is clicked.
    */
    onResetSettings: DuScriptPanel~onResetSettings;
}

declare namespace DuScriptPanel {
    /**
     * The function to execute when the apply settings button is clicked.
     */
    type onApplySettings = () => void;
    /**
     * The function to execute when the reset settings button is clicked.
     */
    type onResetSettings = () => void;
}

/**
 * For use with {@link DuScriptUI}.<br />
An Image Button.<br />
This is not a real class, and cannot be instanciated.<br />
Use {@link DuScriptUI.button} to create an Image Button.<br />
The Image Button inherits the <code>Group</code> object from ScriptUI and has all of its properties and methods.
 * @property helpLink - A URL to a help page, shown on shift click on the button.
 * @property image - The scriptui object representing the image.
 * @property label - The label
 * @property optionsPopup - A popup for .
 * @property optionsPanel - The ScriptUI Group where to add the options (child of the popup).
 * @property onClick - The function to execute when the button is clicked
 * @property onAltClick - The function to execute when the button is Alt + clicked
 * @property onCtrlClick - The function to execute when the button is Ctrl + clicked
 * @property onCtrlAltClick - The function to execute when the button is Ctrl + Alt + clicked
 * @property onOptions - The function to execute when the options are called (Shift+CLick or click on the options button)
 */
declare class DuButton {
    /**
     * Changes the background color of the button.
     * @param color - the color.
     */
    static setBackgroundColor(color: DuColor): void;
    /**
     * Changes the text color of the button.
     * @param color - the color.
     */
    static setTextColor(color: DuColor): void;
    /**
     * Changes the image of the button.
     * @param image - the image. Changing the image does not work with PNG as strings, a File must be passed.
     */
    static setImage(image: File | DuBInary): void;
    /**
     * Changes the helptip of the button.
     * @param helptip - the helptip.
     */
    static setHelpTip(helptip: string): void;
    /**
     * Changes the text of the button.
     * @param text - the text.
     */
    static setText(text: string): void;
    /**
     * A URL to a help page, shown on shift click on the button.
    */
    helpLink: string;
    /**
     * The scriptui object representing the image.
    */
    image: Image;
    /**
     * The label
    */
    label: StaticText;
    /**
     * A popup for .
    */
    optionsPopup: DuPopup;
    /**
     * The ScriptUI Group where to add the options (child of the popup).
    */
    optionsPanel: Group;
    /**
     * The function to execute when the button is clicked
    */
    onClick: DuButton~onClick;
    /**
     * The function to execute when the button is Alt + clicked
    */
    onAltClick: DuButton~onAltClick;
    /**
     * The function to execute when the button is Ctrl + clicked
    */
    onCtrlClick: DuButton~onCtrlClick;
    /**
     * The function to execute when the button is Ctrl + Alt + clicked
    */
    onCtrlAltClick: DuButton~onCtrlAltClick;
    /**
     * The function to execute when the options are called (Shift+CLick or click on the options button)
    */
    onOptions: DuButton~onOptions;
}

declare namespace DuButton {
    /**
     * The function to execute when the button is clicked.
     */
    type onClick = () => void;
    /**
     * The function to execute when the button is Alt + clicked.
     */
    type onAltClick = () => void;
    /**
     * The function to execute when the button is Ctrl + clicked.
     */
    type onCtrlClick = () => void;
    /**
     * The function to execute when the button is Ctrl + Alt + clicked.
     */
    type onCtrlAltClick = () => void;
    /**
     * The function to execute when the options are called (Shift+CLick or click on the options button).<br/>
    Use the <code>showUI</code> parameter to build the options when the button is clicked without showing any UI.
     * @param showUI - This is set to false when the button is clicked: use this parameter to build the options without showing any UI when needed on all button clicks.
     */
    type onOptions = (showUI: boolean) => void;
}

/**
 * For use with {@link DuScriptUI}.<br />
An Small Button.<br />
This is not a real class, and cannot be instanciated.<br />
Use {@link DuScriptUI.smallbutton} to create a Small Button.<br />
The Small Button inherits the Group object from ScriptUI and has all of its properties and methods.
 * @property helpLink - A URL to a help page, shown on shift click on the button.
 * @property label - The label
 * @property value - A user value stored in the button, which is passed to the onClick method
 * @property onClick - The function to execute when the button is clicked
 */
declare class DuSmallButton {
    /**
     * A URL to a help page, shown on shift click on the button.
    */
    helpLink: string;
    /**
     * The label
    */
    label: StaticText;
    /**
     * A user value stored in the button, which is passed to the onClick method
    */
    value: any;
    /**
     * The function to execute when the button is clicked
    */
    onClick: DuSmallButton~onClick;
}

declare namespace DuSmallButton {
    /**
     * The function to execute when the button is clicked.<br />
    The implementation of this function can take one parameter which is the used defined value of the button.
     * @param value - The used defined value of the button
     */
    type onClick = (value: any) => void;
}

/**
 * For use with {@link DuScriptUI}.<br />
A DuSeparator.<br />
This is not a real class, and cannot be instanciated.<br />
Use {@link DuScriptUI.separator} to create a DuSeparator.<br />
The DuSeparator inherits the Group object from ScriptUI and has all of its properties and methods.
 * @property label - the label
 * @property checkable - Read-Only | true if a checkbox is displayed
 */
declare class DuSeparator {
    /**
     * the label
    */
    label: StaticText | CheckBox;
    /**
     * Read-Only | true if a checkbox is displayed
    */
    checkable: boolean;
}

/**
 * For use with {@link DuScriptUI}.<br />
An Image Checkbox.<br />
This is not a real class, and cannot be instanciated.<br />
Use {@link DuScriptUI.checkBox} to create an Image Checkbox.<br />
The Image Checkbox inherits the Group object from ScriptUI and has all of its properties and methods.
 * @property image - The scriptui object representing the image, if any
 * @property label - The label, if any
 * @property text - The current text
 * @property textChecked - The text to display when the checkbox is checked
 * @property defaultText - The text to display when the checkbox is unchecked
 * @property checked - The checked state of the button
 * @property textColor - The color of the text of the label
 * @property onClick - The function to execute when the button is clicked
 */
declare class DuCheckBox {
    /**
     * Sets the checked state of the button
     * @param [checked = true] - The state
     */
    static setChecked(checked?: boolean): void;
    /**
     * The scriptui object representing the image, if any
    */
    image: Image;
    /**
     * The label, if any
    */
    label: StaticText;
    /**
     * The current text
    */
    text: string;
    /**
     * The text to display when the checkbox is checked
    */
    textChecked: string;
    /**
     * The text to display when the checkbox is unchecked
    */
    defaultText: string;
    /**
     * The checked state of the button
    */
    checked: boolean;
    /**
     * The color of the text of the label
    */
    textColor: DuColor;
    /**
     * The function to execute when the button is clicked
    */
    onClick: DuCheckBox~onClick;
}

declare namespace DuCheckBox {
    /**
     * The function to execute when the button is clicked.
     */
    type onClick = () => void;
}

/**
 * For use with {@link DuScriptUI}.<br />
A drop down selector.<br />
This is not a real class, and cannot be instanciated.<br />
Use {@link DuScriptUI.selector} to create a Selector.<br />
The Selector inherits the Group object from ScriptUI and has all of its properties and methods.
 * @property image - The path to the current image (or a PNG as a string representation)
 * @property icon - The Image currently displayed
 * @property label - The current text
 * @property items - The buttons, each one is an array with [text, image, helptip]
 * @property index - The current index
 * @property text - The current text
 * @property currentData - The current data
 * @property onChange - The function to execute when the index changes.<br />
You can set your own function here, which must take no argument.<br />
The method is called after the index has changed.
 * @property onRefresh - The function to execute to refresh the content.<br />
You can set your own function here, which must take no argument.
 */
declare class DuSelector {
    /**
     * Adds a new button to the selector
     * @param [text] - The text displayed by the button
     * @param [image] - The icon, either a path to the file or a PNG represented as a string.
     * @param [helpTip] - The help tip for the entry
     * @param [data] - Some data to associate with the button.
     */
    static addButton(text?: string, image?: string, helpTip?: string, data?: any): void;
    /**
     * Removes all buttons from the selector. This is the same as {@link Selector.clear}.
     */
    static removeAll(): void;
    /**
     * Removes all buttons from the selector. This is the same as {@link Selector.removeAll}.
     */
    static clear(): void;
    /**
     * Changes the selection and the current index of the selector
     * @param index - The new index
     */
    static setCurrentIndex(index: int): void;
    /**
     * Changes the selection and the current index of the selector, using the text of the selection
     * @param text - The text to select
     * @param [quiet = false] - When true, the onChange() callback will not be triggered.
     */
    static setCurrentText(text: string, quiet?: boolean): void;
    /**
     * The path to the current image (or a PNG as a string representation)
    */
    image: string;
    /**
     * The Image currently displayed
    */
    icon: Image;
    /**
     * The current text
    */
    label: StaticText;
    /**
     * The buttons, each one is an array with [text, image, helptip]
    */
    items: string[][];
    /**
     * The current index
    */
    index: int;
    /**
     * The current text
    */
    text: string;
    /**
     * The current data
    */
    currentData: any;
    /**
     * The function to execute when the index changes.<br />
     * You can set your own function here, which must take no argument.<br />
     * The method is called after the index has changed.
    */
    onChange: Selector~onChange;
    /**
     * The function to execute to refresh the content.<br />
     * You can set your own function here, which must take no argument.
    */
    onRefresh: Selector~onRefresh;
}

declare namespace DuSelector {
    /**
     * The function to execute when the index changes.<br />
    The method is called after the index has changed.
     */
    type onChange = () => void;
    /**
     * The function to execute to refresh the content.
     */
    type onRefresh = () => void;
}

/**
 * For use with {@link DuScriptUI}.<br />
A Nice EditText.<br />
This is not a real class, and cannot be instanciated.<br />
Use {@link DuScriptUI.editText} to create a Nice EditText.<br />
The Nice EditText inherits the Group object from ScriptUI and has all of its properties and methods.
 * @property text - Read-Only | The text displayed
 * @property textColor - The color of the text
 * @property onActivate - Function to execute when activated
 * @property onDeactivate - Function to execute when deactivated
 * @property onChange - Function to execute when text changed
 * @property onEnterPressed - Function to execute when enter key is pressed whil in edit mode
 */
declare class DuEditText {
    /**
     * Changes the text
     * @param text - The new text
     */
    static setText(text: string): void;
    /**
     * Changes the prefix
     * @param prefix - The new prefix
     */
    static setPrefix(prefix: string): void;
    /**
     * Changes the suffix
     * @param suffix - The new suffix
     */
    static setSuffix(suffix: string): void;
    /**
     * Changes the placeholder
     * @param placeholder - The placeholder text
     */
    static setPlaceholder(placeholder: string): void;
    /**
     * Read-Only | The text displayed
    */
    text: string;
    /**
     * The color of the text
    */
    textColor: DuColor;
    /**
     * Function to execute when activated
    */
    onActivate: DuEditText~onActivate;
    /**
     * Function to execute when deactivated
    */
    onDeactivate: DuEditText~onDeactivate;
    /**
     * Function to execute when text changed
    */
    onChange: DuEditText~onChange;
    /**
     * Function to execute when enter key is pressed whil in edit mode
    */
    onEnterPressed: DuEditText~onChange;
}

declare namespace DuEditText {
    /**
     * The function to execute when the text is changed.
     */
    type onChange = () => void;
    /**
     * Function to execute when enter key is pressed whil in edit mode.
     */
    type onEnterPressed = () => void;
    /**
     * The function to execute when the box is activated.
     */
    type onActivate = () => void;
    /**
     * The function to execute when the box is deactivated.
     */
    type onDeactivate = () => void;
}

/**
 * For use with {@link DuScriptUI}.<br />
A "Browse" button for folders only, with an optional text field for the path.<br />
This is not a real class, and cannot be instanciated.<br />
Use {@link DuScriptUI.folderSelector} to create a selector.<br />
The DuFolderSelector inherits the Group object from ScriptUI and has all of its properties and methods.
 * @property path - The folder path, initialized with an empty string. Note that this may not point to an existing folder if the user entered an incorrect path in the text field.<br />
To be sure to get an existing folder, you can use the getFolder() method.
 * @property editText - The text field, if any.
 * @property button - The "Browse" button.
 */
declare class DuFolderSelector {
    /**
     * Gets the selected folder.
     * @returns The new Folder, if any. null if the Folder does not exist or the user has input an incorrect path.
     */
    static getFolder(): Folder | null;
    /**
     * The folder path, initialized with an empty string. Note that this may not point to an existing folder if the user entered an incorrect path in the text field.<br />
     * To be sure to get an existing folder, you can use the getFolder() method.
    */
    path: string;
    /**
     * The text field, if any.
    */
    editText: DuEditText | null;
    /**
     * The "Browse" button.
    */
    button: DuButton;
}

/**
 * For use with {@link DuScriptUI}.<br />
A "Browse" button for files only, with an optional text field for the path.<br />
This is not a real class, and cannot be instanciated.<br />
Use {@link DuScriptUI.fileSelector} to create a selector.<br />
The DuFileSelector inherits the Group object from ScriptUI and has all of its properties and methods.
 * @property path - The file path, initialized with an empty string. Note that this may not point to an existing folder if the user entered an incorrect path in the text field.<br />
To be sure to get an existing file, you can use the getFile() method.
 * @property editText - The text field, if any.
 * @property button - The "Browse" button.
 * @property onChange - A function called when the file has changed.
 */
declare class DuFileSelector {
    /**
     * Gets the selected file.
     * @returns The new File, if any. null if the File does not exist or the user has input an incorrect path.
     */
    static getFile(): File | null;
    /**
     * The file path, initialized with an empty string. Note that this may not point to an existing folder if the user entered an incorrect path in the text field.<br />
     * To be sure to get an existing file, you can use the getFile() method.
    */
    path: string;
    /**
     * The text field, if any.
    */
    editText: DuEditText | null;
    /**
     * The "Browse" button.
    */
    button: DuButton;
    /**
     * A function called when the file has changed.
    */
    onChange: DuFileSelector~onChange;
}

declare namespace DuFileSelector {
    /**
     * Called when the file has changed.
     */
    type onChange = () => void;
}

/**
 * For use with {@link DuScriptUI}.<br />
A Nice Slider.<br />
This is not a real class, and cannot be instanciated.<br />
Use {@link DuScriptUI.slider} to create a Nice Slider.<br />
The Nice Slider inherits the Group object from ScriptUI and has all of its properties and methods.
 * @property value - Read-Only | The current value
 * @property onChanging - Function to execute when changing
 * @property onChange - Function to execute when changed
 */
declare class DuSlider {
    /**
     * Changes the value
     * @param value - The new value
     */
    static setValue(value: int): void;
    /**
     * Read-Only | The current value
    */
    value: int;
    /**
     * Function to execute when changing
    */
    onChanging: DuSlider~onChanging;
    /**
     * Function to execute when changed
    */
    onChange: DuSlider~onChange;
}

declare namespace DuSlider {
    /**
     * Function to execute when changing
     */
    type onChanging = () => void;
    /**
     * Function to execute when changed
     */
    type onChange = () => void;
}

/**
 * For use with {@link DuScriptUI}.<br />
A Form.<br />
This is not a real class, and cannot be instanciated.<br />
Use {@link DuScriptUI.form} to create a Form.<br />
The DuForm inherits the Group object from ScriptUI and has all of its properties and methods.
 * @property labels - The left vertical group
 * @property buttons - The right vertical group
 */
declare class DuForm {
    /**
     * Adds a field to the form
    example: form.addField('Composition:','dropdownlist',['Composition1','Composition2'],'Select a composition')
     * @param label - The label text.
     * @param type - The type of ScriptUI object to add (like 'button','edittext', etc.).
     * @param [value] - The default value or content of the field added, depends on the type.
     * @param [helpTip] - The helpTip of the form control.
     * @returns An array with at 0 the StaticText label, and at 1 the ScriptUI object of the type type, added to the form
     */
    static addField(label: string, type: string, value?: any, helpTip?: string): ScriptUI[];
    /**
     * The left vertical group
    */
    labels: Group;
    /**
     * The right vertical group
    */
    buttons: Group;
}

/**
 * For use with {@link DuScriptUI}.<br />
A Panel with tabs.<br />
This is not a real class, and cannot be instanciated.<br />
Use {@link DuScriptUI.tabPanel} to create a picker.<br />
The DuTabPanel inherits the Group object from ScriptUI and has all of its properties and methods.
 * @property buttons - The buttons for the tabs. Not that an "index" property is added to the button, containing the DuTab index.
 * @property tabs - The tabs.
 * @property index - The currently visible tab.
 * @property buttonsGroup - The ScriptUI Group containing the buttons
 * @property mainGroup - The ScriptUI Group containing the tabs
 * @property scriptUIPanel - The file name ("script.jsx") of a scriptUI Panel. Alt+Click on this tab will open/close this panel.
 * @property onChange - Called when the index changes.
 */
declare class DuTabPanel {
    /**
     * Adds a new empty DuTab in the DuTabPanel.
     * @param [text = ''] - The label of the button.
     * @param [image = ''] - The path to the icon.
     * @param [helpTip = ''] - The helptip.
     * @param [translatable = true] - Set to false to not translate this tab text and helptip
     * @returns The new DuTab.
     */
    static addTab(text?: string, image?: string, helpTip?: string, translatable?: boolean): DuTab;
    /**
     * Sets the current visible tab.
     * @param [index = 0] - The index of the tab to show.
     */
    static setCurrentIndex(index?: int): void;
    /**
     * The buttons for the tabs. Not that an "index" property is added to the button, containing the DuTab index.
    */
    buttons: DuButton[];
    /**
     * The tabs.
    */
    tabs: DuTab[];
    /**
     * The currently visible tab.
    */
    index: int;
    /**
     * The ScriptUI Group containing the buttons
    */
    buttonsGroup: Group;
    /**
     * The ScriptUI Group containing the tabs
    */
    mainGroup: Group;
    /**
     * The file name ("script.jsx") of a scriptUI Panel. Alt+Click on this tab will open/close this panel.
    */
    scriptUIPanel: string;
    /**
     * Called when the index changes.
    */
    onChange: DuTabPanel~onChange;
}

declare namespace DuTabPanel {
    /**
     * Called when the index changes.
     */
    type onChange = () => void;
}

/**
 * For use with {@link DuScriptUI}.<br />
A DuTab inside a {@link DuTabPanel}.<br />
This is not a real class, and cannot be instanciated.<br />
Use {@link DuTabPanel.add} to create a new DuTab.
 * @property index - The index of this tab.
 * @property button - The button associated with this tab.
 * @property onActivate - The function to execute when the tab is displayed.
 * @property onActivate - The function to execute when the tab is hidden.
 * @property build - You can use this callback to add a function which builds the UI of the tab, it will be called on first display.
 */
declare class DuTab {
    /**
     * The index of this tab.
    */
    index: int;
    /**
     * The button associated with this tab.
    */
    button: DuButton;
    /**
     * The function to execute when the tab is hidden.
    */
    onActivate: DuTab~tabDeActivated;
    /**
     * The function to execute when the tab is hidden.
    */
    onActivate: DuTab~tabDeActivated;
    /**
     * You can use this callback to add a function which builds the UI of the tab, it will be called on first display.
    */
    build: DuTab~build;
}

declare namespace DuTab {
    /**
     * The function to execute when the tab is about to be displayed.
     */
    type tabActivated = () => void;
    /**
     * The function to execute when the tab is hidden.
     */
    type tabDeActivated = () => void;
    /**
     * You can use this callback to add a function which builds the UI of the tab, it will be called on first display.<br />
    This allows a faster startup of your script by delaying the creation of the tabs which are hidden at startup.<br />
    You can add controls in the <code>this</code> object.
     */
    type build = () => void;
}

/**
 * For use with {@link DuScriptUI}.<br />
A color selector, with an edittext and a random button.<br />
This is not a real class, and cannot be instanciated.<br />
Use {@link DuScriptUI.colorSelector} to create a Selector.<br />
The Selector inherits the Group object from ScriptUI and has all of its properties and methods.
 */
declare class DuColorSelector {
    /**
     * The current color
     */
    static color: DuColor;
    /**
     * Sets the current color
     * @param color - The new color
     */
    static setColor(color: DuColor): void;
    /**
     * Method called when the has been changed
     */
    static onChange: DuColorSelector~onChange;
}

declare namespace DuColorSelector {
    /**
     * The function to execute when the color is changed.
     */
    type onChange = () => void;
}

/**
 * For use with {@link DuScriptUI}.<br />
A multi button popup.<br />
This is not a real class, and cannot be instanciated.<br />
Use {@link DuScriptUI.multiButton} to create a DuMultiButton.<br />
The DuMultiButton inherits the Group object from ScriptUI and has all of its properties and methods.
 * @property label - The current text
 * @property buttons - The buttons
 * @property text - The current text
 * @property build - You can use this callback to add a function which builds the UI of the popup, it will be called on first display.
 */
declare class DuMultiButton {
    /**
     * The current text
    */
    label: StaticText;
    /**
     * The buttons
    */
    buttons: DuButton[];
    /**
     * The current text
    */
    text: string;
    /**
     * You can use this callback to add a function which builds the UI of the popup, it will be called on first display.
    */
    build: DuMultiButton~build;
}

declare namespace DuMultiButton {
    /**
     * You can use this callback to add a function which builds the content of the popup, it will be called on first display.<br />
    This allows a faster startup of your script by delaying the creation of the tabs which are hidden at startup.<br />
    You can use <code>this.addButton</code> to add buttons in the popup.
     */
    type build = () => void;
}

/**
 * Constructs a progress bar popup
 * @param [title = "Magic is happening"] - The title of the progress bar
 * @param [container] - A ScriptUI Group to add the progress bar. If not provided, the bar will be added in a new window popup
 */
declare class DuProgressBar {
    constructor(title?: string, container?: Group);
    /**
     * Changes the text of the label
     * @param message - The text
     */
    msg(message: string): void;
    /**
     * Changes the text of the current stage
     * @param message - The text
     */
    stg(message: string): void;
    /**
     * Shows the progress bar and updates the value and text
     * @param [message = ''] - The text
     * @param [eventCoordinates] - Provide the screen coordinates to center the progress bar on the corresponding screen.
     */
    show(message?: string, eventCoordinates?: int[]): void;
    /**
     * Hides and resets the progress bar to 0 and default texts
     */
    reset(): void;
    /**
     * Updates and increments the progress bar
     * @param [value] - The new value. if omitted, the bar is just incremented by 1
     * @param [message] - A new label
     */
    hit(value?: int, message?: string): void;
    /**
     * Sets the maximum value
     * @param maxValue - The new maximum value
     * @param [onlyIfZero = true] - Set to false to change the max value even if it was not 0 before
     */
    setMax(maxValue: int, onlyIfZero?: boolean): void;
    /**
     * Increments the maximum value
     * @param [maxValue = 1] - The value to add to the maximum
     */
    addMax(maxValue?: int): void;
    /**
     * Hides the progress bar
     */
    hide(): void;
    /**
     * Closes the progress bar
     */
    close(): void;
}

/**
 * For use with {@link DuScriptUI}.<br />
A complete library interface.<br />
This is not a real class, and cannot be instanciated.<br />
Use {@link DuScriptUI.library} to create a Library.<br />
The Library inherits the <code>Group</code> object from ScriptUI and has all of its properties and methods.
 * @property list - The Listbox with the current items for the library.
Items are extended with new properties, see {@link DuListItem} for more details.
 * @property library - The associated library data. Use setLibrary to change it.
 * @property onRun - The function used to run the selected item.
 * @property onAltRun - The function used to run the selected item with alt click.
 * @property onCtrlRun - The function used to run the selected item with ctrl click.
 * @property onCtrlAltRun - The function used to run the selected item with ctrl alt click.
 * @property onEditData - The function to execute to edit data.
 * @property onFolderOpened - The function to open a containing folder
 * @property onFolderEdited - The function to edit the folder
 * @property onAddItem - The function to execute when adding a new item.
 * @property onEditItem - The function to execute when editing an item.
 * @property onRemoveItem - The function to execute when removing an item.
 * @property onRefresh - The function to execute to refresh the library.
 * @property setLibrary - Sets a new library. May be called from onRefresh to replace the lib by a new one.
 * @property runItem - Runs the selected item. Tied to the apply/run button by default.
 */
declare class DuLibrary extends Group {
    /**
     * The Listbox with the current items for the library.
     * Items are extended with new properties, see {@link DuListItem} for more details.
    */
    list: ListBox;
    /**
     * The associated library data. Use setLibrary to change it.
    */
    library: DuLibraryItem;
    /**
     * The function used to run the selected item.
    */
    onRun: DuLibrary~onRun;
    /**
     * The function used to run the selected item with alt click.
    */
    onAltRun: DuLibrary~onAltRun;
    /**
     * The function used to run the selected item with ctrl click.
    */
    onCtrlRun: DuLibrary~onCtrlRun;
    /**
     * The function used to run the selected item with ctrl alt click.
    */
    onCtrlAltRun: DuLibrary~onCtrlAltRun;
    /**
     * The function to execute to edit data.
    */
    onEditData: DuLibrary~onEditData;
    /**
     * The function to open a containing folder
    */
    onFolderOpened: DuLibrary~onFolderOpened;
    /**
     * The function to edit the folder
    */
    onFolderEdited: DuLibrary~onFolderEdited;
    /**
     * The function to execute when adding a new item.
    */
    onAddItem: DuLibrary~onAddItem;
    /**
     * The function to execute when editing an item.
    */
    onEditItem: DuLibrary~onEditItem;
    /**
     * The function to execute when removing an item.
    */
    onRemoveItem: DuLibrary~onRemoveItem;
    /**
     * The function to execute to refresh the library.
    */
    onRefresh: DuLibrary~onRefresh;
    /**
     * Sets a new library. May be called from onRefresh to replace the lib by a new one.
    */
    setLibrary: DuLibrary~setLibrary;
    /**
     * Runs the selected item. Tied to the apply/run button by default.
    */
    runItem: DuLibrary~setLibrary;
}

declare namespace DuLibrary {
    /**
     * The function to execute to refresh the library.
     * @param category - The category to refresh.
     */
    type onRefresh = (category: DuLibraryItem) => void;
    /**
     * Sets a new library. May be called from onRefresh to replace the lib by a new one.
     * @param newLib - The new library.
     */
    type setLibrary = (newLib: DuLibraryItem) => void;
    /**
     * The function used to run the selected item.
     * @param item - The item to run/apply.
     */
    type onRun = (item: DuListItem) => void;
    /**
     * The function used to run the selected item.
     * @param item - The item to run/apply.
     */
    type onAltRun = (item: DuListItem) => void;
    /**
     * The function used to run the selected item.
     * @param item - The item to run/apply.
     */
    type onCtrlRun = (item: DuListItem) => void;
    /**
     * The function used to run the selected item.
     * @param item - The item to run/apply.
     */
    type onCtrlAltRun = (item: DuListItem) => void;
    /**
     * The function used to edit an item data.
     * @param item - The item to edit.
     */
    type onEditData = (item: DuListItem) => void;
    /**
     * The function to open a containing folder.
     * @param item - The item to edit.
     * @param category - The current category.
     */
    type onFolderOpened = (item: DuListItem, category: any) => void;
    /**
     * The function to edit the folder.
     * @param item - The item to edit.
     * @param category - The current category.
     */
    type onFolderEdited = (item: DuListItem, category: any) => void;
    /**
     * The function to execute when adding a new item.
     * @param category - The current category.
     */
    type onAddItem = (category: any) => void;
    /**
     * The function to execute when adding a new item.
     * @param category - The current category.
     */
    type onAddItem = (category: any) => void;
    /**
     * The function to execute when removing an item.
     * @param item - The item to remove.
     * @param category - The current category.
     */
    type onRemoveItem = (item: DuListItem, category: any) => void;
}

/**
 * For use with {@link DuScriptUI}.<br />
An item in a custom listbox used with {@link DuLibrary}.<br />
This is not a real class, and cannot be instanciated.<br />
Use {@link DuScriptUI.library} to create a Library.<br />
The Library has a <code>list</code> property which is a ScriptUI <code>ListBox</code> which contains these DuListItem.<br />
DuListItem inherits the <code>Item</code> object from ScriptUI and has all of its properties and methods.
 * @property data - The data associated with the item, depends on the library object passed to the DuLibrary.
 * @property libType - The type of item, one of ['item', 'category', 'parent']
 * @property editableData - Wether this item data can be edited by the user.
 * @property editableItem - Whether this item can be edited by the user.
 */
declare class DuListItem {
    /**
     * The data associated with the item, depends on the library object passed to the DuLibrary.
    */
    data: any;
    /**
     * The type of item, one of ['item', 'category', 'parent']
    */
    libType: string;
    /**
     * Wether this item data can be edited by the user.
    */
    editableData: boolean;
    /**
     * Whether this item can be edited by the user.
    */
    editableItem: boolean;
}

/**
 * For use with {@link DuLibrary}.<br />
An item in a library.
 * @property data - The data associated with the item.
 * @property libType - The type of item, one of ['item', 'category']
 * @property editableData - Wether this item data can be edited by the user.
 * @property editableItem - Whether this item can be edited by the user.
 * @property icon - Either the path to an image or a png representation as a string.
 */
declare class DuLibraryItem {
    /**
     * The data associated with the item.
    */
    data: any;
    /**
     * The type of item, one of ['item', 'category']
    */
    libType: string;
    /**
     * Wether this item data can be edited by the user.
    */
    editableData: boolean;
    /**
     * Whether this item can be edited by the user.
    */
    editableItem: boolean;
    /**
     * Either the path to an image or a png representation as a string.
    */
    icon: string;
}

/**
 * For use with {@link DuScriptUI}.<br />
An Setting field, which can be enabled or disabled.<br />
This is not a real class, and cannot be instanciated.<br />
Use {@link DuScriptUI.settingField} to create setting field.<br />
The DuSettingField inherits the <code>Group</code> object from ScriptUI and has all of its properties and methods.
 * @property onClick - The function to execute when the checkbox is clicked
 */
declare class DuSettingField {
    /**
     * The function to execute when the checkbox is clicked
    */
    onClick: DuSettingField~onClick;
}

declare namespace DuSettingField {
    /**
     * The function to execute when the checkbox is clicked.
     */
    type onClick = () => void;
}

/**
 * The Open Cut Out library
 */
declare namespace OCO {
    /**
     * Types of OCO armatures
     */
    enum Type {
        /**
         * A meta-rig, used to automatically create a default armature to be used with an auto-rig.
         */
        META = "meta",
        /**
         * An actual (rigged) character.
         */
        CHARACTER = "character"
    }
    /**
     * Predefined limbs
     */
    enum Limb {
        SPINE = "spine",
        ARM = "arm",
        LEG = "leg",
        TAIL = "tail",
        WING = "wing",
        HAIR = "hair",
        SNAKE_SPINE = "snakeSpine",
        FISH_SPINE = "fishSpine",
        FIN = "fin",
        CUSTOM = "custom"
    }
    /**
     * Some bone identifierss
     */
    enum Bone {
        CUSTOM = "custom",
        TIP = "tip",
        CLAVICLE = "clavicle",
        HUMERUS = "humerus",
        RADIUS = "radius",
        CARPUS = "carpus",
        FINGER = "finger",
        HEEL = "heel",
        FEMUR = "femur",
        TIBIA = "tibia",
        TARSUS = "tarsus",
        TOE = "toe",
        HIPS = "hips",
        SPINE = "spine",
        TORSO = "torso",
        NECK = "neck",
        SKULL_TIP = "skullTip",
        SKULL = "skull",
        TAIL = "tail",
        TAIL_ROOT = "tail1",
        TAIL_MID = "tail2",
        TAIL_END = "tail3",
        FEATHER = "feather",
        SNAKE_SPINE_ROOT = "snakeSpine1",
        SNAKE_SPINE_MID = "snakeSpine2",
        SNAKE_SPINE_END = "snakeSpine3",
        FISH_SPINE_ROOT = "fishSpine1",
        FISH_SPINE_MID = "fishSpine2",
        FISH_SPINE_END = "fishSpine3",
        HAIR = "hair",
        HAIR_ROOT = "hair1",
        HAIR_MID = "hair2",
        HAIR_END = "hair3",
        FIN = "fin",
        FIN_FISHBONE = "finBone"
    }
    /**
     * Types of limbs
     */
    enum LimbType {
        HOMINOID = "hominoid",
        PLANTIGRADE = "plantigrade",
        DIGITIGRADE = "digitigrade",
        UNGULATE = "ungulate",
        ARTHROPOD = "arthropod",
        CUSTOM = "custom"
    }
    /**
     * Sides for the limbs Use these with {@link OCO.Location} to differenciate similar limbs,<br />
    for example, a leg can be Front-Right, Front-Left, Back-Right, Back-Left, etc.
     */
    enum Side {
        LEFT = "L",
        RIGHT = "R",
        NONE = ""
    }
    /**
     * Locations for the limbs. Use these with {@link OCO.Side} to differenciate similar limbs,<br />
    for example, a leg can be Front-Right, Front-Left, Back-Right, Back-Left, etc.
     */
    enum Location {
        FRONT = "Fr",
        BACK = "Bk",
        TAIL = "Tl",
        MIDDLE = "Md",
        ABOVE = "Ab",
        UNDER = "Un",
        NONE = ""
    }
    /**
     * View axis for limbs.
     */
    enum View {
        FRONT = 0,
        LEFT = 1,
        RIGHT = 2,
        BACK = 3,
        TOP = 4,
        BOTTOM = 5
    }
    /**
     * How images are encoded in the OCO file
     */
    enum ImageEncoding {
        PNG_BASE64 = "PNG/BASE64",
        RELATIVE_PATH = "PATH",
        ABSOLUTE_PATH = "ABS_PATH"
    }
    /**
     * The OCO Configuration. This is changed everytime a new OCOConfig object is instantiated.
     * @example
     * new OCOConfig('path/to/the/OCO.config');
    OCO.config === ocoConf; // This is true, OCO.config has been changed by the previous line.
    var configPath = OCO.config.path(); // Returns the path of the current config file.
     */
    var config: OCOConfig;
    /**
     * Gets the boundaries of an armature (a chain of bones)
     * @param armature - The chain of bones
     * @returns [left, top, right, bottom]
     */
    function getBounds(armature: OCOBone[]): float[];
}

/**
 * Sets a new config file to be used by OCO
 * @param [ocoConfigFile] - The config file to be used. If not set, will use the default file in the user's documents OCO folder.
 */
declare class OCOConfig {
    constructor(ocoConfigFile?: string | File);
    /**
     * Sets the config file to be used by OCO
     * @param [ocoConfigFile] - The config file to be used. If not set, will use the default file in the user's documents OCO folder.<br/>
    If this is a File object, it's encoding will be ignored and always be set to UTF-8, as per the OCO specifications.
     * @returns Success.
     */
    setConfig(ocoConfigFile?: string | File): boolean;
    /**
     * Get the current config file
     * @returns The File object representing the config file.
     */
    absoluteURI(): File | null;
    /**
     * Sets a new Key/Value pair in the config.
    The key
     * @param key - The key. It can be a path-like string (i.e. 'after effects/bone type').
     * @param value - The value to set
     */
    set(key: string, value: any): void;
    /**
     * Gets a value from the config. The key can be a path separated by /
     * @property key - The setting to get
     * @property [defaultValue = null] - The default value if the key is not set in the settings
     * @returns The value
     */
    get(): any;
}

/**
 * Creates a new OCO Library
 * @param [path] - The path of the library. If omitted, it will use the current path as saved in the current OCO.config; else it will be saved in the current OCO.config.
 */
declare class OCOLibrary {
    constructor(path?: string | Folder);
}

/**
 * Creates a new OCO Document.
 * @param name - The name of the character or the meta rig
 */
declare class OCODoc {
    constructor(name: string);
    /**
     * The type of this OCO Doc
     */
    static type: string;
    /**
     * The name of this OCO Doc
     */
    static name: string;
    /**
     * The height of the character. Should always be 1!
     */
    static height: float;
    /**
     * The width of the character.
     */
    static width: float;
    /**
     * The coordinates of the center of mass of the character. [X, Y].
     */
    static centerOfMass: float[];
    /**
     * The resolution, in pixels, of the document
     */
    resolution: int[];
    /**
     * The world origin in pixels in the document
     */
    world: float[];
    /**
     * The definition
     */
    pixelsPerCm: float;
    /**
     * An icon or thumbnail path
     */
    icon: string;
    /**
     * How images should be encoded when exporting the doc to a file/folder
     */
    imageEncoding: OCO.ImageEncoding;
    /**
     * Finds the spine
     * @returns The spine.
     */
    getSpine(): OCOLimb | null;
    /**
     * Recursively gets all the limbs contained in the doc
     * @returns The array of all limbs
     */
    getLimbs(): OCOLimb[];
    /**
     * Counts the total number of bones in this doc
     */
    numBones(): int;
    /**
     * Counts the total number of limbs in this doc
     */
    numLimbs(): int;
    /**
     * Gets the boundaries of the doc
     * @returns [left, top, right, bottom]
     */
    bounds(): float[];
    /**
     * Updates the width and height of the character, according to the content.<br />
    This method should be called each time a limb/bone is added/removed/edited and the bounds may change.
     */
    updateSize(): void;
    /**
     * Creates a new limb and adds it to the doc
     * @param [limb = OCO.Limb.CUSTOM] - A Predefined limb
     * @param [side = OCO.Side.NONE] - The side of the limb
     * @param [location = OCO.Location.NONE] - The location of the limb
     * @param [type = OCO.LimbType.CUSTOM] - The type of the limb
     * @returns The new limb
     */
    newLimb(limb?: OCO.Limb, side?: OCO.Side, location?: OCO.Location, type?: OCO.LimbType): OCOLimb;
    /**
     * Creates a new arm.
     * @param [type = OCO.LimbType.HOMINOID] - The type of limb
     * @param [side = OCO.Side.LEFT] - The side
     * @param [shoulder = false] - Whether to create a shoulder
     * @param [arm = true] - Whether to create an arm / humerus
     * @param [forearm = true] - Whether to create a forearm
     * @param [hand = true] - Whether to create a hand
     * @param [claws = false] - Whether to add claws
     * @param [position] - The position of the first bone of the arm.<br />
    If omitted, computed automatically according to the current character in the doc.
     * @param [location = OCO.Location.FRONT] - The location of the limb
     * @param [view] - The view
     * @returns The arm
     */
    newArm(type?: OCO.LimbType, side?: OCO.Side, shoulder?: boolean, arm?: boolean, forearm?: boolean, hand?: boolean, claws?: boolean, position?: float[], location?: OCO.Location, view?: OCO.View): OCOLimb;
    /**
     * Creates a new leg.
     * @param [type = OCO.LimbType.HOMINOID] - The type of limb
     * @param [side = OCO.Side.LEFT] - The side
     * @param [thigh = true] - Whether to create a thigh
     * @param [calf = true] - Whether to create a calf
     * @param [foot = true] - Whether to create a foot
     * @param [claws = false] - Whether to add claws
     * @param [position] - The position of the first bone of the arm.<br />
    If omitted, computed automatically according to the current character in the doc.
     * @param [location = OCO.Location.BACK] - The location of the limb
     * @param [view] - The view
     * @returns The leg
     */
    newLeg(type?: OCO.LimbType, side?: OCO.Side, thigh?: boolean, calf?: boolean, foot?: boolean, claws?: boolean, position?: float[], location?: OCO.Location, view?: OCO.View): OCOLimb;
    /**
     * Creates a new spine.
     * @param [head = true] - Whether to create a head
     * @param [neck = 1] - Number of neck bones
     * @param [spine = 2] - Number of spine bones
     * @param [hips = true] - Whether to create hips
     * @param [position] - The position of the first bone of the arm.<br />
    If omitted, computed automatically according to the current character in the doc.
     * @param [view] - The view
     * @returns The spine
     */
    newSpine(head?: boolean, neck?: int, spine?: int, hips?: boolean, position?: float[], view?: OCO.View): OCOLimb;
    /**
     * Creates a new tail.
     * @param [numBones = 3] - Number of tail bones
     * @returns The spine
     */
    newTail(numBones?: int): OCOLimb;
    /**
     * Creates a new hair strand.
     * @param [numBones = 3] - Number of hair bones
     * @returns The hair
     */
    newHairStrand(numBones?: int): OCOLimb;
    /**
     * Creates a new wing.
     * @param [side = OCO.Side.LEFT] - The side
     * @param [arm = true] - Whether to create an arm / humerus
     * @param [forearm = true] - Whether to create a forearm
     * @param [hand = true] - Whether to create a hand
     * @param [feathers = 5] - Number of feathers
     * @param [position] - The position of the first bone of the arm.<br />
    If omitted, computed automatically according to the current character in the doc.
     * @param [view = OCO.View.TOP] - The view
     * @returns The wing
     */
    newWing(side?: OCO.Side, arm?: boolean, forearm?: boolean, hand?: boolean, feathers?: int, position?: float[], view?: OCO.View): OCOLimb;
    /**
     * Creates a new snake spine.
     * @param [head = true] - Whether to create a head
     * @param [spine = 5] - Number of spine bones
     * @param [position] - The position of the first bone of the arm.<br />
    If omitted, computed automatically according to the current character in the doc.
     * @returns The snake spine
     */
    newSnakeSpine(head?: boolean, spine?: int, position?: float[]): OCOLimb;
    /**
     * Creates a new fish spine.
     * @param [head = true] - Whether to create a head
     * @param [spine = 3] - Number of spine bones
     * @param [position] - The position of the first bone of the spine.<br />
    If omitted, computed automatically according to the current character in the doc.
     * @returns The fish spine
     */
    newFishSpine(head?: boolean, spine?: int, position?: float[]): OCOLimb;
    /**
     * Creates a new fin.
     * @param [side = OCO.Side.LEFT] - The side
     * @param [fishbones = 5] - Number of feathers
     * @param [position] - The position of the first bone of the arm.<br />
    If omitted, computed automatically according to the current character in the doc.
     * @param [view = OCO.View.RIGHT] - The view
     * @returns The fin
     */
    newFin(side?: OCO.Side, fishbones?: int, position?: float[], view?: OCO.View): OCOLimb;
    /**
     * Converts a doc coordinate/value in centimeters to pixel coordinates.<br/>
    For multidimensionnal values (coordinates), the origin is adjusted from doc to image.
     * @param point - The coordinate to convert
     * @returns The coordinates in pixels
     */
    toPixels(point: float[]): int[];
    /**
     * Converts coordinates in pixels in the world to centimeters coordinates in the doc<br/>
    For multidimensionnal values (coordinates), the origin is adjusted image to doc.
     * @param point - The coordinate to convert
     * @returns The coordinates in centimeters relative to the doc
     */
    fromPixels(point: float[] | float): float[] | float;
    /**
     * Creates a js object containing this document data.<br/>
    This object could then be exported to JSON for example.
     * @returns the JS Object
     */
    toObject(): any;
    /**
     * Creates a JSON string representing this document
     * @param [imageEncoding = OCO.ImageEncoding.PATH] - How to encode images in the OCO File
     * @param [destinationFile] - If imageEncoding is `OCO.ImageEncoding.PATH`, you must provide the OCO file to make the paths relative to it.
     * @returns the JSON document
     */
    toJson(imageEncoding?: OCO.ImageEncoding, destinationFile?: File): string;
    /**
     * Exports the current document to an oco file
     * @param file - The file.
     * @returns the file.
     */
    toFile(file: File | string): File;
    /**
     * Gets all the bones sorted by z index
     * @returns The list of bones
     */
    getBones(): OCOBone[];
    /**
     * Normalizes the Z indices of all bones so they're positive (including 0) and continuous integers.
     * @param [offset = 0] - An offset/start number
     * @returns The highest index
     */
    normalizeZIndices(offset?: int): int;
    /**
     * Finds the maximum and minimum Z index from all bones
     * @returns The [min, max] Z indices
     */
    static zBounds(): int[];
    /**
     * Extracts the icon from the OCO file
     * @param file - The OCO file
     * @param [destination] - The destination file if the file is included in the OCO file. Next to the OCO file by default.
     * @returns The icon file, or null if there was no icon/the file could not be written.
     */
    static extractIcon(file: string | File, destination?: string | File): File;
    /**
     * Creates a new doc by reading a file
     * @param file - The file
     * @returns The document or null if the file couldn't be read or parsed
     */
    static fromFile(file: File | string): OCODoc | null;
}

/**
 * Creates a new OCO Limb.
 * @param [limb = OCO.Limb.CUSTOM] - A Predefined limb
 * @param [side = OCO.Side.NONE] - The side of the limb
 * @param [location = OCO.Location.NONE] - The location of the limb
 * @param [type = OCO.LimbType.CUSTOM] - The type of the limb
 */
declare class OCOLimb {
    constructor(limb?: OCO.Limb, side?: OCO.Side, location?: OCO.Location, type?: OCO.LimbType);
    /**
     * The limbs/ Armatures
     */
    static limbs: OCOLimb[];
    /**
     * The predefined limb
     */
    static limb: OCO.Limb;
    /**
     * The type of the limb
     */
    static type: OCO.LimbType;
    /**
     * The sided of the limb
     */
    static side: OCO.Side;
    /**
     * The location of the limb
     */
    static location: OCO.Location;
    /**
     * The location of the limb
     */
    static location: OCO.Location;
    /**
     * Counts the total number of bones in this limb
     */
    numBones(): int;
    /**
     * Counts the total number of limbs in this limb
     */
    numLimbs(): int;
    /**
     * Recursively gets all the children limbs of this limb
     * @returns The array of all limbs
     */
    getLimbs(): OCOLimb[];
    /**
     * Gets the boundaries of the limb
     * @returns [left, top, right, bottom]
     */
    bounds(): float[];
    /**
     * Creates a new chain of bones and adds it to the limb.
     * @param name - The name of the bones (will increment if needed)
     * @param [num = 2] - The number of bones in the chain
     * @param [length = 100.0] - The length in centimeters
     * @returns The root bone.
     */
    newArmature(name: string, num?: int, length?: float): OCOBone;
    /**
     * Creates a js object containing this limb data.<br/>
    This object could then be exported to JSON for example.
     * @returns The JS Object
     */
    toObject(): any;
    /**
     * Normalizes the Z indices of all bones so they're positive (including 0) and continuous integers
     * @param [offset = 0] - An offset/start number
     * @returns The highest index
     */
    normalizeZIndices(offset?: int): int;
    /**
     * Gets all the bones sorted by z index
     * @returns The list of bones
     */
    getBones(): OCOBone[];
    /**
     * Finds the maximum and minimum Z index from all bones
     * @returns The [min, max] Z indices
     */
    zBounds(): int[];
    /**
     * Creates a limb from a js object.
     * @param data - The js object representing the limb
     * @returns The new limb
     */
    static fromObject(data: any): OCOLimb;
}

/**
 * Creates a new OCO Bone.
 * @param name - The name
 */
declare class OCOBone {
    constructor(name: string);
    /**
     * The name of the bone
     */
    static name: string;
    /**
     * The x coordinate of the bone
     */
    static x: float;
    /**
     * The y coordinate of the bone
     */
    static y: float;
    /**
     * An arbitrary Z-index. Higher is under, lower is above
     */
    static zIndex: int;
    /**
     * true if this bone is attached to its parent.
     */
    static attached: boolean;
    /**
     * The child bones.
     */
    static children: OCOBone[];
    /**
     * The child limbs.
     */
    static limbs: OCOLimb[];
    /**
     * The type of bone.
     */
    static type: OCO.Bone;
    /**
     * The envelop of the bone,<br/>
    In a meta rig, this is a silhouette which will contain the design,
    and can be used to help locate the joint, link the design to the bone, etc.<br/>
    In a rigged character, this should be a simple silhouette close to the artwork silhouette.
     */
    envelop: any;
    /**
     * The length of the bone (this distance with its first child)
     * @returns The length
     */
    length(): int;
    /**
     * Creates a new limb and adds it to the bone
     * @param [limb = OCO.Limb.CUSTOM] - A Predefined limb
     * @param [side = OCO.Side.NONE] - The side of the limb
     * @param [location = OCO.Location.NONE] - The location of the limb
     * @param [type = OCO.LimbType.CUSTOM] - The type of the limb
     * @returns The new limb
     */
    newLimb(limb?: OCO.Limb, side?: OCO.Side, location?: OCO.Location, type?: OCO.LimbType): OCOLimb;
    /**
     * Counts the total number of child bones
     */
    numBones(): int;
    /**
     * Counts the total number of child limbs
     */
    numLimbs(): int;
    /**
     * Recursively gets all the children limbs of this bone
     * @returns The array of all limbs
     */
    getLimbs(): OCOLimb[];
    /**
     * Translates the bone by [x, y] pixels
     * @param [x = 0] - The horizontal offset
     * @param [y = 0] - The vertical offset
     * @param [translateChildren = true] - If false, the children stay at their current location
     */
    translate(x?: int, y?: int, translateChildren?: boolean): void;
    /**
     * Translates the bone to the new coordinates
     * @param [x] - The new X value. If omitted, moves the layer vertically
     * @param [y] - The new Y value. If omitted, moves the layer horizontally
     * @param [translateChildren = true] - If false, the children stay at their current location
     */
    translateTo(x?: int, y?: int, translateChildren?: boolean): void;
    /**
     * Creates a js object containing this bone data.<br/>
    This object could then be exported to JSON for example.
     * @returns the JS Object
     */
    toObject(): any;
    /**
     * Normalizes the Z indices of all bones so they're positive (including 0) and continuous integers
     * @param [offset = 0] - An offset/start number
     * @returns The highest index
     */
    normalizeZIndices(offset?: int): int;
    /**
     * Gets all the bones sorted by z index
     * @returns The list of bones
     */
    getBones(): OCOBone[];
    /**
     * Finds the maximum and minimum Z index from all bones
     * @returns The [min, max] Z indices
     */
    static zBounds(): int[];
    /**
     * Creates a bone from a js object.
     * @param data - The js object representing the bone
     * @returns The new bone
     */
    static fromObject(data: any): OCOBone;
}

/**
 * For use with {@link DuScriptUI}.<br />
A drop down selector.<br />
This is not a real class, and cannot be instanciated.<br />
Use {@link DuScriptUI.layerSelector} to create a Selector.<br />
The Selector inherits the Group object from ScriptUI and has all of its properties and methods.
 * @property [index = 0] - The current layer index, 0 if None
 * @property [comp = null] - The composition linked to the selector.<br />
If set to null, the seletor will use the current active composition.
 * @property [selectedOnly = false] - True to list only selected layers in the composition
 * @property onChange - The function to execute when the index changes.<br />
You can set your own function here, which must take no argument.<br />
The method is called after the index has changed.
 */
declare class DuAELayerSelector {
    /**
     * Changes the selection and the current layer index of the selector
     * @param index - The new layer index
     */
    static setCurrentIndex(index: int): void;
    /**
     * Force the refresh of the layer list
     */
    static refresh(): void;
    /**
     * The current layer index, 0 if None
    */
    index?: int;
    /**
     * The composition linked to the selector.<br />
     * If set to null, the seletor will use the current active composition.
    */
    comp?: CompItem | null;
    /**
     * True to list only selected layers in the composition
    */
    selectedOnly?: boolean;
    /**
     * The function to execute when the index changes.<br />
     * You can set your own function here, which must take no argument.<br />
     * The method is called after the index has changed.
    */
    onChange: Selector~onChange;
}

declare namespace DuAELayerSelector {
    /**
     * The function to execute when the index changes.<br />
    The method is called after the index has changed.
     */
    type onChange = () => void;
}

/**
 * For use with {@link DuScriptUI}.<br />
A drop down selector.<br />
This is not a real class, and cannot be instanciated.<br />
Use {@link DuScriptUI.compSelector} to create a Selector.<br />
The Selector inherits the Group object from ScriptUI and has all of its properties and methods.
 * @property [id = 0] - The current compitem id, 0 if None
 * @property [comps] - The compositions listed in the selector.
 * @property onChange - The function to execute when the index changes.<br />
You can set your own function here, which must take no argument.<br />
The method is called after the index has changed.
 * @property filterComps - A function which gets the comps to set in the selector.<br />
The default function will get all the comps in the project,<br />
You can set your own function here, which must take no argument.<br />
The function must return an array of CompItem.
 */
declare class DuAECompSelector {
    /**
     * Changes the selection and the current comp id of the selector
     * @param index - The new comp id
     */
    static setCurrentId(index: int): void;
    /**
     * Refreshes the comp list
     * @param [comps] - The list of compositions. By default, will use {@link DuAECompSelector.filterComps()} to get the comps.
     */
    static refresh(comps?: CompItem[]): void;
    /**
     * Gets the selected comp
     * @returns the selected comp
     */
    static getComp(): CompItem | null;
    /**
     * The current compitem id, 0 if None
    */
    id?: int;
    /**
     * The compositions listed in the selector.
    */
    comps?: CompItem[];
    /**
     * The function to execute when the index changes.<br />
     * You can set your own function here, which must take no argument.<br />
     * The method is called after the index has changed.
    */
    onChange: Selector~onChange;
    /**
     * A function which gets the comps to set in the selector.<br />
     * The default function will get all the comps in the project,<br />
     * You can set your own function here, which must take no argument.<br />
     * The function must return an array of CompItem.
    */
    filterComps: Selector~filterComps;
}

declare namespace DuAECompSelector {
    /**
     * The function to execute when the index changes.<br />
    The method is called after the index has changed.
     */
    type onChange = () => void;
    /**
     * A function which gets the comps to set in the selector.<br />
    The default function will get all the comps in the project,<br />
    assign another function to this callback if you need to filter these comps.<br />
    The function must return an array of CompItem.
     */
    type filterComps = () => CompItem[];
}

/**
 * For use with {@link DuScriptUI}.<br />
A picker for layers with labels.<br />
This is not a real class, and cannot be instanciated.<br />
Use {@link DuScriptUI.layerPicker} to create a picker.<br />
The picker inherits the Group object from ScriptUI and has all of its properties and methods.
 * @property selectors - The layer selectors
 * @property inputs - The labels texts
 */
declare class DuAELayerPicker {
    /**
     * Empties the DuAELayerPicker
     */
    static removeAll(): void;
    /**
     * Adds a new line on the DuAELayerPicker
     * @param name - The display name of the selector.
     * @returns The added DuAELayerSelector
     */
    static addSelector(name: string): DuAELayerSelector;
    /**
     * The layer selectors
    */
    selectors: DuAELayerSelector[];
    /**
     * The labels texts
    */
    inputs: string[];
}

/**
 * For use with {@link DuScriptUI}.<br />
A picker for layers with labels.<br />
This is not a real class, and cannot be instanciated.<br />
Use {@link DuScriptUI.layerPickerDialog} to create a picker.<br />
The picker inherits the Group object from ScriptUI and has all of its properties and methods.
 * @property layerPicker - The layer picker inside the dialog.
 * @property accepted - This property is true if the user has clicked the OK button, false otherwise.
 */
declare class DuAELayerPickerDialog {
    /**
     * Empties the DuAELayerPicker<br />
    This is a convenience function equivalent to {@link DuAELayerPickerDialog.layerPicker.removeAll}.
     */
    static removeAll(): void;
    /**
     * Adds a new line on the DuAELayerPicker
    This is a convenience function equivalent to {@link DuAELayerPickerDialog.layerPicker.addSelector}.
     * @returns The added DuAELayerSelector
     */
    static addSelector(): DuAELayerSelector;
    /**
     * Gets the layers picked by the user.
     * @returns The layers picked (null if the user has set none in the selector), in the display order.
     */
    static getLayers(): Layer[];
    /**
     * The layer picker inside the dialog.
    */
    layerPicker: DuAELayerPicker;
    /**
     * This property is true if the user has clicked the OK button, false otherwise.
    */
    accepted: boolean;
}

declare namespace DuAELayerPickerDialog {
    /**
     * The function called when the dialog is accepted.
     */
    type onAccept = () => void;
}

/**
 * The Duduf After Effects ExtendScript Framework.<br />
by {@link https://RxLaboratory.org RxLaboratory} and {@link http://duduf.com Duduf}.
 * @example
 * // Encapsulate everything to avoid global variables!
// The parameter is either undefined (stand alone script) or the panel containing the ui (ScriptUI)
(function(thisObj)
{
     // Include the framework
     #include "DuAEF.jsxinc";
     
     // Running the init() method of DuAEF is required to setup everything properly.
     DuAEF.init( "YourScriptName", "1.0.0", "YourCompanyName" );
     
     // These info can be used by the framework to improve UX, but they're optional
     DuESF.chatURL = 'http://chat.rxlab.info'; // A link to a live-chat server like Discord or Slack...
     DuESF.bugReportURL = 'https://github.com/RxLaboratory/DuAEF_Dugr/issues/new/choose'; // A link to a bug report form
     DuESF.featureRequestURL = 'https://github.com/RxLaboratory/DuAEF_Dugr/issues/new/choose'; // A link to a feature request form
     DuESF.aboutURL = 'http://rxlaboratory.org/tools/dugr'; // A link to the webpage about your script
     DuESF.docURL = 'http://dugr.rxlab.guide'; // A link to the documentation of the script
     DuESF.scriptAbout = 'Duduf Groups: group After Effects layers!'; // A short string describing your script
     DuESF.companyURL = 'https://rxlaboratory.org'; // A link to your company's website
     DuESF.rxVersionURL = 'http://version.rxlab.io' // A link to an RxVersion server to check for updates
     
     // Build your UI here, declare your methods, etc.

     // This will be our main panel
     var ui = DuScriptUI.scriptPanel( thisObj, true, true, new File($.fileName) );
     ui.addCommonSettings(); // Automatically adds the language settings, location of the settings file, etc

     DuScriptUI.staticText( ui.settingsGroup, "Hello world of settings!" ); // Adds a static text to the settings panel
     DuScriptUI.staticText( ui.mainGroup, "Hello worlds!" ); // Adds a static text to the main panel
     
     // When you're ready to display everything
     DuScriptUI.showUI(ui);

     // Note that if you don't have a UI or if you don't use DuScriptUI to show it,
     // you HAVE TO run this method before running any other function:
     // DuAEF.enterRunTime();
 
})(this);
 */
declare namespace DuAEF {
    /**
     * The Current DuAEF Version
     */
    const version: string;
    /**
     * The current DuAEF File
     */
    const file: File;
    /**
     * This method has to be called once at the very beginning of the script, just after the inclusion of DuAEF <code>#include DuAEF.jsxinc</code>
     * @param [scriptName = "DuAEF"] - The name of your script, as it has to be displayed in the UI and the filesystem
     * @param [scriptVersion = "0.0.0"] - The version of your script, in the form "XX.XX.XX-Comment", for example "1.0.12-Beta". The "-Comment" part is optional.
     */
    function init(scriptName?: string, scriptVersion?: string): void;
    /**
     * This method has to be called once at the end of the script, when everything is ready and the main UI visible (after any prompt or setup during startup).
     */
    function enterRunTime(): void;
}

/**
 * Constructs a new KeySpatialProperty
 * @property [inTangent = null] - The incoming spatial tangent
 * @property [outTangent = null] - The outgoing spatial tangent
 * @property [_continuous = true] - true if the specified keyframe has spatial continuity
 * @property [_autoBezier = false] - true if the specified keyframe has temporal auto-Bezier interpolation
 * @property [_roving = false] - true if the specified keyframe is roving
 * @param [other] - Another DuAEKeySpatialProperties to create a copy.
 */
declare class DuAEKeySpatialProperties {
    constructor(other?: DuAEKeySpatialProperties);
    /**
     * Clones the DuAEKeySpatialProperties and returns the new one.
     * @returns The new DuAEKeySpatialProperties.
     */
    _clone(): DuAEKeySpatialProperties;
    /**
     * Reverses all the influences (swaps in and out)
     */
    reverse(): void;
    /**
     * The incoming spatial tangent
    */
    inTangent?: float[] | null;
    /**
     * The outgoing spatial tangent
    */
    outTangent?: float[] | null;
    /**
     * true if the specified keyframe has spatial continuity
    */
    _continuous?: boolean;
    /**
     * true if the specified keyframe has temporal auto-Bezier interpolation
    */
    _autoBezier?: boolean;
    /**
     * true if the specified keyframe is roving
    */
    _roving?: boolean;
}

/**
 * Constructs a new DuAEKeyframe
 * @property _time - The keyframe time
 * @property value - The keyframe value
 * @property _inInterpolationType - The incoming temporal interpolation type
 * @property _outInterpolationType - The outgoing temporal interpolation type
 * @property _spatial - true if this keyframe has a spatial value
 * @property spatialProperties - the spatial properties {@linkcode DuAEKeySpatialProperties} of this keyframe
 * @property inEase - The incoming temporal ease. The number of objects in the Array depends on the value type
 * @property outEase - The outgoing temporal ease. The number of objects in the Array depends on the value type
 * @property _continuous - true if the keyframe has temporal continuity
 * @property _autoBezier - true if the keyframe has temporal auto-Bezier interpolation
 * @property _index - The index of the keyFrame. Warning: not updated when another key frame is added on the property some time before this key._time!
 * @param [other] - Another keyframe to create a copy.
 */
declare class DuAEKeyframe {
    constructor(other?: DuAEKeyframe);
    /**
     * Clones the keyframe and returns the new one. <br />
    The keyframe is not added to any property, only the JS object is cloned. Use {@link DuAEProperty.setKey} to add it to a specific property.
     * @returns The new keyframe.
     */
    _clone(): DuAEKeyframe;
    /**
     * Reverses all the influences (swaps in and out)
     */
    reverse(): void;
    /**
     * Checks if all speed eases are 0
     */
    stops(): boolean;
    /**
     * The keyframe time
    */
    _time: float;
    /**
     * The keyframe value
    */
    value: null | folat[] | float | MarkerValue | int | Shape | TextDocument;
    /**
     * The incoming temporal interpolation type
    */
    _inInterpolationType: KeyframeInterpolationType;
    /**
     * The outgoing temporal interpolation type
    */
    _outInterpolationType: KeyframeInterpolationType;
    /**
     * true if this keyframe has a spatial value
    */
    _spatial: boolean;
    /**
     * the spatial properties {@linkcode DuAEKeySpatialProperties} of this keyframe
    */
    spatialProperties: DuAEKeySpatialProperties;
    /**
     * The incoming temporal ease. The number of objects in the Array depends on the value type
    */
    inEase: KeyframeEase[];
    /**
     * The outgoing temporal ease. The number of objects in the Array depends on the value type
    */
    outEase: KeyframeEase[];
    /**
     * true if the keyframe has temporal continuity
    */
    _continuous: boolean;
    /**
     * true if the keyframe has temporal auto-Bezier interpolation
    */
    _autoBezier: boolean;
    /**
     * The index of the keyFrame. Warning: not updated when another key frame is added on the property some time before this key._time!
    */
    _index: int;
}

/**
 * Constructs a new animation
 * @property [_name = ""] - The property name
 * @property [_matchName = ""] - The property matchName
 * @property [keys = []] - The keyframes of the animation
 * @property [startValue = null] - The value at the beginning of the animation
 * @property [expression = ""] - The expression on the property, if any.
 * @property [type = "anim"] - Read Only.
 * @property startTime - Read Only. The starting time of the animation.
 * @property endTime - Read Only. The ending time of the animation.
 */
declare class DuAEPropertyAnimation {
    /**
     * The property name
    */
    _name?: string;
    /**
     * The property matchName
    */
    _matchName?: string;
    /**
     * The keyframes of the animation
    */
    keys?: DuAEKeyframe[];
    /**
     * The value at the beginning of the animation
    */
    startValue?: null | float[] | float | MarkerValue | int | Shape | TextDocument;
    /**
     * The expression on the property, if any.
    */
    expression?: string;
    /**
     * Read Only.
    */
    type?: string;
    /**
     * Read Only. The starting time of the animation.
    */
    startTime: float;
    /**
     * Read Only. The ending time of the animation.
    */
    endTime: float;
}

/**
 * Constructs a new group animation
 * @property [_name = ""] - The property name
 * @property [_matchName = ""] - The property matchName
 * @property [anims = []] - The animations in the group
 * @property [type = "group"] - Read Only.
 * @property startTime - Read Only. The starting time of the animation.
 * @property endTime - Read Only. The ending time of the animation.
 */
declare class DuAEPropertyGroupAnimation {
    /**
     * The property name
    */
    _name?: string;
    /**
     * The property matchName
    */
    _matchName?: string;
    /**
     * The animations in the group
    */
    anims?: DuAEPropertyAnimation[] | DuAEPropertyGroupAnimation[];
    /**
     * Read Only.
    */
    type?: string;
    /**
     * Read Only. The starting time of the animation.
    */
    startTime: float;
    /**
     * Read Only. The ending time of the animation.
    */
    endTime: float;
}

/**
 * Constructs a new layer animation
 * @property [_name = ""] - The property name
 * @property [_index = ""] - The index of the layer
 * @property [anims = []] - All the animations of the layer
 * @property [firstKeyFrameTime = 0] - The time of the first keyframe
 * @property [type = "layer"] - Read Only.
 * @property startTime - Read Only. The starting time of the animation.
 * @property endTime - Read Only. The ending time of the animation.
 */
declare class DuAELayerAnimation {
    /**
     * The property name
    */
    _name?: string;
    /**
     * The index of the layer
    */
    _index?: int;
    /**
     * All the animations of the layer
    */
    anims?: DuAEPropertyGroupAnimation[];
    /**
     * The time of the first keyframe
    */
    firstKeyFrameTime?: float;
    /**
     * Read Only.
    */
    type?: string;
    /**
     * Read Only. The starting time of the animation.
    */
    startTime: float;
    /**
     * Read Only. The ending time of the animation.
    */
    endTime: float;
}

/**
 * Constructs a new DuAEPropertyExpression
 * @param property - The property. If a DuAEPropertyExpression is provided, the constructor returns it (it does not make a copy).<br />
This makes it easy to avoid type checking, as you can always pass any property or DuAEPropertyExpression to the constructor to be sure to handle a DuAEPropertyExpression, without any impact on performance.
 */
declare class DuAEPropertyExpression {
    constructor(property: PropertyBase | DuAEPropertyExpression | DuAEProperty);
    /**
     * The original property containing the expression
     */
    property: PropertyBase;
    /**
     * The original layer containing the expression
     */
    layer: LayerItem;
    /**
     * The original composition containing the expression
     */
    comp: CompItem;
    /**
     * true if there's no expression in this property
     */
    empty: boolean;
    /**
     * The Array containing the indices in all parent property groups containing this property.<br />
    This is used to retrieve the property in case the object becomes invalid.
     */
    parentIndices: int[];
    /**
     * true if the property belongs to an effect.
     */
    isEffect: boolean;
    /**
     * The expression in the property
     */
    expression: string;
    /**
     * true if the expression has been changed in the cache and needs to be re-applied to the property.
     */
    changed: boolean;
    /**
     * true if the expression has an error
     */
    inError: boolean;
    /**
     * Returns the original property, fixing it if the object has become invalid.
     * @returns The property.
     */
    getProperty(): PropertyBase;
    /**
     * Applies the expression back to the actual properties in After Effects, if and only if it's been modified.
     * @param [onlyIfNoError = false] - If true, applies the expression only if it doesn't generate an error
     */
    apply(onlyIfNoError?: boolean): void;
}

/**
 * After Effects general tools
 */
declare namespace DuAE {
    /**
     * The axis or channels
     */
    enum Axis {
        X = 1,
        Y = 2,
        Z = 3,
        RED = 4,
        GREEN = 5,
        BLUE = 6,
        ALPHA = 7,
        HUE = 8,
        SATURATION = 9,
        VALUE = 10
    }
    /**
     * Types of values
     */
    enum Type {
        VALUE = 1,
        SPEED = 2,
        VELOCITY = 3
    }
    /**
     * Abbreviated units used in the UI.<br />
    These strings are localized based on internal After Effects dictionnaries.
     */
    enum Unit {
        PIXELS = "",
        DEGREES = "",
        PERCENT = ""
    }
    /**
     * Units used in the UI<br />
    These strings are localized based on internal After Effects dictionnaries.
     */
    enum UnitText {
        PERCENT = "",
        DEGREES = "",
        PIXELS = ""
    }
    /**
     * Associative array that converts property match names to their compact English expression statements.
     * @example
     * DuAE.CompactExpression["ADBE Transform Group"]
    //returns "'transform'"
     */
    var CompactExpression: any;
    /**
     * Menu Command Ids<br />
    These are the ids which can be found using <code>app.findMenuCommandID("insertMenuNameHere");</code><br />
    Use <code>app.executeCommand(id)</code> to run them.
     * @example
     * app.executeCommand(DuAE.MenuCommandID.COPY); //copies the selection
    app.executeCommand(DuAE.MenuCommandID.PASTE); //pastes the selection
     */
    enum MenuCommandID {
        CUT = 18,
        COPY = 19,
        COPY_WITH_PROPERTY_LINKS = 10310,
        PASTE = 20,
        DUPLICATE = 2080,
        UNDO = 16,
        GENERAL_PREFERENCES = 2359,
        SCRIPTING_PREFERENCES = 3131,
        LAYER_CONTROLS = 2435,
        REVEAL_EXPRESSION_ERRORS = 2731,
        CONVERT_AUDIO_TO_KEYFRAMES = 4218
    }
    /**
     * How to place new layers
     */
    enum LayerPlacement {
        BOTTOM = 0,
        UNDER_LAYER = 1,
        ABOVE_LAYER = 2,
        TOP = 3
    }
    /**
     * Types of layers used by Ae
     */
    enum LayerType {
        NULL = "null",
        SOLID = "solid",
        SHAPE = "shape",
        TEXT = "text",
        ADJUSTMENT = "adjustment",
        LIGHT = "light",
        CAMERA = "camera"
    }
    /**
     * Attributes of layers in Ae
     */
    enum LayerAttribute {
        SELECTED = "selected",
        VISIBLE = "visible",
        AUDIO = "audio",
        SOLO = "solo",
        LOCKED = "locked",
        SHY = "shy",
        EFFECTS_ENABLED = "effects",
        MOTION_BLUR = "motionblur",
        THREE_D = "3d",
        GUIDE = "guide"
    }
    /**
     * Loop types
     */
    enum LoopType {
        HOLD = "hold",
        NONE = "none",
        CYCLE = "cycle",
        PINGPONG = "pingpong",
        OFFSET = "offset",
        CONTINUE = "continue"
    }
    /**
     * How to align in time
     */
    enum TimeAlignment {
        CENTER = "center",
        IN_POINT = "in",
        OUT_POINT = "out"
    }
    /**
     * The type of AE preferences
     */
    enum PrefType {
        BOOL = 0,
        STRING = 1,
        FLOAT = 2,
        LONG = 3
    }
    /**
     * List of file extensions whih may be imported as several items with the same source
     */
    var DuAELayeredFileType: DuList;
    /**
     * Enum for selections
     */
    enum SelectionMode {
        SELECTED_PROPERTIES = 0,
        SELECTED_LAYERS = 1,
        ACTIVE_COMPOSITION = 2,
        SELECTED_COMPOSITIONS = 3,
        ALL_COMPOSITIONS = 4
    }
    /**
     * Default color labels
     */
    const ColorLabels: int[][];
    /**
     * Gets the compact expression synonym of a matchName
     * @param matchName - The matchName of a property
     * @param [name] - A replacement name (or index) in case the compact expression does not exist. If omitted, the matchName will be used.
     * @param [prop] - The original property; may be needed to differenciate between 3D layers / cam / lights, etc
     */
    function getCompactExpression(matchName: string, name?: string, prop?: Proeprty): void;
    /**
     * Checks if After Effects has the given preference
     * @param section - The section of the preferences
     * @param key - The key
     * @param [file = PREFType.PREF_Type_MACHINE_SPECIFIC] - The preference file, from the <code>PREFType</code> enum value of the After Effects API
     * @returns true if the pref exists
     */
    function hasPref(section: string, key: string, file?: PREFType): boolean;
    /**
     * Gets a pref
     * @param section - The section of the preferences
     * @param key - The key
     * @param [file = PREFType.PREF_Type_MACHINE_SPECIFIC] - The preference file, from the <code>PREFType</code> enum value of the After Effects API
     * @param [type = DuAE.PrefType.STRING] - The type of the preference to return
     * @returns The pref or null if it does not exists
     */
    function getPref(section: string, key: string, file?: PREFType, type?: DuAE.PrefType): any | null;
    /**
     * Gets the DuAEProperty for the properties
     * @param props - The Properties
     * @returns The info
     */
    function getDuAEProperty(props: PropertyBase[]): DuAEProperty[];
    /**
     * Checks if the file is a layered type (psd, ai, psb, fla...)
     * @param [file] - The file or the path
     * @returns true if it's a layered file
     */
    function isLayeredFile(file?: string | File): boolean;
    /**
     * Informations about the version of after effects.
     */
    const version: DuVersion;
    /**
     * Checks if the javascript debugger is enabled
     * @returns true if the debugger is enabled.
     */
    function isDebuggerEnabled(): boolean;
    /**
     * Gets the public name of a version of After Effects (like CC2015.3 for version 13.8)
     * @param [versionAsFloat] - The version as a float. If not provided, will default to the current version of the running instance of After Effects.
     * @returns The version name.
     */
    function getAEVersionName(versionAsFloat?: float): string;
    /**
     * Gets the version of After Effects from its public name (like 13.8 for CC2015.3)
     * @param [versionAsFloat] - The version name.
     * @returns The version.
     */
    function getAEVersion(versionAsFloat?: float): DuVersion;
    /**
     * Checks if the current version is higher than a given one
     * @param versionName - The minimum version
     * @returns True if the current version is higher (strict, will be false if they're equal)
     */
    function isVersionHigherThan(versionName: string): boolean;
    /**
     * Checks if the current version is at least a given one
     * @param versionName - The minimum version
     * @returns True if the current version is higher or the same
     */
    function isVersionAtLeast(versionName: string): boolean;
    /**
     * Gets the aerender binary
     * @returns The aerender binary, or null if not found
     */
    function getAeRender(): File | null;
    /**
     * Begins an undoGroup.<br />
    Automatically prepend the group name with the script name.<br />
    Using this method is safer than the native one, as DuAEF will try to avoid opening several undo groups at once.<br />
    The group name is translatable.
     * @param groupName - The name of the Undo Group.
     * @param [autoClose = true] - By default, DuAEF will close any previously opened undogroup (which has a different name) to prevent any error.<br />
    Set this to <code>false</code> in order to ignore this new group beginning and keep the previously opened one.
     */
    function beginUndoGroup(groupName: string, autoClose?: boolean): void;
    /**
     * Ends an undoGroup.<br />
    Using this method is safer than the native one, as DuAEF will try to avoid opening several undo groups at once.
     * @param [groupName] - The name of the Undo Group to end. Use this if you used  {@link DuAE.beginUndoGroup} with the 'autoClose' argument set to false before.
     */
    function endUndoGroup(groupName?: string): void;
    /**
     * Runs app.executeCommand in a safer way, taking care of undogroups.
     * @param commandID - The ID of the command as given by app.findMenuCommandID(), or if it is a string, the name of the command.
     */
    function executeCommand(commandID: int | string): void;
    /**
     * Opens a ScriptUI Panel if it is installed, or displays an alert otherwise.
     * @param panelScriptName - The Script name of the panel "script.jsx"
     */
    function openScriptUIPanel(panelScriptName: string): void;
    /**
     * Cuts the selection (runs the cut menu command)
     */
    function cut(): void;
    /**
     * Copies the selection (runs the copy menu command)
     */
    function copy(): void;
    /**
     * Duplcates the selection (runs the duplicate menu command)
     */
    function duplicate(): void;
    /**
     * Copies the selection with property links (runs the copy menu command)<br />
    Only on versions of After Effects greater than 11.0 (CS6)<br />
    On CS6 and below, a standard copy will be done.
     */
    function copyWithPropertyLinks(): void;
    /**
     * Pastes the selection (runs the paste menu command)
     */
    function paste(): void;
    /**
     * Undoes (runs the undo command)
     */
    function undo(): void;
    /**
     * Checks if the Folder is an Auto-Save folder
     * @param folder - The folder or path to check
     * @returns true if the folder is an auto-save folder
     */
    function isAutoSaveFolder(folder: Folder | string): boolean;
    /**
     * Shows/hides the layer controls
     */
    function toggleLayerControls(): void;
    /**
     * Gets the list of folders where scripts may be installed
     * @param [suboflder] - The name of a subfolder, like "ScriptUI Panels" or "Startup" or "Shutdown"...
     * @returns the list of Folder objects.
     */
    function scriptFolders(suboflder?: string): Folder[];
    /**
     * Converts an AE Collection to an Array<br />
    This method is deprecated, you should use a {@link DuList} otherwise
     * @param collection - The collection to convert
     * @returns The array
     */
    function convertCollectionToArray(collection: any[] | Collection): any[];
}

/**
 * After Effects tag methods<br />
Tags are markers set on the first frame of layers, displaying an info about the layer (usually, a "type" or tag).<br />
These markers are used by DuAEF (and Duik, DuGR, ...) to recognise and manipulate the layers, and to store hidden data.<br />
They're also used assign the layer to groups, which can be used by other scripts, especially DuGR.
 */
declare namespace DuAETag {
    /**
     * The list of paramaters which can be set by DuAEF in tags.
     */
    enum Key {
        /**
         * Used to temporarily store the list of children of the layers.
         */
        CHILD_LAYERS = "childrenLayers",
        /**
         * A list of groups this layer belongs to.
         */
        GROUPS = "groups",
        /**
         * A Custom layer type
        Historically from duik
         */
        LAYER_TYPE = "duik.type"
    }
    /**
     * The list of names used for the markers.<br />
    Names are the string shown to the user on the marker, the comment.<br />
    Note that these names may change as they may be localized and should not be used to manipulate layers, but only shown to the user.
     */
    enum Name {
        /**
         * A layer toggled to edit mode.
         */
        EDIT_MODE = "Edit mode"
    }
    /**
     * The list of types to parse values.
     */
    enum Type {
        STRING = 0,
        BOOL = 1,
        INT = 2,
        ARRAY = 3,
        FLOAT = 4
    }
    /**
     * Set to true so the markers are created before the composition start time and hidden
     */
    var hideTags: boolean;
    /**
     * Sets a new marker/tag (or gets the existing one) on the first frame of the layer.
     * @param layer - The layer to set the tag on.
     * @param [tagName] - The name to display on the marker (the comment of the marker)
     * @param [tag] - An existing tag.
     * @param [hidden = DuAETag.hideTags] - When true, the marker will be created before the layer and comp start time, so it's hidden.
     * @returns The marker (tag), with an extra property <code>keyIndex</code> which is the index of the corresponding keyframe.
     */
    function set(layer: Layer, tagName?: string, tag?: MarkerValue, hidden?: boolean): MarkerValue;
    /**
     * Gets the tag.
     * @param layer - The layer to get the tag from.
     * @returns The marker (tag) or <code>null</code> if not found.
     */
    function get(layer: Layer): MarkerValue | null;
    /**
     * Removes the tag from the layer
     * @param layer - The layer containing the tag.
     * @param [tag] - If you have the tag as returned by {@link DuAETag.get} or {@link DuAETag.set}, providing it here improves performance.
     */
    function remove(layer: Layer, tag?: MarkerValue): void;
    /**
     * Sets the name (comment of the marker) of the tag.
     * @param layer - The layer to get the tag from
     * @param [tagName] - The name to display on the marker (the comment of the marker)
     * @param [tag] - If you have the tag as returned by {@link DuAETag.get} or {@link DuAETag.set}, providing it here improves performance.
     * @returns The name.
     */
    function setName(layer: Layer, tagName?: string, tag?: MarkerValue): string;
    /**
     * Gets the name (comment of the marker) of the tag.
     * @param layer - The layer to get the tag from
     * @returns The name.
     */
    function getName(layer: Layer): string;
    /**
     * Sets a new parameter (a key/value pair) to the hidden parameters stored in the tag.
     * @param layer - The layer to get the tag from.
     * @param key - The key. May be one of {@link DuAETag.Key}.
     * @param value - The value, which needs to be a string.
     * @param [tag] - If you have the tag as returned by {@link DuAETag.get} or {@link DuAETag.set}, providing it here improves performance.
     * @returns Success, may be false if there's no tag on this layer yet.
     */
    function setValue(layer: Layer, key: string, value: string, tag?: MarkerValue): boolean;
    /**
     * Gets the value of a specific key in the tag parameters.
     * @param layer - The layer to get the tag from.
     * @param key - The key. May be one of {@link DuAETag.Key}.
     * @param [type = DuAETag.Type.STRING] - The expected type for the value.
     * @param [tag] - If you have the tag as returned by {@link DuAETag.get} or {@link DuAETag.set}, providing it here improves performance.
     * @returns The value, null if the key was not found.
     */
    function getValue(layer: Layer, key: string, type?: DuAETag.Type, tag?: MarkerValue): any;
    /**
     * Gest the list of the groups this layer belongs to.
     * @param [tag] - If you have the tag as returned by {@link DuAETag.get} or {@link DuAETag.set}, providing it here improves performance.
     * @returns The list of groups. May be an empty list.
     */
    function getGroups(layer: Layer, tag?: MarkerValue): string[];
    /**
     * Assigns the layer to a group.<br >
    If the layer does not have a tag yet, a new one will be created with the group name.
     * @param layer - The layer.
     * @param groupName - The group.
     * @param [tag] - If you have the tag as returned by {@link DuAETag.get} or {@link DuAETag.set}, providing it here improves performance.
     */
    function addGroup(layer: Layer, groupName: string, tag?: MarkerValue): void;
    /**
     * Unassigns the layer from a group.
     * @param layer - The layer.
     * @param groupName - The group.
     * @param [tag] - If you have the tag as returned by {@link DuAETag.get} or {@link DuAETag.set}, providing it here improves performance.
     */
    function removeGroup(layer: Layer, groupName: string, tag?: MarkerValue): void;
    /**
     * Renames a group
     * @param layer - The layer.
     * @param previousName - The current name
     * @param newName - The new name
     * @param [tag] - If you have the tag as returned by {@link DuAETag.get} or {@link DuAETag.set}, providing it here improves performance.
     */
    function renameGroup(layer: Layer, previousName: string, newName: string, tag?: MarkerValue): void;
}

/**
 * Constructs a new DuAEProperty
 * @example
 * var propInfo = new DuAEProperty(property);
layer("ADBE effect parade").addProperty("ADBE layer control"); //now the property object is broken
property = propInfo.getProperty(); // You can retrieve the property like this, fixed if it's an effect
 * @example
 * myFunction (prop) //This function can be passed either a property or a DuAEProperty
{
  propInfo = new DuAEProperty(prop);
  prop = propInfo.getProperty();
}
 * @param property - The property. If a DuAEProperty is provided, the constructor returns it (it does not make a copy).<br />
This makes it easy to avoid type checking, as you can always pass any property or DuAEProperty to the constructor to be sure to handle a DuAEProperty, without any impact on performance.<br />
 */
declare class DuAEProperty {
    constructor(property: PropertyBase | DuAEProperty);
    /**
     * The original name of the property, same as DuAEProperty.getProperty().name
     */
    readonly name: string;
    /**
     * The original matchName of the property, same as DuAEProperty.getProperty().matchName
     */
    readonly matchName: string;
    /**
     * The original name of the property, same as DuAEProperty.getProperty().name
     */
    readonly name: string;
    /**
     * Is this an effect? same as DuAEProperty.getProperty().isEffect
     */
    readonly isEffect: boolean;
    /**
     * The containing effect, if any.
     */
    readonly effect: PropertyGroup | null;
    /**
     * The containing layer
     */
    readonly layer: Layer;
    /**
     * The containing comp
     */
    readonly comp: CompItem;
    /**
     * <p><i><strong>Recursive</strong>: this method can run on a property group.</i></p>
    Recursively runs a method on all nested properties
     * @param func - The function to run. It must take a DuAEProperty object as its single argument
     */
    do(func: (...params: any[]) => any): void;
    /**
     * Checks if this source property is a group of properties or a property
     * @returns True if it's a group
     */
    isGroup(): boolean;
    /**
     * Checks if this source property is a group of properties or a property
     * @returns True if it's a property
     */
    isProperty(): boolean;
    /**
     * Reimplements the <code>Property.isSpatial</code> attribute for convenience.
     * @returns true if the property is spatial.
     */
    isSpatial(): boolean;
    /**
     * Reimplements the <code>Property.isSeparationLeader</code> attribute for convenience.
     * @returns true if the property is a separation leader.
     */
    isSeparationLeader(): boolean;
    /**
     * Reimplements the <code>Property.dimensionsSeparated</code> attribute for convenience.
     * @returns true if the property is a separation leader and has its dimensions seperated.
     */
    dimensionsSeparated(): boolean;
    /**
     * Reimplements the <code>Property.expression</code> attribute for convenience.
     * @returns the expression.
     */
    expression(): string;
    /**
     * Reimplements the <code>Property.value</code> attribute for convenience.
     * @param [preExpression = false] - Set to true to get the pre-expression value.
     * @returns A value appropriate for the type of the property (see Property.propertyValueType), or null if the property doesn't have a value (i.e. it's a group)
     */
    value(preExpression?: boolean): any;
    /**
     * Reimplements the <code>Property.expressionEnabled</code> attribute for convenience.
     * @returns When true, the named property uses its associated expression to generate a value.<br>
    When false, the keyframe information or static value of the property is used. This attribute can be set to true only if canSetExpression for the named property is true and expression contains a valid expression string.
     */
    expressionEnabled(): boolean;
    /**
     * Reimplements the <code>Property.valueAtTime</code> mehtod for convenience.
     * @param [time] - If omitted, the current comp time.
     * @param [preExpression = false] - Set to true to get the pre-expression value.
     * @returns A value appropriate for the type of the property (see Property.propertyValueType), or null if the property doesn't have a value (i.e. it's a group)
     */
    valueAtTime(time?: float, preExpression?: boolean): any;
    /**
     * Reimplements the <code>Property.selectedKeys</code> attribute for convenience.
     * @param [asObject = false] - If true, returns {@link DuAEKeyframe} objects instead of key indices
     * @returns The list of selected keyframe indices.
     */
    selectedKeys(asObject?: boolean): int[];
    /**
     * Reimplements the <code>Property.keyTime</code> method for convenience.
     * @param index - The index of the keyframe.
     * @returns The time of the key.
     */
    keyTime(index: int): float;
    /**
     * Reimplements the <code>Property.keyValue</code> method for convenience.
     * @param index - The index of the keyframe.
     * @returns The value of the key.
     */
    keyValue(index: int): any;
    /**
     * Reimplements the <code>Property.keyValue</code> method for convenience.
     * @param index - The index of the keyframe.
     * @returns The value of the key.
     */
    keyLabel(index: int): any;
    /**
     * Reimplements the <code>Property.removeKey</code> method for convenience.
     * @param key - The index or the keyframe.
     */
    removeKey(key: int | DuAEKeyframe): void;
    /**
     * Reimplements the <code>Property.nearestKeyIndex</code> method for convenience.
     * @param t - The time of the keyframe.
     */
    nearestKeyIndex(t: float): void;
    /**
     * Gets the unit of the property
     * @returns The unit
     */
    unit(): string;
    /**
     * The units text of the property, same as DuAEProperty.getProperty().unitsText
     * @returns The unit
     */
    unitsText(): string;
    /**
     * Whether the value is a percent
     */
    isPercent(): boolean;
    /**
     * Whether the value is an angle
     */
    isAngle(): boolean;
    /**
     * Whether the value is a pixel value
     */
    isPixels(): boolean;
    /**
     * Check if this is a dropdown property or effect.<br />
    Note: On After Effects < 17.0.1 this always returns false.
     */
    isDropdown(): boolean;
    /**
     * Gets the number of keyframes in the property
     * @param [recursive = true] - If true and this is a group, returns the number of keyframes of all contained property
     */
    numKeys(recursive?: boolean): int;
    /**
     * Checks if this property has some keyframes
     * @param [recursive = true] - If true and this is a group, checks all contained properties
     */
    hasKeys(recursive?: boolean): boolean;
    /**
     * Checks if this property has some expressions
     * @param [recursive = true] - If true and this is a group, checks all contained properties
     */
    hasExpressions(recursive?: boolean): boolean;
    /**
     * Reimplements the <code>PropertyGroup.numProperties</code> attribute.<br />
    Use this to be sure to get the right number of props, in case some have been added or removed after the creation of the DuAEProperty object.
     * @returns The number of sub-properties.
     */
    numProperties(): int;
    /**
     * Reimplements the <code>PropertyGroup.setSelectedAtKey</code> method.
     * @param key - The key to (un)select
     * @param [selected = true] - Whether to select or unselect
     */
    setSelectedAtKey(key: int | DuAEKeyframe, selected?: boolean): void;
    /**
     * Reimplements the <code>PropertyGroup.property()</code> method for convenience.
     * @param index - Either the name, matchName or the index.
     * @returns The sub-property as DuAEProperty object or null if not found.
     */
    prop(index: string | int): DuAEProperty | null;
    /**
     * Getter for the <code>PropertyBase.parentProperty</code> attribute for convenience.
     * @returns The parent property or null if not found.
     */
    parentProperty(): DuAEProperty | null;
    /**
     * Reimplements the <code>Property.setPropertyParameters()</code> method.<br/>
    <p>Works around issues caused by the AE API:<br/>
    - The property object is invalidated (-> fix: use of DuAEProperty.getProperty)<br/>
    - The effect loses its name (-> fix: name is reset afterwards)<br/>
    - Names are not sanitized and may throw errors (-> fix: names are sanitized so no errors are thrown)<br/>
    - Throws an error on AE < 17.0.1 (-> fix: just do nothing in this case)</p>
    This method can be called either from the actual Property or its containing effect.
     * @param names - The list of names.
     */
    setPropertyParameters(names: string[]): void;
    /**
     * Gets the original Property<br />
    Always works even if this DuAEProperty represents an effect which has been broken<br />
    ---AE Hack---
     * @returns The property
     */
    getProperty(): PropertyBase;
    /**
     * Gets the number of dimensions of a property
     * @returns The number of dimensions, 0 if this is not a dimensionnal value (ie color, text, shape...)
     */
    dimensions(): int;
    /**
     * Checks if this property value can be edited
     * @returns true if the value of the property can be edited, false otherwise
     */
    editable(): boolean;
    /**
     * Checks if a property is part of the master properties of a precomp
     * @returns true if property is part of the master properties
     */
    isMasterProperty(): boolean;
    /**
     * Checks if this property value can be rigged (with an expression)
     * @returns true if the value of the property can be rigged, false otherwise
     */
    riggable(): boolean;
    /**
     * Gets the key at a given index on a property
     * @param keyIndex - The index of the key to retrieve. If the index is negative, it is counted from the end i.e. to retrieve the keyframe before the last one, use -2 (-1 is the last)
     * @returns The keyframe, or null if incorrect index
     */
    keyAtIndex(keyIndex: int): DuAEKeyframe;
    /**
     * Gets the nearest key at a given time on a property
     * @param [time] - The time of the key to retrieve. The current time by default.
     * @returns The keyframe, or null if incorrect time or not found
     */
    nearestKeyAtTime(time?: float): DuAEKeyframe | null;
    /**
     * Gets the key at an exactly given time on a property
     * @param time - The time of the key to retrieve.
     * @returns The keyframe, or null if incorrect time
     */
    keyAtTime(time: float): DuAEKeyframe;
    /**
     * Gets the property keyframes in the whole timeline or in the time range<br />
    The DuAEKeyframe._time will be adjusted relatively to the start of the time range instead of the startTime of the composition.
     * @param [selected = false] - true to get only selected keyframes.
     * @param [timeRange] - The time range, an array of two time values, in seconds. If not provided, will use the comp time range.<br />
    Ignored if selected is true;
     * @returns The keyframes, or null of this property is of type PropertyValueType.NO_VALUE or PropertyValueType.CUSTOM_VALUE
     */
    keys(selected?: boolean, timeRange?: float[]): DuAEKeyframe[];
    /**
     * <p><i><strong>Recursive</strong>: this method can run on a property group.</i></p>
    Recursilvely gets all animations in the property and subproperties in the whole timeline or in the time range<br />
    The first DuAEKeyframe._time will be adjusted relatively to the start of the time range (if provided) instead of the startTime of the composition.
     * @param [selected = false] - true to get only selected keyframes.
     * @param [timeRange] - The time range, an array of two time values, in seconds. If not provided, will use the comp time range.
     * @returns The animations. A DuAEPropertyAnimation if prop is a Property, a PopertyGroupAnim if it is a PropertyGroup
     */
    animation(selected?: boolean, timeRange?: float[]): DuAEPropertyGroupAnimation | DuAEPropertyAnimation;
    /**
     * <p><i><strong>Recursive</strong>: this method can run on a property group.</i></p>
    Recursilvely gets the time of the first keyFrame in this prop or subprops
     * @param [selected = false] - true to check selected keyframes only
     * @returns The keyframe time or null if there are no keyframe
     */
    firstKeyTime(selected?: boolean): float | null;
    /**
     * <p><i><strong>Recursive</strong>: this method can run on a property group.</i></p>
    Recursilvely gets the time of the last keyFrame in this prop or subprops
     * @param [selected = false] - true to check selected keyframes only
     * @returns The keyframe time or null if there are no keyframe
     */
    lastKeyTime(selected?: boolean): float | null;
    /**
     * Sets a {@linkcode DuAEKeyframe} on a property
     * @param key - The DuAEKeyframe.
     * @param [timeOffset = comp.time] - The time offset (added to DuAEKeyframe._time) where to add the key frame.
     * @returns Success
     */
    setKey(key: DuAEKeyframe, timeOffset?: float): boolean;
    /**
     * Checks if the property value is a number or an Array of Number.<br >
    I.e if its value type is one of: one D, two D, three D (spatial or not), Color.
     */
    numerical(): boolean;
    /**
     * Sets a value on a property, adjusting the dimensions if needed
     * @param value - The value to set
     * @param [defaultTime = comp().time] - The time at which to set the value if the property has keyframes
     * @returns True if the value has correctly been set, false otherwise.
     */
    setValue(value: any, defaultTime?: float): boolean;
    /**
     * Adds a new key
     * @param [typeIn = KeyframeInterpolationType.LINEAR] - The in interpolation type (see AE API) or the string "roving" or "continuous"
     * @param [typeOut = typeIn] - The out interpolation type (see AE API)
     * @param [time] - If omitted, the current comp time
     * @param [easeInValue = 33] - The in interpolation ease value (used if typeIn is KeyframeInterpolationType.BEZIER)
     * @param [easeOutValue = easeInValue] - The out interpolation ease value (used if typeOut is KeyframeInterpolationType.BEZIER)
     */
    addKey(typeIn?: KeyframeInterpolationType | string, typeOut?: KeyframeInterpolationType | string, time?: float, easeInValue?: int[] | int, easeOutValue?: int[] | int): void;
    /**
     * Sets a new keyframe on a property, adjusting the dimensions if needed, at desired time
     * @param value - The value to set
     * @param [time] - The time of the new keyframe
     * @returns True if the value has correctly been set, false otherwise.
     */
    setValueAtTime(value: any, time?: float): boolean;
    /**
     * Sets a new keyframe value, adjusting the dimensions if needed
     * @param value - The value to set
     * @param key - The index the keyframe
     * @returns True if the value has correctly been set, false otherwise.
     */
    setValueAtKey(value: any, key: int): boolean;
    /**
     * Sets the property animation on the property. This is a lower-level method than {@link DuAEProperty#setAnimation DuAEProperty.setAnimation()}.<br />
    Use this method only to force the animation onto the property without checks.<br />
    Must be used on a Property (not a group) with a DuAEPropertyAnimation (not a DuAEPropertyGroupAnimation).<br />
    To easily set an animation on a property with automatic compatibility checks, you should use <code>setAnimation()</code>.
     * @param anim - The animation
     * @param [time = comp.time] - The time where to begin the animation
     * @param [setExpression = false] - Sets the expression too
     * @param [replace = false] - true to remove any existing keyframe on the properties before adding new keyframes
     * @param [offset = false] - true to offset the current value, instead of replacing it
     * @returns true if the anim was actually set.
     */
    setAnim(anim: DuAEPropertyAnimation, time?: float, setExpression?: boolean, replace?: boolean, offset?: boolean): boolean;
    /**
     * <p><i><strong>Recursive</strong>: this method can run on a property group.</i></p>
    Sets all animations on a Property or a PropertyGroup.
     * @param anim - The animation
     * @param [time = comp().time] - The time where to begin the animation
     * @param [ignoreName = false] - true to set the anim even if name of the property do not match the animation.
     * @param [setExpression = false] - Sets the expression too
     * @param [onlyKeyframes = true] - If false, the value of properties without keyframes will be set too.
     * @param [replace = false] - true to remove any existing keyframe on the properties before adding new keyframes
     * @param [whiteList] - A list of matchNames used as a white list for properties to set anims.<br />
    Can be the matchName of a propertyGroup to set all the subproperties.<br />
    Ignored if the list is empty.
     * @param [offset = false] - true to offset the current value, instead of replacing it
     * @param [offsetTransform = false] - When set to true, the transform (position, rotation) values will be offset to 0 before applying the animation.
     * @returns true if the anim was actually set.
     */
    setAnimation(anim: DuAEPropertyAnimation | DuAEPropertyGroupAnimation, time?: float, ignoreName?: boolean, setExpression?: boolean, onlyKeyframes?: boolean, replace?: boolean, whiteList?: string[], offset?: boolean, offsetTransform?: boolean): boolean;
    /**
     * <p><i><strong>Recursive</strong>: this method can run on a property group.</i></p>
    Removes the animation from the property
     * @param [removeExpression = false] - Set to true to remove the expression too
     * @returns The animations. A DuAEPropertyAnimation if prop is a Property, a PopertyGroupAnim if it is a PropertyGroup
     */
    removeAnimation(removeExpression?: boolean): DuAEPropertyGroupAnimation | DuAEPropertyAnimation;
    /**
     * <p><i><strong>Recursive</strong>: this method can run on a property group.</i></p>
    Removes the animation from the property and returns it
     * @param prop - The property
     * @param [removeExpression = false] - Set to true to remove the expression too
     */
    takeAnimation(prop: Property | DuAEProperty, removeExpression?: boolean): void;
    /**
     * <p><i><strong>Recursive</strong>: this method can run on a property group.</i></p>
    Selects the keyframes in the propoerty.<br />
    Selects all nested keyframes if the property is a group.
     * @param [inTime = 0] - The time at which to select the keyframes
     * @param [outTime = inTime] - The end time
     */
    selectKeys(inTime?: float, outTime?: float): void;
    /**
     * Gets an expression link to the property
     * @param [useThisComp = false] - Whether to begin the expression by 'thisComp' or 'comp("name")'
     * @param [fromLayer = true] - Whether to begin the expression by comp.layer or directly from the first prop of the layer
     * @returns The expression link to the property
     */
    expressionLink(useThisComp?: boolean, fromLayer?: boolean): str;
    /**
     * Sets interpolations on a keyframe.
     * @param key - The key index
     * @param typeIn - The in interpolation type (see AE API) or the string "roving" or "continuous"
     * @param [typeOut = typeIn] - The out interpolation type (see AE API)
     * @param [easeInValue = 33] - The in interpolation ease value (used if typeIn is KeyframeInterpolationType.BEZIER)
     * @param [easeOutValue = easeInValue] - The out interpolation ease value (used if typeOut is KeyframeInterpolationType.BEZIER)
     */
    setKeyInterpolation(key: int, typeIn: KeyframeInterpolationType | string, typeOut?: KeyframeInterpolationType | string, easeInValue?: int[] | int, easeOutValue?: int[] | int): void;
    /**
     * Changes the ease influences of the selected keys
     * @param props - The properties
     * @param [easeInValue] - The in interpolation ease value. Will be ignored if undefined.
     * @param [easeOutValue] - The out interpolation ease value. Will be ignored if undefined.
     * @param [velocityInValue] - The out interpolation ease value. Will be ignored if undefined.
     * @param [velocityOutValue] - The out interpolation ease value. Will be ignored if undefined.
     * @param [velocityAsPercent = false] - Use a percent instead of a value to set velocities.<br />
    In this case, the proper velocity value will be deduced by multiplying the max speed of the property by the percent.
     */
    setEase(props: PropertyBase[] | PropertyInfo[], easeInValue?: int[] | int, easeOutValue?: int[] | int, velocityInValue?: int[] | int, velocityOutValue?: int[] | int, velocityAsPercent?: boolean): void;
    /**
     * Sets the speed of a keyframe.
     * @param key - The key index
     * @param speed - The speed
     */
    setKeySpeed(key: int, speed: float): void;
    /**
     * <p><i><strong>Recursive</strong>: this method can run on a property group.</i></p>
    Sets interpolations for all keyframes.
     * @param typeIn - The in interpolation type (see AE API) or the string "roving" or "continuous"
     * @param [typeOut = typeIn] - The out interpolation type (see AE API)
     * @param [easeInValue = 33] - The in interpolation ease value (used if typeIn is KeyframeInterpolationType.BEZIER)
     * @param [easeOutValue = easeInValue] - The out interpolation ease value (used if typeOut is KeyframeInterpolationType.BEZIER)
     * @param [selectedKeyframesOnly = false] - If true, only set the selected keyframes.
     */
    setInterpolation(typeIn: KeyframeInterpolationType | string, typeOut?: KeyframeInterpolationType | string, easeInValue?: int[] | int, easeOutValue?: int[] | int, selectedKeyframesOnly?: boolean): void;
    /**
     * Computes a percentage from a velocity on a given keyframe.
     * @param keyIndex - The index of the keyframe where to compute the velocity
     * @returns The velocities [in, out] as a percentage.
     */
    velocityToPercent(keyIndex: int): float[];
    /**
     * <p><i><strong>Recursive</strong>: this method can run on a property group.</i></p>
    Checks if the property has some selected keyframes.<br />
    The property can be either a Property or a PropertyGroup.
     * @returns true if the property have at least one selected keyframe
     */
    hasSelectedKeys(): boolean;
    /**
     * Sets the spatial interpolation of the keyframes on the property
     * @param typeIn - The in interpolation type (see AE API)
     * @param [typeOut = typeIn] - The in interpolation type (see AE API)
     * @param [selectedKeyframesOnly = false] - If true, only set the selected keyframes.
     */
    setSpatialInterpolation(typeIn: KeyframeInterpolationType, typeOut?: KeyframeInterpolationType, selectedKeyframesOnly?: boolean): void;
    /**
     * Sets the spatial interpolation of the keyframes
     * @param key - The keyframe or its index
     * @param typeIn - The in interpolation type (see AE API)
     * @param [typeOut = typeIn] - The in interpolation type (see AE API)
     */
    setSpatialInterpolationAtKey(key: int | DuAEKeyframe, typeIn: KeyframeInterpolationType, typeOut?: KeyframeInterpolationType): void;
    /**
     * Fixes the spatial interpolation of the selected keys.<br />
    Sets the interpolation to linear when the property does not move between keyframes
     * @param [precision = 1] - The precision for float number comparison, number of decimals. Set to -1 to not use.
     * @param [selectedKeyframesOnly = false] - If true, only set the selected keyframes.
     */
    fixSpatialInterpolation(precision?: int, selectedKeyframesOnly?: boolean): void;
    /**
     * Reimplements the <code>Property.propertyValueType</code> attribute.
     * @returns The value type, or null if this is a group
     */
    propertyValueType(): PropertyValueType | null;
    /**
     * Reimplements the <code>Property.keyInSpatialTangent</code> method.
     * @param key - The keyframe or its index.
     * @returns The tangent
     */
    keyInSpatialTangent(key: int | DuAEKeyframe): float[];
    /**
     * Reimplements the <code>Property.keyOutSpatialTangent</code> method.
     * @param key - The keyframe or its index.
     * @returns The tangent
     */
    keyOutSpatialTangent(key: int | DuAEKeyframe): float[];
    /**
     * Reimplements the <code>Property.setSpatialTangentsAtKey</code> method.
     * @param key - The keyframe or its index.
     * @param inTangent - The in tangent.
     * @param outTangent - The out tangent.
     */
    setSpatialTangentsAtKey(key: int | DuAEKeyframe, inTangent: float[], outTangent: float[]): void;
    /**
     * <p><i><strong>Recursive</strong>: this method can run on a property group.</i></p>
    Removes all unneeded keyframes from the property.< br/>
    Also checks the interpolation values to reset the correct display as linear/smooth.
     * @param [precision = 1] - The precision for float number comparison, number of decimals. Set to -1 to not use.
     */
    cleanKeyframes(precision?: int): void;
    /**
     * Gets the speed of a property at a given time, in unit per second (and not per frame as speeds in the After Effects API)
     * @param [time = comp().time] - The time.
     * @param [preExpression = true] - true to get the pre-expression speed.
     * @returns The speed
     */
    speedAtTime(time?: float, preExpression?: boolean): float;
    /**
     * Gets the velocity of a property at a given time, in unit per second (and not per frame as speeds in the After Effects API)
     * @param [time = comp().time] - The time.
     * @param [preExpression = true] - true to get the pre-expression velocity.
     * @returns The velocity
     */
    velocityAtTime(time?: float, preExpression?: boolean): float[];
    /**
     * <p><i><strong>Recursive</strong>: this method can run on a property group.</i></p>
    Sets an expression to a property.<br />
    With the ability to keep the initial value.
     * @param expr - The expression
     * @param [keepValue = true] - When true, the method will try to keep the same resulting value as before applying the expression.
     */
    setExpression(expr: string, keepValue?: boolean): void;
    /**
     * <p><i><strong>Recursive</strong>: this method can run on a property group.</i></p>
    Replaces text in Expressions
     * @param oldString - The string to replace
     * @param newString - The new string
     * @param [caseSensitive = true] - Whether the search has to be case sensitive
     */
    replaceInExpressions(oldString: string, newString: string, caseSensitive?: boolean): void;
    /**
     * Adds an expression to the property, linking it to the parent property
     * @param parentProp - The parent property.
     * @param [useThisComp] - Whether to begin the expression by 'thisComp' or 'comp("name")', default: will detect if the properties are in the same comp
     */
    pickWhip(parentProp: DuAEProperty | Property, useThisComp?: boolean): void;
    /**
     * <p><i><strong>Recursive</strong>: this method can run on a property group.</i></p>
    Link all the properties found in this prop to all the same properties of parentProp (this is a recursive method)<br />
    Note: any Property or PropertyGroup (and its subproperties) named "Data" will be linked the opposite way (from parentProp to childProp).
     * @param parentProp - The parent property
     * @param [useThisComp] - Whether to begin the expression by 'thisComp' or 'comp("name")', default: will detect if the properties are in the same comp
     * @param [timeLayer = null] - A layer used to offset the time (typically, in case of link between precompositions, the precomposition layer).<br />
    When not null, the start time of this layer will be taken into account to get the values and synchronize them.
     */
    linkProperties(parentProp: PropertyBase | DuAEProperty, useThisComp?: boolean, timeLayer?: LayerItem): void;
    /**
     * <p><i><strong>Recursive</strong>: this method can run on a property group.</i></p>
    Removes all expressions found in groups or sections named "Data" in the property.
     */
    removeDataExpressions(): void;
    /**
     * <p><i><strong>Recursive</strong>: this method can run on a property group.</i></p>
    Removes all expressions found in the property.
     * @param filter - A function which takes a string as a parameter (the expression). Returns true if the expression has to be removed.
     * @param [keepPostExpressionValue = true] - Set to false to just remove the expressions and get back the pre expression value
     */
    removeExpressions(filter: (...params: any[]) => any, keepPostExpressionValue?: boolean): void;
    /**
     * <p><i><strong>Recursive</strong>: this method can run on a property group.</i></p>
    Enables or disables all expressions found in the property.
     * @param [enable = true] - Set to false to disable expressions
     */
    enableExpressions(enable?: boolean): void;
    /**
     * Alias for {@link DuAEProperty#removeExpressions DuAEProperty.removeExpressions()}
     */
    removeExpression(): void;
    /**
     * <p><i><strong>Recursive</strong>: this method can run on a property group.</i></p>
    Recursilvely adds all the (supported) properties found to the essential graphics panel<br />
    Note: any Property or PropertyGroup (and its subproperties) named "data" will be ignored.
     * @returns The number of properties added
     */
    addToEGP(): int;
    /**
     * Checks if the property has an animation (keyframes)
     * @returns True if the property is animated
     */
    animated(): boolean;
    /**
     * <p><i><strong>Recursive</strong>: this method can run on a property group.</i></p>
    Gets the After Effects animated (with keyframes) properties in the propertyGroup
     * @param [filter] - A filter to get only a certain type, or value type, or property name or matchName.<br />
    A function which take one PropertyBase as argument can be used to filter the properties: the Property will be returned if the function returns true.
     * @param [strict = false] - If a string filter is provided, whether to search for the exact name/matchName or if it contains the filter.
     * @param [caseSensitive = true] - If a string filter is provided, and not strict is false, does the search have to be case sensitive?
     * @returns The selected properties, an empty Array if nothing active or selected
     */
    getAnimatedProps(filter?: PropertyType | PropertyValueType | string | ((...params: any[]) => any), strict?: boolean, caseSensitive?: boolean): DuAEProperty[];
    /**
     * Gets the value range of the animated property.<br >
    The property type must be one of: one D, two D, three D (spatial or not), Color.
    If the property is not one of these types, returns an empty Array.
     * @param [axis = 0] - The axis (or the color channel) to get the range
     * @param [preExpression = true] - True to get the range from keyframes instead of the result of the exression
     * @param [fastMode = true] - True to check the range with values only at keyframe times. False to check the range with all values, at each frame of the comp.
     * @returns The minimum and maximum value.<br />
    The first item in the Array is not necesarily the lowest value, it is the first in time.
     */
    range(axis?: int, preExpression?: boolean, fastMode?: boolean): float[];
    /**
     * Gets the maximum speed of the animated property.<br >
    The property type must be one of: one D, two D, three D (spatial or not), Color.
    If the property is not one of these types, returns 0.
     * @param [preExpression = true] - True to get the velocity from keyframes instead of the result of the exression
     * @param [fastMode = true] - True to limit the number of samples used to compute the velocity and make the process faster.<br />
    The number of samples is automatically adapted from the duration of the composition.<br />
    When true and if there are more than one keyframe, the velocity is sampled only between keyframes.
     * @returns The velocity.
     */
    maxSpeed(preExpression?: boolean, fastMode?: boolean): float;
    /**
     * Gets the maximum velocity of the animated property ofr a given axis.<br >
    The property type must be one of: one D, two D, three D (spatial or not), Color.
    If the property is not one of these types, returns 0.
     * @param axis - The axis
     * @param [preExpression = true] - True to get the velocity from keyframes instead of the result of the exression
     * @param [fastMode = true] - True to limit the number of samples used to compute the velocity and make the process faster.<br />
    The number of samples is automatically adapted from the duration of the composition.<br />
    When true and if there are more than one keyframe, the velocity is sampled only between keyframes.
     * @returns The velocity.
     */
    maxVelocity(axis: int, preExpression?: boolean, fastMode?: boolean): float;
    /**
     * Gets the minimum velocity of the animated property ofr a given axis.<br >
    The property type must be one of: one D, two D, three D (spatial or not), Color.
    If the property is not one of these types, returns 0.
     * @param axis - The axis
     * @param [preExpression = true] - True to get the velocity from keyframes instead of the result of the exression
     * @param [fastMode = true] - True to limit the number of samples used to compute the velocity and make the process faster.<br />
    The number of samples is automatically adapted from the duration of the composition.<br />
    When true and if there are more than one keyframe, the velocity is sampled only between keyframes.
     * @returns The velocity.
     */
    minVelocity(axis: int, preExpression?: boolean, fastMode?: boolean): float;
    /**
     * Scriptifies the given shape property.<br/>
    Works only with path (bezier) properties.
     * @param [offsetToCenter = false] - If true, offset the path to the center
     * @param [varName = shape] - A name for the variable storing the shape
     * @returns The scriptified shape
     */
    scriptifyPath(offsetToCenter?: boolean, varName?: string): string;
    /**
     * Export the (shape) property to the given file.
     * @example
     * var props = DuAEComp.getSelectedProps(PropertyValueType.SHAPE);
    var prop = props[0].getProperty();
    var out = prop.exportPathToJsxinc("D:/shape.test");
     * @param file - The path or File where the jsxinc shape will be written
     * @param [offsetToCenter = false] - If true, offset the path to the center
     * @param [append = false] - If true, appends the shape at the end of the file instead of overwriting it.
     * @param [varName = "shape"] - A name for the variable storing the shape
     * @returns Success
     */
    exportPathToJsxinc(file: string, offsetToCenter?: boolean, append?: boolean, varName?: string): boolean;
    /**
     * Gets the vertices array in comp coordinates.<br/>
    Works only with path (bezier) properties.
     * @returns The vertices in comp coordinates.
     */
    verticesToComp(): float[][];
    /**
     * Checks if the property is a bezier property, or return the child bezier property if this is a shape or a mask
     * @returns the bezier property or null if it is not.
     */
    pathProperty(): DuAEProperty | null;
    /**
     * Gets the average speed of the proprety
     * @param [preExpression = true] - True to get the velocity from keyframes instead of the result of the exression
     * @param [fastMode = true] - True to limit the number of samples used to compute the velocity and make the process faster.
     * @returns The average speed in unit per second
     */
    averageSpeed(preExpression?: boolean, fastMode?: boolean): float;
    /**
     * Adjust the value so it can be set on the specific property (adjust the number of dimensions or the type of value)
     * @param property - The property
     * @param value - The value to set
     * @returns The converted value
     */
    fixValue(property: Property | DuAEProperty, value: any): any;
    /**
     * <p><i><strong>Recursive</strong>: this method can run on a property group.</i></p>
    Quickly bakes an expression, adding a keyframe/frame
     * @param [frameStep = 1.0] - By default, adds one keyframe per frame. Use a lower value to add sub-frame keyframes, a higher value to add less keyframes.
     */
    quickBakeExpressions(frameStep?: float): void;
    /**
     * Alias for {@link DuAEProperty#quickBakeExpressions DuAEProperty.quickBakeExpressions()}
     */
    quickBakeExpression(): void;
    /**
     * <p><i><strong>Recursive</strong>: this method can run on a property group.</i></p>
    Uses a smarter algorithm to bake the expression to keyframes
     * @param [frameStep = 1.0] - By default, checks one value per keyframe. A lower value increases the precision and allows for sub-frame sampling. A higher value is faster but less precise. Minimum: 0.1
     */
    smartBakeExpressions(frameStep?: float): void;
    /**
     * Alias for {@link DuAEProperty#smartBakeExpressions DuAEProperty.smartBakeExpressions()}
     */
    smartBakeExpression(): void;
    /**
     * <p><i><strong>Recursive</strong>: this method can run on a property group.</i></p>
    Bakes the expressions to keyframes
     * @param [mode = DuAEExpression.BakeAlgorithm.SMART] - By default, checks one value per keyframe. A lower value increases the precision and allows for sub-frame sampling. A higher value is faster but less precise.
     * @param [frameStep = 1.0] - By default, checks one value per keyframe. A lower value increases the precision and allows for sub-frame sampling. A higher value is faster but less precise.
     */
    bakeExpressions(mode?: DuAEExpression.BakeAlgorithm, frameStep?: float): void;
    /**
     * Alias for {@link DuAEProperty#bakeExpressions DuAEProperty.bakeExpressions()}
     */
    bakeExpression(): void;
    /**
     * Finds the same property in the given comp (same path & name)
     * @param comp - The composition where to find the property
     * @returns The property or null if it wasn't found
     */
    findInComp(comp: CompItem): DuAEProperty | null;
    /**
     * <p><i><strong>Recursive</strong>: this method can run on a property group.</i></p>
    Automatically sets all "transition" keyframes to roving, if the property is spatial.
     */
    setRoving(): void;
    /**
     * Snaps keyframes to the closest frames if they're in between.
    <p><i><strong>Recursive</strong>: this method can run on a property group.</i></p>
     * @param [keys] - An optional list of key indices to snap (could be <code>DuAEProperty.selectedKeys()</code> for example). If omitted, will snap all keyframes.
     */
    snapKeys(keys?: int[]): void;
    /**
     * Gets the After Effects properties in the property
     * @param property - The layer
     * @param [filter] - A filter to get only a certain type, or value type, or property name or matchName.<br />
    A function which take one PropertyBase as argument can be used to filter the properties: the Property will be returned if the function returns true.
     * @param [strict = false] - If a string filter is provided, whether to search for the exact name/matchName or if it contains the filter.
     * @param [caseSensitive = true] - If a string filter is provided, and not strict is false, does the search have to be case sensitive?
     * @returns The selected properties, an empty Array if nothing found
     */
    static getProps(property: PropertyBase | DuAEProperty, filter?: PropertyType | PropertyValueType | string | ((...params: any[]) => any), strict?: boolean, caseSensitive?: boolean): DuAEProperty[];
    /**
     * Generates a new unique name for a marker for this marker porperty
     * @param newName - The wanted new name
     * @param markerProp - The marker property
     * @param [increment = true] - true to automatically increment the new name if it already ends with a digit
     * @returns The unique name, with a new number at the end if needed.
     */
    static newUniqueMarkerName(newName: string, markerProp: Property, increment?: boolean): string;
    /**
     * Changes the interpolation type on selected keyframes, or sets a new key at current time if there are no keyframes selected.
     * @param layers - The layers containing the properties
     * @param props - The properties
     * @param typeIn - The in interpolation type (see AE API) or the string "roving" or "continuous"
     * @param [typeOut = typeIn] - The out interpolation type (see AE API)
     * @param [easeInValue = 33] - The in interpolation ease value (used if typeIn is KeyframeInterpolationType.BEZIER)
     * @param [easeOutValue = easeInValue] - The out interpolation ease value (used if typeOut is KeyframeInterpolationType.BEZIER)
     */
    static setInterpolationType(layers: Layer[] | LayerCollection, props: PropertyBase[] | DuAEProperty[], typeIn: KeyframeInterpolationType | string, typeOut?: KeyframeInterpolationType | string, easeInValue?: int[] | int, easeOutValue?: int[] | int): void;
    /**
     * Gets the maximum speed of the animated properties
     * @param props - The Properties
     * @param [preExpression = true] - True to get the velocity from keyframes instead of the result of the exression
     * @returns The average speed
     */
    static getMaximumSpeed(props: Property[] | DuAEProperty[], preExpression?: boolean): float;
    /**
     * Locks the properties with an expression so thier values cannot be changed
     * @param properties - The property or properties
     */
    static lock(properties: PropertyBase | DuAEProperty | PropertyBase[] | DuAEProperty[]): void;
    /**
     * Gets the average speed of the animated propreties
     * @param props - The Properties
     * @param [preExpression = true] - True to get the velocity from keyframes instead of the result of the exression
     * @param [fastMode = true] - True to limit the number of samples used to compute the velocity and make the process faster.
     * @returns The average speed in unit per second
     */
    static getAverageSpeed(props: Property[] | DuAEProperty[] | DuList<DuAEProperty> | DuList<Property>, preExpression?: boolean, fastMode?: boolean): float;
    /**
     * Makes a horizontal symetry transformation on the paths, using the same axis of symetry for all shapes (shapes must be on the same layer).
     * @param pathProperties - The After Effects Properties containing the paths to symetrize
     */
    static pathHorizontalSymetry(pathProperties: Property[] | DuAEProperty[]): void;
    /**
     * Makes a vertical symetry transformation on the paths, using the same axis of symetry for all shapes (shapes must be on the same layer).
     * @param pathProperties - The After Effects Properties containing the paths to symetrize
     */
    static pathVerticalSymetry(pathProperties: Property[]): void;
    /**
     * Gets the sourceRect of the properties (their bounds) in layer coordinates
     * @param pathProperties - The After Effects Properties containing the paths
     * @param [includeTangents = false] - Wether to include tangents in the bounds or not
     * @returns The bounds [top, left, width, height]
     */
    static pathBounds(pathProperties: Property[], includeTangents?: boolean): float[];
    /**
     * Checks if the property contains a Bézier "path" property (it's a mask path or a shape layer path).<br />
    The function can be used as a filter for {@link DuAELayer.getSelectedProps}.
     * @param prop - The property to check
     * @returns true if it's a path property.
     */
    static isPathProperty(prop: PropertyGroup): boolean;
    /**
     * Safely renames a property (without breaking expressions)
     * @param prop - The property
     * @param name - The new name.
     * @returns The new name.
     */
    static rename(prop: PropertyBase, name: string): string;
    /**
     * Compares two shape values
     * @returns true if they're the same
     */
    static shapeValueEquals(shape1: Shape, shape2: Shape): boolean;
    /**
     * Compares two text values
     * @returns true if they're the same
     */
    static textValueEquals(text1: TextDocument, text2: TextDocument): boolean;
}

/**
 * After Effects expression tools
 */
declare namespace DuAEExpression {
    /**
     * The different modes available to bake expressions
     */
    enum BakeAlgorithm {
        SMART = 0,
        PRECISE = 1
    }
    /**
     * The list of expression IDs, added at the beginning of generated expressions.
     */
    enum Id {
        LINK = "/*== DuAEF: property link ==*/"
    }
    /**
     * Updates the cache of the expressions used by Duik to speed up batch process of expressions in the whole project.<br />
    It's automatically run when needed if it's not been updated in a long time (1 mn) or if it's empty
     * @param [selectionMode = DuAE.SelectionMode.ALL_COMPOSITIONS] - What to update
     */
    function updateCache(selectionMode?: boolean): void;
    /**
     * Runs a function on all expressions
     * @param func - The function to run, which takes one param, a {@link DuAEPropertyExpression} object.
     * @param [selectionMode = DuAE.SelectionMode.ALL_COMPOSITIONS] - What to update
     * @param [updateCache = true] - When false, the cache won't be updated before running the function. Set this to false if you already have updated the cache to improve performance.
     * @param [apply = true] - When false, the cache won't be applied back to Ae. Set this to false if you need to run other methods on expressions before applying the result to improve performance.
     * @param [onlyIfNoError = false] - Applies the cache only if it doesn't generate an error.
     */
    function doInExpresssions(func: (...params: any[]) => any, selectionMode?: DuAE.SelectionMode, updateCache?: boolean, apply?: boolean, onlyIfNoError?: boolean): void;
    /**
     * Applies all the expressions stored in the cache to the actual properties in After Effects, if and only if they've been modified.
     * @param [cache] - The cache to apply, if different from the automatic DuAEF Cache
     * @param [onlyIfNoError = false] - Applies only if it doesn't generate an error.
     */
    function applyCache(cache?: DuAEPropertyExpression[], onlyIfNoError?: boolean): void;
    /**
     * Converts the expression as a string which can be copy/pasted and included in a script.
     * @param prop - The property containing the expression or the expression itself.
     * @param [varName] - A name for the variable
     * @returns The stringified expression.
     */
    function scriptifyExpression(prop: Property | DuAEProperty | string, varName?: string): string;
    /**
     * The expression library<br />
    Use {@link DuAEExpression.Library.get} and {@link DuAEExpression.Library.getRequirements}<br />
    to easily include the methods and classes listed here to your expressions.<br />
    These methods take the name (listed here) of the function/class as arguments.
     */
    namespace Library {
        /**
         * Gets functions and their dependencies from the library.
         * @param functions - The name of the functions to get
         * @returns The expression
         */
        function get(functions: string[]): string;
        /**
         * A recursive method to get all the requirements (dependencies) of a function from a library
         * @param functionName - The name of the function
         * @returns The names of the required functions, including the querried one
         */
        function getRequirements(functionName: string): string[];
        /**
         * Blends two colors together
         * @param colorA - The first color
         * @param colorB - The second color
         * @param [opacity] - The opacity of the second color, overrides colorB[3].
         * @param [blendlingMode = 0] - The blending mode, one of:<br/>
        0: Normal<br/>
        1: Add<br/>
        2: Lighter color<br/>
        3: Multiply<br/>
        4: Darker color<br/>
         * @returns The new color
         */
        function "blendColor"(colorA: float[], colorB: float[], opacity?: float, blendlingMode?: int): float[];
        /**
         * Blends two colors together
         * @param colorA - The first color
         * @param colorB - The second color
         * @param [opacity = 1] - The opacity
         * @param [blendlingMode = 0] - The blending mode, one of:<br/>
        0: Normal<br/>
        1: Add<br/>
        3: Multiply<br/>
         * @returns The new value
         */
        function "blendColorValue"(colorA: float, colorB: float, opacity?: float, blendlingMode?: int): float;
        /**
         * Fuzzy Logics for expressions. See {@link https://github.com/Nico-Duduf/DuFuzzyLogic} for more explanations
         */
        class "FuzzyLogic" {
        }
        /**
         * A (very) simplified version of FuzzyLogics, better for performance with expressions.<br />
        See {@link https://github.com/Nico-Duduf/DuFuzzyLogic} for more explanations
         * @param v - The original veracity, must be in the range [0.0, 1.0]
         * @param [f = 1] - A factor to adjust the <i>importance</i> of the veracity, when compared to others.
         */
        class "FuzzyVeracity" {
            constructor(v: number, f?: number);
        }
        /**
         * Animates the property using the given keyframes
         * @example
         * var keyframes = [
           {value: 0, time: 1, interpolation: linear},
           {value: 180, time: 2, interpolation: gaussianInterpolation, params: -0.5}, //You need to include the gaussianInterpolation function from DuAEF
           {value: 250, time: 4, interpolation: ease},
           {value: 360, time: 5},
        ];
        animate(keyframes, 'cycle', 'pingpong');
         * @param keyframes - The keyframes. An object with four properties:<br/>
        <code>value</code> The value of the keyframe<br />
        <code>time</code> The time of the keyframe<br />
        <code>interpolation</code> (optional. Default: linear) A function taking 5 arguments to interpolate between this keyframe and the next one<br />
        <code>params</code> (optional.) A sixth argument passed to the interpolation function. To be used with DuAEF interpolations.<br />
        Note that the keyframes <strong>must be sorted</strong>. The function does not sort them, as it would have a bad impact on performance.
         * @param [loopOut = 'none'] - One of 'none', 'cycle', 'pingpong'.
         * @param [loopIn = 'none'] - One of 'none', 'cycle', 'pingpong'.
         * @param [time = time] - Use this to control how time flows.
         * @returns the animated value.
         */
        function "animate"(keyframes: object[], loopOut?: string, loopIn?: string, time?: float): number;
        /**
         * Interpolates a value with a bezier curve.<br />
        This method can replace <code>linear()</code> and <code>ease()</code> with a custom bézier interpolation.
         * @param t - The value to interpolate
         * @param [tMin = 0] - The minimum value of the initial range
         * @param [tMax = 1] - The maximum value of the initial range
         * @param [value1 = 0] - The minimum value of the interpolated result
         * @param [value2 = 1] - The maximum value of the interpolated result
         * @param [bezierPoints = [0.33,0.0,0.66,1.0]] - an Array of 4 coordinates wihtin the [0.0, 1.0] range which describes the Bézier interpolation. The default mimics the native ease() function<br />
        [ outTangentX, outTangentY, inTangentX, inTangentY ]
         * @returns the value.
         */
        function "bezierInterpolation"(t: number, tMin?: number, tMax?: number, value1?: number, value2?: number, bezierPoints?: number[]): number;
        /**
         * Interpolates a value with an exponential function.<br />
        This method can replace <code>linear()</code> and <code>ease()</code> with a gaussian interpolation.<br />
        Note that for performance reasons with expressions, even if the parameters of the function are documented with optional/default values, you MUST provide ALL the arguments when using them.
         * @param t - The value to interpolate
         * @param [tMin = 0] - The minimum value of the initial range
         * @param [tMax = 1] - The maximum value of the initial range
         * @param [value1 = 0] - The minimum value of the interpolated result
         * @param [value2 = 1] - The maximum value of the interpolated result
         * @param [rate = 1] - The raising speed in the range [0, inf].
         * @returns the value.
         */
        function "expInterpolation"(t: number, tMin?: number, tMax?: number, value1?: number, value2?: number, rate?: number): number;
        /**
         * Interpolates a value with a gaussian function.<br />
        This method can replace <code>linear()</code> and <code>ease()</code> with a gaussian interpolation.<br />
        Note that for performance reasons with expressions, even if the parameters of the function are documented with optional/default values, you MUST provide ALL the arguments when using them.
         * @param t - The value to interpolate
         * @param [tMin = 0] - The minimum value of the initial range
         * @param [tMax = 1] - The maximum value of the initial range
         * @param [value1 = 0] - The minimum value of the interpolated result
         * @param [value2 = 1] - The maximum value of the interpolated result
         * @param [rate = 0] - The raising speed in the range [-1.0, 1.0].
         * @returns the value.
         */
        function "gaussianInterpolation"(t: number, tMin?: number, tMax?: number, value1?: number, value2?: number, rate?: number): number;
        /**
         * Converts a Gaussian rate (as used with <code>gaussianInterpolation</code>) to the closest possible Bézier controls for use with <code>bezierInterpolation</code>.
         * @param rate - The raising speed in the range [-1.0, 1.0].
         * @returns the value.
         */
        function "gaussianRateToBezierPoints"(rate: number): number;
        /**
         * Integrates the (linear) keyframe values. Useful to animate frequencies!
        cf. {@link http://www.motionscript.com/articles/speed-control.html} for more explanation.
         * @param [prop = thisProperty] - The property with the keyframes.
         */
        function "integrateLinearKeys"(prop?: Property): void;
        /**
         * Fixes interpolation of colors by using HSL or a smart HSL taking the smallest path
         * @param [t = time] - The value to interpolate and extrapolate
         * @param [mode = 2] - How to interpolate the colors, one of: 0 for 'RGB', 1 for 'HSL', or 2 for 'shortest-path HSL', 3 for 'longest-path HSL', or 4 for 'combined-RGB SL'
         * @param [tMin = 0] - The minimum value of the initial range
         * @param [tMax = 1] - The maximum value of the initial range
         * @param [colorA = [0,0,0,0]] - The first color
         * @param [colorB = [1,1,1,1]] - The second color
         * @param [interpolationMethod = ease] - The interpolation function, like linear(), easeIn(), easeOut(), etc.<br/>
        Or any other method taking the same five arguments.
         */
        function "interpolateColor"(t?: number, mode?: int, tMin?: number, tMax?: number, colorA?: number[], colorB?: number[], interpolationMethod?: (...params: any[]) => any): void;
        /**
         * Clamps a value, but with a smooth interpolation according to a softness parameter
         * @param value - The value to limit
         * @param [min] - The minimum value
         * @param [max] - The maximum value
         * @param [softness = 0] - The softness, a value corresponding value, from which the interpolation begins to slow down
         */
        function "limit"(value: number | number[], min?: number | number[] | null, max?: number | number[] | null, softness?: number): void;
        /**
         * Interpolates a value with a linear function, but also extrapolates it outside of known values.<br />
        This method can replace <code>linear()</code>, adding extrapolation.<br />
        Note that for performance reasons with expressions, even if the parameters of the function are documented with optional/default values, you MUST provide ALL the arguments when using them.
         * @param t - The value to interpolate and extrapolate
         * @param [tMin = 0] - The minimum value of the initial range
         * @param [tMax = 1] - The maximum value of the initial range
         * @param [value1 = 0] - The minimum value of the interpolated result
         * @param [value2 = 1] - The maximum value of the interpolated result
         * @returns the value.
         */
        function "linearExtrapolation"(t: number, tMin?: number, tMax?: number, value1?: number, value2?: number): number;
        /**
         * Interpolates a value with a logarithmic function.<br />
        This method can replace <code>linear()</code> and <code>ease()</code> with a gaussian interpolation.<br />
        Note that for performance reasons with expressions, even if the parameters of the function are documented with optional/default values, you MUST provide ALL the arguments when using them.
         * @param t - The value to interpolate
         * @param [tMin = 0] - The minimum value of the initial range
         * @param [tMax = 1] - The maximum value of the initial range
         * @param [value1 = 0] - The minimum value of the interpolated result
         * @param [value2 = 1] - The maximum value of the interpolated result
         * @param [rate = 1] - The raising speed in the range [0, inf].
         * @returns the value.
         */
        function "logInterpolation"(t: number, tMin?: number, tMax?: number, value1?: number, value2?: number, rate?: number): number;
        /**
         * Interpolates a value with a logistic (sigmoid) function.<br />
        This method can replace <code>linear()</code> and <code>ease()</code> with a gaussian interpolation.
         * @param t - The value to interpolate
         * @param [tMin = 0] - The minimum value of the initial range
         * @param [tMax = 1] - The maximum value of the initial range
         * @param [value1 = 0] - The minimum value of the interpolated result
         * @param [value2 = 1] - The maximum value of the interpolated result
         * @param [rate = 1] - The raising speed in the range [0, inf].
         * @param [tMid] - The t value at which the interpolated value should be half way. By default, (tMin+tMax)/2
         * @returns the value.s
         */
        function "logisticInterpolation"(t: number, tMin?: number, tMax?: number, value1?: number, value2?: number, rate?: number, tMid?: number): number;
        /**
         * Gets the key immediately before the given time
         * @param [t = time] - Time at which to get the key
         * @param [prop = thisProperty] - The property from which to get the key
         * @returns The key, or null if there's no key before.
         */
        function "getNextKey"(t?: number, prop?: Property): Key | null;
        /**
         * Gets the next key where there is no motion after it
         * @param [t = time] - Time at which to get the key
         * @param [prop = thisProperty] - The property from which to get the key
         * @returns The key, or null if there's no key before.
         */
        function "getNextStopKey"(t?: number, prop?: Property): Key | null;
        /**
         * Gets the key immediately before the given time
         * @param [t = time] - Time at which to get the key
         * @param [prop = thisProperty] - The property from which to get the key
         * @returns The key, or null if there's no key before.
         */
        function "getPrevKey"(t?: number, prop?: Property): Key | null;
        /**
         * Gets the previous key where there is no motion before it
         * @param [t = time] - Time at which to get the key
         * @param [prop = thisProperty] - The property from which to get the key
         * @returns The key, or null if there's no key before.
         */
        function "getPrevStartKey"(t?: number, prop?: Property): Key | null;
        /**
         * Checks if current time is after the time of the last key in the property
         * @returns true if time is > lastkey.time
         */
        function "isAfterLastKey"(): boolean;
        /**
         * Checks if the key is a maximum or minimum
         * @param k - The key to check
         * @param axis - The axis to check for multi-dimensionnal properties
         * @returns true if the key is a maximum or minimum
         */
        function "isKeyTop"(k: Keyframe, axis: int): boolean;
        /**
         * Bounce, to be used when the speed is 0.
         * @param t - The time at which the value must be got. To end the loop, pass the same time for all subsequent frames.
         * @param elasticity - The elasticity, which controls the amplitude and frequence according to the last known velocity
         * @param damping - Damping
         * @param [vAtTime = valueAtTime] - A function to replace valueAtTime. Use this to loop after an expression+keyframe controlled animation, by providing a function used to generate the animation.
         * @returns The new value
         */
        function "bounce"(t: float, elasticity: float, damping: float, vAtTime?: (...params: any[]) => any): float | float[];
        /**
         * Animatable equivalent to loopIn('continue').
         * @param t - The time at which the value must be got. To end the loop, pass the same time for all previous frames.
         * @param [damping = 0] - Exponentially attenuates the effect over time
         * @returns The new value
         */
        function "continueIn"(t: float, damping?: float): float | float[];
        /**
         * Animatable equivalent to loopOut('continue').
         * @param t - The time at which the value must be got. To end the loop, pass the same time for all subsequent frames.
         * @param [damping = 0] - Exponentially attenuates the effect over time
         * @returns The new value
         */
        function "continueOut"(t: float, damping?: float): float | float[];
        /**
         * Animatable equivalent to loopIn('cycle') and loopIn('offset').
         * @param t - The time at which the value must be got. To end the loop, pass the same time for all previous frames.
         * @param nK - The number of keyframes to loop. Use 0 to loop all keyframes
         * @param o - Wether to offset or cycle
         * @param [vAtTime = valueAtTime] - A function to replace valueAtTime. Use this to loop after an expression+keyframe controlled animation, by providing a function used to generate the animation.
         * @param [damping = 0] - Exponentially attenuates the effect over time
         * @returns The new value
         */
        function "cycleIn"(t: float, nK: int, o: boolean, vAtTime?: (...params: any[]) => any, damping?: float): float | float[];
        /**
         * Animatable equivalent to loopOut('cycle') and loopOut('offset').
         * @param t - The time at which the value must be got. To end the loop, pass the same time for all subsequent frames.
         * @param nK - The number of keyframes to loop. Use 0 to loop all keyframes
         * @param o - Wether to offset or cycle
         * @param [vAtTime = valueAtTime] - A function to replace valueAtTime. Use this to loop after an expression+keyframe controlled animation, by providing a function used to generate the animation.
         * @param [damping = 0] - Exponentially attenuates the effect over time
         * @returns The new value
         */
        function "cycleOut"(t: float, nK: int, o: boolean, vAtTime?: (...params: any[]) => any, damping?: float): float | float[];
        /**
         * Overshoot animation, to be used when the speed is 0.
         * @param t - The time at which the value must be got. To end the loop, pass the same time for all subsequent frames.
         * @param elasticity - The elasticity, which controls the amplitude and frequence according to the last known velocity
         * @param damping - Damping
         * @param [vAtTime = valueAtTime] - A function to replace valueAtTime. Use this to loop after an expression+keyframe controlled animation, by providing a function used to generate the animation.
         * @returns The new value
         */
        function "overshoot"(t: float, elasticity: float, damping: float, vAtTime?: (...params: any[]) => any): float | float[];
        /**
         * Animatable equivalent to loopIn('pingpong').
         * @param t - The time at which the value must be got. To end the loop, pass the same time for all previous frames.
         * @param nK - The number of keyframes to loop. Use 0 to loop all keyframes
         * @param [vAtTime = valueAtTime] - A function to replace valueAtTime. Use this to loop after an expression+keyframe controlled animation, by providing a function used to generate the animation.
         * @param [damping = 0] - Exponentially attenuates the effect over time
         * @returns The new value
         */
        function "pingPongIn"(t: float, nK: int, vAtTime?: (...params: any[]) => any, damping?: float): float;
        /**
         * Animatable equivalent to loopOut('pingpong').
        Note that for performance reasons with expressions, even if the parameters of the function are documented with optional/default values, you MUST provide ALL the arguments when using them.
         * @param t - The time at which the value must be got. To end the loop, pass the same time for all subsequent frames.
         * @param nK - The number of keyframes to loop. Use 0 to loop all keyframes
         * @param [vAtTime = valueAtTime] - A function to replace valueAtTime. Use this to loop after an expression+keyframe controlled animation, by providing a function used to generate the animation.
         * @param [damping = 0] - Exponentially attenuates the effect over time
         * @returns The new value
         */
        function "pingPongOut"(t: float, nK: int, vAtTime?: (...params: any[]) => any, damping?: float): float;
        /**
         * Adds two lists of points/vectors.
         * @param p1 - The list of points
         * @param p2 - The other list of points
         * @param w - A weight to multiply the values of p2
         * @returns The added points
         */
        function "addPoints"(p1: float[][], p2: float[][], w: float): float[][];
        /**
         * Gets the distance of a point to a line
         * @param point - The point [x,y]
         * @param line - The line [ A , B ] where A and B are two points
         * @returns The distance
         */
        function "distanceToLine"(point: float[], line: float[][]): float;
        /**
         * The gaussian function
         * @param value - The variable
         * @param [min = 0] - The minimum return value
         * @param [max = 1] - The maximum return value
         * @param [center = 0] - The center of the peak
         * @param [fwhm = 1] - The full width at half maximum of the curve
         * @returns The result
         */
        function "gaussian"(value: number, min?: number, max?: number, center?: number, fwhm?: number): number;
        /**
         * The inverse gaussian function
         * @param v - The variable
         * @param [min = 0] - The minimum return value of the corresponding gaussian function
         * @param [max = 1] - The maximum return value of the corresponding gaussian function
         * @param [center = 0] - The center of the peak of the corresponding gaussian function
         * @param [fwhm = 1] - The full width at half maximum of the curve of the corresponding gaussian function
         * @returns The two possible results, the lower is the first in the list. If both are the same, it is the maximum
         */
        function "inverseGaussian"(v: number, min?: number, max?: number, center?: number, fwhm?: number): Number[];
        /**
         * The inverse logistic function (inverse sigmoid)
         * @param v - The variable
         * @param [midValue = 0] - The midpoint value, at which the function returns max/2 in the original logistic function
         * @param [min = 0] - The minimum return value of the original logistic function
         * @param [max = 1] - The maximum return value of the original logistic function
         * @param [rate = 1] - The logistic growth rate or steepness of the original logistic function
         * @returns The result
         */
        function "inverseLogistic"(v: number, midValue?: number, min?: number, max?: number, rate?: number): number;
        /**
         * Checks if the value is 0; works with arrays.
         * @param x - The value(s)
         * @returns true if all values are 0.
         */
        function "isZero"(x: number | Number[]): boolean;
        /**
         * The logistic function (sigmoid)
         * @param value - The value
         * @param [midValue = 0] - The midpoint value, at which the function returns max/2
         * @param [min = 0] - The minimum return value
         * @param [max = 1] - The maximum return value
         * @param [rate = 1] - The logistic growth rate or steepness of the function
         * @returns The result in the range [min, max] (excluding min and max)
         */
        function "logistic"(value: number, midValue?: number, min?: number, max?: number, rate?: number): number;
        /**
         * Returns the mean of a set of values
         * @param values - The values
         * @returns The mean
         */
        function "mean"(values: Number[]): number;
        /**
         * Multiplies a list of points/vectors with a scalar.
         * @param p - The list of points
         * @param w - The multiplier
         * @returns The multiplied points
         */
        function "multPoints"(p: float[][], w: float): float[][];
        /**
         * Multiplies two sets of values, one with each other. If the lists are not the same length, additional values will be ignored
         * @param setA - The first list
         * @param setB - The other list
         * @returns The new values
         */
        function "multSets"(setA: float[], setB: float[]): float[];
        /**
         * Normalizes a list of weights so their sum equals 1.0
         * @param weights - The weights to normalize
         * @param [sum] - The sum of the weights; provide it if it's already computed to improve performance.
         * @returns The normalized weights
         */
        function "normalizeWeights"(weights: float[], sum?: float): float[];
        /**
         * Substracts two lists of points/vectors.
         * @param p1 - The list of points
         * @param p2 - The other list of points
         * @param w - A weight to multiply the values of p2
         * @returns The substracted points
         */
        function "subPoints"(p1: float[][], p2: float[][], w: float): float[][];
        /**
         * Adds two paths together.<br />
        The paths must be objects with three array attributes: points, inTangents, outTangents
         * @param path1 - First path
         * @param path2 - Second path
         * @param path2weight - A weight to multiply the second path values
         * @returns A path object with three array attributes: points, inTangents, outTangents
         */
        function "addPath"(path1: any, path2: any, path2weight: float): any;
        /**
         * Checks if a point is inside a given polygon.
         * @param point - A 2D point [x, y]
         * @param points - The vertices of the polygon
         * @returns An object with two properties:
        - `inside (bool)` is true if the point is inside the polygon
        - `closestVertex` is the index of the closest vertex of the polygon
         */
        function "inside"(point: float[], points: float[][]): any;
        /**
         * Multiplies a path with a scalar.<br />
        The path must be an object with three array attributes: points, inTangents, outTangents
         * @param path - The path
         * @param weight - The multipliers
         * @returns A path object with three array attributes: points, inTangents, outTangents
         */
        function "multPath"(path: any, weight: float): any;
        /**
         * Substracts two paths together.<br />
        The paths must be objects with three array attributes: points, inTangents, outTangents
         * @param path1 - First path
         * @param path2 - Second path
         * @param path2weight - A weight to multiply the second path values
         * @returns A path object with three array attributes: points, inTangents, outTangents
         */
        function "subPath"(path1: any, path2: any, path2weight: float): any;
        /**
         * Checks the type of a pseudo-effect used by Duik.<br />
        This is a workaround for the missing matchName in expressions.<br />
        Pseudo-Effects used by Duik start with a hidden property which name is the same as the matchName of the effect itself (without the 'Pseudo/' part).
         * @example
         * if ( checkEffect(thisLayer.effect(1), "DUIK parentConstraint2") ) { "This is the second version of the parent constraint by Duik" }
        else { "Who knows what this is?" }
         * @param fx - The effect to check
         * @param duikMatchName - The matchName of a pseudo-effect used by Duik (without the 'Pseudo/' part)
         * @returns True when the property at propIndex is named propName
         */
        function "checkDuikEffect"(fx: Property, duikMatchName: string): boolean;
        /**
         * Checks the type of an effect.<br />
        This is a workaround for the missing matchName in expressions.<br />
        It checks if the given effect has a specific property at a specific index.
         * @example
         * if ( checkEffect(thisLayer.effect(1), 1, "Blur") ) { "The first effect is a blur!" }
        else { "Who knows what this is?" }
         * @param fx - The effect to check
         * @param propIndex - The index of the property
         * @param propName - The expected name of the property. Be careful with the internationalization of After Effects...
         * @returns True when the property at propIndex is named propName
         */
        function "checkEffect"(fx: Property, propIndex: int, propName: string): boolean;
        /**
         * Gets a layer from a layer property in an effect, without generating an error if "None" is selected with the Legacy expression engine.
         * @param fx - The effect
         * @param ind - The index or the name of the property
         * @returns The layer, or null if set to "None"
         */
        function "getEffectLayer"(fx: Property, ind: int | string): Layer | null;
        /**
         * Gets the path from the current property at a given time.
         * @returns A path object with three array attributes: points, inTangents, outTangents
         */
        function "getPath"(): any;
        /**
         * Gets a property from an array of indices as returned by getPropPath.
         * @param l - The layer containing the needed property
         * @param p - The indices to the property.
         * @returns The property.
         */
        function "getPropFromPath"(l: Layer, p: int[]): Property;
        /**
         * Gets an array of all indices needed to get the current property from the layer level.
         * @returns All indices to the property.
         */
        function "getPropPath"(): int[];
        /**
         * Gets the same property as the current one but from another layer.
         * @param l - The layer containing the needed property
         * @returns The property.
         */
        function "getSameProp"(l: Layer): Property;
        /**
         * Checks if a property is a layer. Useful when traversing up the property tree to stop when getting the layer.
         * @param prop - The property to test
         * @returns true if the prop is a layer
         */
        function "isLayer"(prop: Property): boolean;
        /**
         * Checks if a property is a path property.
         * @param prop - The property
         * @returns true if the property is a path property.
         */
        function "isPath"(prop: Property): boolean;
        /**
         * Checks if a property is a transform.position property.<br />
        Note that for performance reasons with expressions, even if the parameters of the function are documented with optional/default values, you MUST provide ALL the arguments when using them.
         * @param [prop = thisProperty] - The property
         * @returns true if the property is the transform.position property.
         */
        function "isPosition"(prop?: Property): boolean;
        /**
         * Checks if a property is spatial
         * @param [prop = thisProperty] - The property to check
         * @returns true if the property is spatial.
         */
        function "isSpatial"(prop?: Property): boolean;
        /**
         * Checks if the current property is animated at a given time.
         * @param [t = time] - The time
         * @param [threshold = 0.01] - The speed under which the property is considered still.
         * @param [axis = -1] - The axis to check. If < 0, will check all axis.
         * @returns true if the property does not vary.
         */
        function "isStill"(t?: number, threshold?: number, axis?: number): boolean;
        /**
         * Checks the last previous time at which the property value was not 0. (meant to be used on boolean property, works on single dimension properties too).
         * @param prop - The property to check
         * @param t - The time before which to run the check
         * @returns The last active time before t
         */
        function "lastActiveTime"(prop: Property, t: float): float;
        /**
         * Checks the next time at which the property value was not 0. (meant to be used on boolean property, works on single dimension properties too).
         * @param prop - The property to check
         * @param t - The time after which to run the check
         * @returns The next active time after t
         */
        function "nextActiveTime"(prop: Property, t: float): float;
        /**
         * Generates a "zero" value for the current property, i.e. <code>0</code> or <code>[0,0]</code>, etc. according to the property type.<br />
        Note that for path properties, this method returns a path object with three array attributes: points, inTangents, outTangents.
         * @returns The zero value.
         */
        function "zero"(): any;
        /**
         * Adds some noise to a value.<br />
        You may use seedRandom() before using this function as it will influence the generated noise.
        A timeless noise can be achieved with <code>seedRandom(index,true)</code> for example.
         * @example
         * seedRandom(index, true) // a timeless noise
        addNoise(value, 50 ); // the property value will have noise between (value * 0.5) and (value * 1.5) which won't vary through time.
         * @example
         * seedRandom(index, false);
        addNoise(value, 33 ); // the noise will change at each frame, varying between (value * .66) and (value * 1.33)
         * @param val - The value to add noise to.
         * @param quantity - The quantity of noise. A percentage. 100 means the value can range from (val * 0) to (val * 2).
         */
        function "addNoise"(val: number | number[], quantity: float): void;
        /**
         * Removes the ancestors rotation from the rotation of a layer.
        This is very useful to make a layer keep its orientation without being influenced by its parents.<br />
         * @example
         * //in a rotation property, just include the function and use:
        dishineritRotation();
        //the layer will now keep its own orientation.
         * @example
         * //you can also combine the result with something else
        var result = dishineritRotation();
        result + wiggle(5,20);
         * @param [l = thisLayer] - The layer
         * @returns The new rotation value, in degrees.
         */
        function "dishineritRotation"(l?: Layer): float;
        /**
         * Removes the ancestors scale from the scale of a layer.
        This is very useful to make a layer keep its scale without being influenced by its parents.<br />
        Note that for performance reasons with expressions, even if the parameters of the function are documented with optional/default values, you MUST provide ALL the arguments when using them.
         * @example
         * //in a rotation property, just include the function and use:
        dishineritScale();
        //the layer will now keep its own scale.
         * @example
         * //you can also combine the result with something else
        var result = dishineritScale();
        result + wiggle(5,20);
         * @param [l = thisLayer] - The layer
         * @returns The new scale value, in percent.
         */
        function "dishineritScale"(l?: Layer): float[];
        /**
         * Converts the point coordinates from the current group in the shape layer to the Layer.<br />
        Use toWorld and toComp with the result if you need te coordinates in the world or the comp.
         * @param point - The 2D coordinates of the point in the current group.
         * @returns The 2D coordinates of the point in the Layer.
         */
        function "fromGroupToLayer"(point: number[]): number[];
        /**
         * Converts the point coordinates from Layer to the current group in the shape layer.<br />
        Use fromWorld or fromComp first if you need to convert from the world or composition coordinates, and pass the result to this function.
         * @param point - The 2D coordinates of the point in the Layer.
         * @returns The 2D coordinates of the point in the current group.
         */
        function "fromLayerToGroup"(point: number[]): number[];
        /**
         * Gets the "real" scale of a layer, resulting to its scale property, the scale of its parents, and it's location in Z-space if it's 3D.<br />
        Note that for performance reasons with expressions, even if the parameters of the function are documented with optional/default values, you MUST provide ALL the arguments when using them.
         * @param [l = thisLayer] - The layer
         * @param [t = time] - The time when to get the scale
         * @returns The scale ratio. This is not a percent, 1.0 is 100%.
         */
        function "getCompScale"(l?: Layer, t?: number): number;
        /**
         * Gets the transformation Matrix for the current group in a shape layer, including the transformation from the ancestor groups<br />
        Note that for performance reasons with expressions, even if the parameters of the function are documented with optional/default values, you MUST provide ALL the arguments when using them.
         * @param [prop = thisProperty] - The property from which to get the matrix
         * @returns The 2D Transform Matrix.
         */
        function "getGroupTransformMatrix"(prop?: Property): Matrix;
        /**
         * Gets the comp position (2D Projection in the comp) of a layer.
         * @param [t = time] - Time from when to get the position
         * @param [l = thisLayer] - The layer
         * @returns The comp position
         */
        function "getLayerCompPos"(t?: number, l?: Layer): number[];
        /**
         * Gets the world position of a layer.<br />
        Note that for performance reasons with expressions, even if the parameters of the function are documented with optional/default values, you MUST provide ALL the arguments when using them.
         * @param other - The other layer
         * @param [origin = thisLayer] - The origin
         * @param [t = time] - Time from when to get the position
         * @returns The world position
         */
        function "getLayerDistance"(other: Layer, origin?: Layer, t?: number): number[];
        /**
         * Gets the world position of a layer.
         * @param [t = time] - Time from when to get the position
         * @param [l = thisLayer] - The layer
         * @returns The world position
         */
        function "getLayerWorldPos"(t?: number, l?: Layer): number[];
        /**
         * Gets the world instant speed of a layer.
         * @param [t = time] - The time when to get the velocity
         * @param [l = thisLayer] - The layer
         * @returns A positive number. The speed.
         */
        function "getLayerWorldSpeed"(t?: number, l?: Layer): number;
        /**
         * Gets the world instant velocity of a layer.<br />
        Note that for performance reasons with expressions, even if the parameters of the function are documented with optional/default values, you MUST provide ALL the arguments when using them.
         * @param [t = time] - The time when to get the velocity
         * @param [l = thisLayer] - The layer
         * @returns The velocity.
         */
        function "getLayerWorldVelocity"(t?: number, l?: Layer): number[];
        /**
         * Gets the world orientation of a (2D) layer.
         * @param l - The layer to get the orientation from
         * @returns The orientation, in degrees.
         */
        function "getOrientation"(l: Layer): float;
        /**
         * Gets the world orientation of a (2D) layer at a specific time.<br />
        Note that for performance reasons with expressions, even if the parameters of the function are documented with optional/default values, you MUST provide ALL the arguments when using them.
         * @param l - The layer to get the orientation from
         * @param [t = time] - The time at which to get the orientation
         * @returns The orientation, in degrees.
         */
        function "getOrientationAtTime"(l: Layer, t?: float): float;
        /**
         * Gets the world speed of a property.
         * @param [t = time] - Time from when to get the position
         * @param [prop = thisProperty] - The property
         * @returns The world speed
         */
        function "getPropWorldSpeed"(t?: number, prop?: Layer): number[];
        /**
         * Gets the world coordinates of a property.
         * @param [t = time] - Time from when to get the position
         * @param [prop = thisProperty] - The property
         * @returns The world coordinates
         */
        function "getPropWorldValue"(t?: number, prop?: Layer): number[];
        /**
         * Gets the world velocity of a property.<br />
        Note that for performance reasons with expressions, even if the parameters of the function are documented with optional/default values, you MUST provide ALL the arguments when using them.
         * @param [t = time] - Time from when to get the position
         * @param [prop = thisProperty] - The property
         * @returns The world velocity
         */
        function "getPropWorldVelocity"(t?: number, prop?: Layer): number[];
        /**
         * Gets the world scale of a layer.
         * @param l - The layer to get the scale from
         * @returns The scale, in percent.
         */
        function "getScale"(l: Layer): float[];
        /**
         * Checks if the layer has been flipped (scale sign is not the same on both axis).
         * @param [l = thisLayer] - The layer
         * @returns Whether the layer is flipped
         */
        function "isLayerFlipped"(l?: Layer): boolean;
        /**
         * 2D transformation matrix object initialized with identity matrix. See the source code for more documentation.
         * @property a - scale x
         * @property b - shear y
         * @property c - shear x
         * @property d - scale y
         * @property e - translate x
         * @property f - translate y
         */
        class "Matrix" {
            /**
             * scale x
            */
            a: number;
            /**
             * shear y
            */
            b: number;
            /**
             * shear x
            */
            c: number;
            /**
             * scale y
            */
            d: number;
            /**
             * translate x
            */
            e: number;
            /**
             * translate y
            */
            f: number;
        }
        /**
         * Transform the points from layer to world coordinates
         * @param points - The points
         * @param layer - The layer
         * @returns The points in world coordinates
         */
        function "pointsToWorld"(points: float[][], layer: Layer): float[][];
        /**
         * Gets the points of the shape path in layer coordinates (applies the group transform)
         * @param prop - The property from which to get the path
         * @returns The points in layer coordinates
         */
        function "shapePointsToLayer"(prop: Property): float[][];
        /**
         * Translates a point with a layer, as if it was parented to it.<br />
        Note that for performance reasons with expressions, even if the parameters of the function are documented with optional/default values, you MUST provide ALL the arguments when using them.
         * @param l - The layer to get the translation from.
         * @param [point = [0,0]] - The [X,Y] point to translate (using world coordinates).
         * @param [startT = 0] - The start time of the translation
         * @param [endT = time] - The end time of the translation
         * @returns The coordinates of the translated point.
         */
        function "translatePointWithLayer"(l: Layer, point?: float[], startT?: float, endT?: float): float[];
    }
    /**
     * The expression library<br />
    Use {@link DuAEExpression.Library.get} and {@link DuAEExpression.Library.getRequirements}<br />
    to easily include the methods and classes listed here to your expressions.<br />
    These methods take the name (listed here) of the function/class as arguments.
     */
    namespace Library {
        /**
         * Gets functions and their dependencies from the library.
         * @param functions - The name of the functions to get
         * @returns The expression
         */
        function get(functions: string[]): string;
        /**
         * A recursive method to get all the requirements (dependencies) of a function from a library
         * @param functionName - The name of the function
         * @returns The names of the required functions, including the querried one
         */
        function getRequirements(functionName: string): string[];
        /**
         * Blends two colors together
         * @param colorA - The first color
         * @param colorB - The second color
         * @param [opacity] - The opacity of the second color, overrides colorB[3].
         * @param [blendlingMode = 0] - The blending mode, one of:<br/>
        0: Normal<br/>
        1: Add<br/>
        2: Lighter color<br/>
        3: Multiply<br/>
        4: Darker color<br/>
         * @returns The new color
         */
        function "blendColor"(colorA: float[], colorB: float[], opacity?: float, blendlingMode?: int): float[];
        /**
         * Blends two colors together
         * @param colorA - The first color
         * @param colorB - The second color
         * @param [opacity = 1] - The opacity
         * @param [blendlingMode = 0] - The blending mode, one of:<br/>
        0: Normal<br/>
        1: Add<br/>
        3: Multiply<br/>
         * @returns The new value
         */
        function "blendColorValue"(colorA: float, colorB: float, opacity?: float, blendlingMode?: int): float;
        /**
         * Fuzzy Logics for expressions. See {@link https://github.com/Nico-Duduf/DuFuzzyLogic} for more explanations
         */
        class "FuzzyLogic" {
        }
        /**
         * A (very) simplified version of FuzzyLogics, better for performance with expressions.<br />
        See {@link https://github.com/Nico-Duduf/DuFuzzyLogic} for more explanations
         * @param v - The original veracity, must be in the range [0.0, 1.0]
         * @param [f = 1] - A factor to adjust the <i>importance</i> of the veracity, when compared to others.
         */
        class "FuzzyVeracity" {
            constructor(v: number, f?: number);
        }
        /**
         * Animates the property using the given keyframes
         * @example
         * var keyframes = [
           {value: 0, time: 1, interpolation: linear},
           {value: 180, time: 2, interpolation: gaussianInterpolation, params: -0.5}, //You need to include the gaussianInterpolation function from DuAEF
           {value: 250, time: 4, interpolation: ease},
           {value: 360, time: 5},
        ];
        animate(keyframes, 'cycle', 'pingpong');
         * @param keyframes - The keyframes. An object with four properties:<br/>
        <code>value</code> The value of the keyframe<br />
        <code>time</code> The time of the keyframe<br />
        <code>interpolation</code> (optional. Default: linear) A function taking 5 arguments to interpolate between this keyframe and the next one<br />
        <code>params</code> (optional.) A sixth argument passed to the interpolation function. To be used with DuAEF interpolations.<br />
        Note that the keyframes <strong>must be sorted</strong>. The function does not sort them, as it would have a bad impact on performance.
         * @param [loopOut = 'none'] - One of 'none', 'cycle', 'pingpong'.
         * @param [loopIn = 'none'] - One of 'none', 'cycle', 'pingpong'.
         * @param [time = time] - Use this to control how time flows.
         * @returns the animated value.
         */
        function "animate"(keyframes: object[], loopOut?: string, loopIn?: string, time?: float): number;
        /**
         * Interpolates a value with a bezier curve.<br />
        This method can replace <code>linear()</code> and <code>ease()</code> with a custom bézier interpolation.
         * @param t - The value to interpolate
         * @param [tMin = 0] - The minimum value of the initial range
         * @param [tMax = 1] - The maximum value of the initial range
         * @param [value1 = 0] - The minimum value of the interpolated result
         * @param [value2 = 1] - The maximum value of the interpolated result
         * @param [bezierPoints = [0.33,0.0,0.66,1.0]] - an Array of 4 coordinates wihtin the [0.0, 1.0] range which describes the Bézier interpolation. The default mimics the native ease() function<br />
        [ outTangentX, outTangentY, inTangentX, inTangentY ]
         * @returns the value.
         */
        function "bezierInterpolation"(t: number, tMin?: number, tMax?: number, value1?: number, value2?: number, bezierPoints?: number[]): number;
        /**
         * Interpolates a value with an exponential function.<br />
        This method can replace <code>linear()</code> and <code>ease()</code> with a gaussian interpolation.<br />
        Note that for performance reasons with expressions, even if the parameters of the function are documented with optional/default values, you MUST provide ALL the arguments when using them.
         * @param t - The value to interpolate
         * @param [tMin = 0] - The minimum value of the initial range
         * @param [tMax = 1] - The maximum value of the initial range
         * @param [value1 = 0] - The minimum value of the interpolated result
         * @param [value2 = 1] - The maximum value of the interpolated result
         * @param [rate = 1] - The raising speed in the range [0, inf].
         * @returns the value.
         */
        function "expInterpolation"(t: number, tMin?: number, tMax?: number, value1?: number, value2?: number, rate?: number): number;
        /**
         * Interpolates a value with a gaussian function.<br />
        This method can replace <code>linear()</code> and <code>ease()</code> with a gaussian interpolation.<br />
        Note that for performance reasons with expressions, even if the parameters of the function are documented with optional/default values, you MUST provide ALL the arguments when using them.
         * @param t - The value to interpolate
         * @param [tMin = 0] - The minimum value of the initial range
         * @param [tMax = 1] - The maximum value of the initial range
         * @param [value1 = 0] - The minimum value of the interpolated result
         * @param [value2 = 1] - The maximum value of the interpolated result
         * @param [rate = 0] - The raising speed in the range [-1.0, 1.0].
         * @returns the value.
         */
        function "gaussianInterpolation"(t: number, tMin?: number, tMax?: number, value1?: number, value2?: number, rate?: number): number;
        /**
         * Converts a Gaussian rate (as used with <code>gaussianInterpolation</code>) to the closest possible Bézier controls for use with <code>bezierInterpolation</code>.
         * @param rate - The raising speed in the range [-1.0, 1.0].
         * @returns the value.
         */
        function "gaussianRateToBezierPoints"(rate: number): number;
        /**
         * Integrates the (linear) keyframe values. Useful to animate frequencies!
        cf. {@link http://www.motionscript.com/articles/speed-control.html} for more explanation.
         * @param [prop = thisProperty] - The property with the keyframes.
         */
        function "integrateLinearKeys"(prop?: Property): void;
        /**
         * Fixes interpolation of colors by using HSL or a smart HSL taking the smallest path
         * @param [t = time] - The value to interpolate and extrapolate
         * @param [mode = 2] - How to interpolate the colors, one of: 0 for 'RGB', 1 for 'HSL', or 2 for 'shortest-path HSL', 3 for 'longest-path HSL', or 4 for 'combined-RGB SL'
         * @param [tMin = 0] - The minimum value of the initial range
         * @param [tMax = 1] - The maximum value of the initial range
         * @param [colorA = [0,0,0,0]] - The first color
         * @param [colorB = [1,1,1,1]] - The second color
         * @param [interpolationMethod = ease] - The interpolation function, like linear(), easeIn(), easeOut(), etc.<br/>
        Or any other method taking the same five arguments.
         */
        function "interpolateColor"(t?: number, mode?: int, tMin?: number, tMax?: number, colorA?: number[], colorB?: number[], interpolationMethod?: (...params: any[]) => any): void;
        /**
         * Clamps a value, but with a smooth interpolation according to a softness parameter
         * @param value - The value to limit
         * @param [min] - The minimum value
         * @param [max] - The maximum value
         * @param [softness = 0] - The softness, a value corresponding value, from which the interpolation begins to slow down
         */
        function "limit"(value: number | number[], min?: number | number[] | null, max?: number | number[] | null, softness?: number): void;
        /**
         * Interpolates a value with a linear function, but also extrapolates it outside of known values.<br />
        This method can replace <code>linear()</code>, adding extrapolation.<br />
        Note that for performance reasons with expressions, even if the parameters of the function are documented with optional/default values, you MUST provide ALL the arguments when using them.
         * @param t - The value to interpolate and extrapolate
         * @param [tMin = 0] - The minimum value of the initial range
         * @param [tMax = 1] - The maximum value of the initial range
         * @param [value1 = 0] - The minimum value of the interpolated result
         * @param [value2 = 1] - The maximum value of the interpolated result
         * @returns the value.
         */
        function "linearExtrapolation"(t: number, tMin?: number, tMax?: number, value1?: number, value2?: number): number;
        /**
         * Interpolates a value with a logarithmic function.<br />
        This method can replace <code>linear()</code> and <code>ease()</code> with a gaussian interpolation.<br />
        Note that for performance reasons with expressions, even if the parameters of the function are documented with optional/default values, you MUST provide ALL the arguments when using them.
         * @param t - The value to interpolate
         * @param [tMin = 0] - The minimum value of the initial range
         * @param [tMax = 1] - The maximum value of the initial range
         * @param [value1 = 0] - The minimum value of the interpolated result
         * @param [value2 = 1] - The maximum value of the interpolated result
         * @param [rate = 1] - The raising speed in the range [0, inf].
         * @returns the value.
         */
        function "logInterpolation"(t: number, tMin?: number, tMax?: number, value1?: number, value2?: number, rate?: number): number;
        /**
         * Interpolates a value with a logistic (sigmoid) function.<br />
        This method can replace <code>linear()</code> and <code>ease()</code> with a gaussian interpolation.
         * @param t - The value to interpolate
         * @param [tMin = 0] - The minimum value of the initial range
         * @param [tMax = 1] - The maximum value of the initial range
         * @param [value1 = 0] - The minimum value of the interpolated result
         * @param [value2 = 1] - The maximum value of the interpolated result
         * @param [rate = 1] - The raising speed in the range [0, inf].
         * @param [tMid] - The t value at which the interpolated value should be half way. By default, (tMin+tMax)/2
         * @returns the value.s
         */
        function "logisticInterpolation"(t: number, tMin?: number, tMax?: number, value1?: number, value2?: number, rate?: number, tMid?: number): number;
        /**
         * Gets the key immediately before the given time
         * @param [t = time] - Time at which to get the key
         * @param [prop = thisProperty] - The property from which to get the key
         * @returns The key, or null if there's no key before.
         */
        function "getNextKey"(t?: number, prop?: Property): Key | null;
        /**
         * Gets the next key where there is no motion after it
         * @param [t = time] - Time at which to get the key
         * @param [prop = thisProperty] - The property from which to get the key
         * @returns The key, or null if there's no key before.
         */
        function "getNextStopKey"(t?: number, prop?: Property): Key | null;
        /**
         * Gets the key immediately before the given time
         * @param [t = time] - Time at which to get the key
         * @param [prop = thisProperty] - The property from which to get the key
         * @returns The key, or null if there's no key before.
         */
        function "getPrevKey"(t?: number, prop?: Property): Key | null;
        /**
         * Gets the previous key where there is no motion before it
         * @param [t = time] - Time at which to get the key
         * @param [prop = thisProperty] - The property from which to get the key
         * @returns The key, or null if there's no key before.
         */
        function "getPrevStartKey"(t?: number, prop?: Property): Key | null;
        /**
         * Checks if current time is after the time of the last key in the property
         * @returns true if time is > lastkey.time
         */
        function "isAfterLastKey"(): boolean;
        /**
         * Checks if the key is a maximum or minimum
         * @param k - The key to check
         * @param axis - The axis to check for multi-dimensionnal properties
         * @returns true if the key is a maximum or minimum
         */
        function "isKeyTop"(k: Keyframe, axis: int): boolean;
        /**
         * Bounce, to be used when the speed is 0.
         * @param t - The time at which the value must be got. To end the loop, pass the same time for all subsequent frames.
         * @param elasticity - The elasticity, which controls the amplitude and frequence according to the last known velocity
         * @param damping - Damping
         * @param [vAtTime = valueAtTime] - A function to replace valueAtTime. Use this to loop after an expression+keyframe controlled animation, by providing a function used to generate the animation.
         * @returns The new value
         */
        function "bounce"(t: float, elasticity: float, damping: float, vAtTime?: (...params: any[]) => any): float | float[];
        /**
         * Animatable equivalent to loopIn('continue').
         * @param t - The time at which the value must be got. To end the loop, pass the same time for all previous frames.
         * @param [damping = 0] - Exponentially attenuates the effect over time
         * @returns The new value
         */
        function "continueIn"(t: float, damping?: float): float | float[];
        /**
         * Animatable equivalent to loopOut('continue').
         * @param t - The time at which the value must be got. To end the loop, pass the same time for all subsequent frames.
         * @param [damping = 0] - Exponentially attenuates the effect over time
         * @returns The new value
         */
        function "continueOut"(t: float, damping?: float): float | float[];
        /**
         * Animatable equivalent to loopIn('cycle') and loopIn('offset').
         * @param t - The time at which the value must be got. To end the loop, pass the same time for all previous frames.
         * @param nK - The number of keyframes to loop. Use 0 to loop all keyframes
         * @param o - Wether to offset or cycle
         * @param [vAtTime = valueAtTime] - A function to replace valueAtTime. Use this to loop after an expression+keyframe controlled animation, by providing a function used to generate the animation.
         * @param [damping = 0] - Exponentially attenuates the effect over time
         * @returns The new value
         */
        function "cycleIn"(t: float, nK: int, o: boolean, vAtTime?: (...params: any[]) => any, damping?: float): float | float[];
        /**
         * Animatable equivalent to loopOut('cycle') and loopOut('offset').
         * @param t - The time at which the value must be got. To end the loop, pass the same time for all subsequent frames.
         * @param nK - The number of keyframes to loop. Use 0 to loop all keyframes
         * @param o - Wether to offset or cycle
         * @param [vAtTime = valueAtTime] - A function to replace valueAtTime. Use this to loop after an expression+keyframe controlled animation, by providing a function used to generate the animation.
         * @param [damping = 0] - Exponentially attenuates the effect over time
         * @returns The new value
         */
        function "cycleOut"(t: float, nK: int, o: boolean, vAtTime?: (...params: any[]) => any, damping?: float): float | float[];
        /**
         * Overshoot animation, to be used when the speed is 0.
         * @param t - The time at which the value must be got. To end the loop, pass the same time for all subsequent frames.
         * @param elasticity - The elasticity, which controls the amplitude and frequence according to the last known velocity
         * @param damping - Damping
         * @param [vAtTime = valueAtTime] - A function to replace valueAtTime. Use this to loop after an expression+keyframe controlled animation, by providing a function used to generate the animation.
         * @returns The new value
         */
        function "overshoot"(t: float, elasticity: float, damping: float, vAtTime?: (...params: any[]) => any): float | float[];
        /**
         * Animatable equivalent to loopIn('pingpong').
         * @param t - The time at which the value must be got. To end the loop, pass the same time for all previous frames.
         * @param nK - The number of keyframes to loop. Use 0 to loop all keyframes
         * @param [vAtTime = valueAtTime] - A function to replace valueAtTime. Use this to loop after an expression+keyframe controlled animation, by providing a function used to generate the animation.
         * @param [damping = 0] - Exponentially attenuates the effect over time
         * @returns The new value
         */
        function "pingPongIn"(t: float, nK: int, vAtTime?: (...params: any[]) => any, damping?: float): float;
        /**
         * Animatable equivalent to loopOut('pingpong').
        Note that for performance reasons with expressions, even if the parameters of the function are documented with optional/default values, you MUST provide ALL the arguments when using them.
         * @param t - The time at which the value must be got. To end the loop, pass the same time for all subsequent frames.
         * @param nK - The number of keyframes to loop. Use 0 to loop all keyframes
         * @param [vAtTime = valueAtTime] - A function to replace valueAtTime. Use this to loop after an expression+keyframe controlled animation, by providing a function used to generate the animation.
         * @param [damping = 0] - Exponentially attenuates the effect over time
         * @returns The new value
         */
        function "pingPongOut"(t: float, nK: int, vAtTime?: (...params: any[]) => any, damping?: float): float;
        /**
         * Adds two lists of points/vectors.
         * @param p1 - The list of points
         * @param p2 - The other list of points
         * @param w - A weight to multiply the values of p2
         * @returns The added points
         */
        function "addPoints"(p1: float[][], p2: float[][], w: float): float[][];
        /**
         * Gets the distance of a point to a line
         * @param point - The point [x,y]
         * @param line - The line [ A , B ] where A and B are two points
         * @returns The distance
         */
        function "distanceToLine"(point: float[], line: float[][]): float;
        /**
         * The gaussian function
         * @param value - The variable
         * @param [min = 0] - The minimum return value
         * @param [max = 1] - The maximum return value
         * @param [center = 0] - The center of the peak
         * @param [fwhm = 1] - The full width at half maximum of the curve
         * @returns The result
         */
        function "gaussian"(value: number, min?: number, max?: number, center?: number, fwhm?: number): number;
        /**
         * The inverse gaussian function
         * @param v - The variable
         * @param [min = 0] - The minimum return value of the corresponding gaussian function
         * @param [max = 1] - The maximum return value of the corresponding gaussian function
         * @param [center = 0] - The center of the peak of the corresponding gaussian function
         * @param [fwhm = 1] - The full width at half maximum of the curve of the corresponding gaussian function
         * @returns The two possible results, the lower is the first in the list. If both are the same, it is the maximum
         */
        function "inverseGaussian"(v: number, min?: number, max?: number, center?: number, fwhm?: number): Number[];
        /**
         * The inverse logistic function (inverse sigmoid)
         * @param v - The variable
         * @param [midValue = 0] - The midpoint value, at which the function returns max/2 in the original logistic function
         * @param [min = 0] - The minimum return value of the original logistic function
         * @param [max = 1] - The maximum return value of the original logistic function
         * @param [rate = 1] - The logistic growth rate or steepness of the original logistic function
         * @returns The result
         */
        function "inverseLogistic"(v: number, midValue?: number, min?: number, max?: number, rate?: number): number;
        /**
         * Checks if the value is 0; works with arrays.
         * @param x - The value(s)
         * @returns true if all values are 0.
         */
        function "isZero"(x: number | Number[]): boolean;
        /**
         * The logistic function (sigmoid)
         * @param value - The value
         * @param [midValue = 0] - The midpoint value, at which the function returns max/2
         * @param [min = 0] - The minimum return value
         * @param [max = 1] - The maximum return value
         * @param [rate = 1] - The logistic growth rate or steepness of the function
         * @returns The result in the range [min, max] (excluding min and max)
         */
        function "logistic"(value: number, midValue?: number, min?: number, max?: number, rate?: number): number;
        /**
         * Returns the mean of a set of values
         * @param values - The values
         * @returns The mean
         */
        function "mean"(values: Number[]): number;
        /**
         * Multiplies a list of points/vectors with a scalar.
         * @param p - The list of points
         * @param w - The multiplier
         * @returns The multiplied points
         */
        function "multPoints"(p: float[][], w: float): float[][];
        /**
         * Multiplies two sets of values, one with each other. If the lists are not the same length, additional values will be ignored
         * @param setA - The first list
         * @param setB - The other list
         * @returns The new values
         */
        function "multSets"(setA: float[], setB: float[]): float[];
        /**
         * Normalizes a list of weights so their sum equals 1.0
         * @param weights - The weights to normalize
         * @param [sum] - The sum of the weights; provide it if it's already computed to improve performance.
         * @returns The normalized weights
         */
        function "normalizeWeights"(weights: float[], sum?: float): float[];
        /**
         * Substracts two lists of points/vectors.
         * @param p1 - The list of points
         * @param p2 - The other list of points
         * @param w - A weight to multiply the values of p2
         * @returns The substracted points
         */
        function "subPoints"(p1: float[][], p2: float[][], w: float): float[][];
        /**
         * Adds two paths together.<br />
        The paths must be objects with three array attributes: points, inTangents, outTangents
         * @param path1 - First path
         * @param path2 - Second path
         * @param path2weight - A weight to multiply the second path values
         * @returns A path object with three array attributes: points, inTangents, outTangents
         */
        function "addPath"(path1: any, path2: any, path2weight: float): any;
        /**
         * Checks if a point is inside a given polygon.
         * @param point - A 2D point [x, y]
         * @param points - The vertices of the polygon
         * @returns An object with two properties:
        - `inside (bool)` is true if the point is inside the polygon
        - `closestVertex` is the index of the closest vertex of the polygon
         */
        function "inside"(point: float[], points: float[][]): any;
        /**
         * Multiplies a path with a scalar.<br />
        The path must be an object with three array attributes: points, inTangents, outTangents
         * @param path - The path
         * @param weight - The multipliers
         * @returns A path object with three array attributes: points, inTangents, outTangents
         */
        function "multPath"(path: any, weight: float): any;
        /**
         * Substracts two paths together.<br />
        The paths must be objects with three array attributes: points, inTangents, outTangents
         * @param path1 - First path
         * @param path2 - Second path
         * @param path2weight - A weight to multiply the second path values
         * @returns A path object with three array attributes: points, inTangents, outTangents
         */
        function "subPath"(path1: any, path2: any, path2weight: float): any;
        /**
         * Checks the type of a pseudo-effect used by Duik.<br />
        This is a workaround for the missing matchName in expressions.<br />
        Pseudo-Effects used by Duik start with a hidden property which name is the same as the matchName of the effect itself (without the 'Pseudo/' part).
         * @example
         * if ( checkEffect(thisLayer.effect(1), "DUIK parentConstraint2") ) { "This is the second version of the parent constraint by Duik" }
        else { "Who knows what this is?" }
         * @param fx - The effect to check
         * @param duikMatchName - The matchName of a pseudo-effect used by Duik (without the 'Pseudo/' part)
         * @returns True when the property at propIndex is named propName
         */
        function "checkDuikEffect"(fx: Property, duikMatchName: string): boolean;
        /**
         * Checks the type of an effect.<br />
        This is a workaround for the missing matchName in expressions.<br />
        It checks if the given effect has a specific property at a specific index.
         * @example
         * if ( checkEffect(thisLayer.effect(1), 1, "Blur") ) { "The first effect is a blur!" }
        else { "Who knows what this is?" }
         * @param fx - The effect to check
         * @param propIndex - The index of the property
         * @param propName - The expected name of the property. Be careful with the internationalization of After Effects...
         * @returns True when the property at propIndex is named propName
         */
        function "checkEffect"(fx: Property, propIndex: int, propName: string): boolean;
        /**
         * Gets a layer from a layer property in an effect, without generating an error if "None" is selected with the Legacy expression engine.
         * @param fx - The effect
         * @param ind - The index or the name of the property
         * @returns The layer, or null if set to "None"
         */
        function "getEffectLayer"(fx: Property, ind: int | string): Layer | null;
        /**
         * Gets the path from the current property at a given time.
         * @returns A path object with three array attributes: points, inTangents, outTangents
         */
        function "getPath"(): any;
        /**
         * Gets a property from an array of indices as returned by getPropPath.
         * @param l - The layer containing the needed property
         * @param p - The indices to the property.
         * @returns The property.
         */
        function "getPropFromPath"(l: Layer, p: int[]): Property;
        /**
         * Gets an array of all indices needed to get the current property from the layer level.
         * @returns All indices to the property.
         */
        function "getPropPath"(): int[];
        /**
         * Gets the same property as the current one but from another layer.
         * @param l - The layer containing the needed property
         * @returns The property.
         */
        function "getSameProp"(l: Layer): Property;
        /**
         * Checks if a property is a layer. Useful when traversing up the property tree to stop when getting the layer.
         * @param prop - The property to test
         * @returns true if the prop is a layer
         */
        function "isLayer"(prop: Property): boolean;
        /**
         * Checks if a property is a path property.
         * @param prop - The property
         * @returns true if the property is a path property.
         */
        function "isPath"(prop: Property): boolean;
        /**
         * Checks if a property is a transform.position property.<br />
        Note that for performance reasons with expressions, even if the parameters of the function are documented with optional/default values, you MUST provide ALL the arguments when using them.
         * @param [prop = thisProperty] - The property
         * @returns true if the property is the transform.position property.
         */
        function "isPosition"(prop?: Property): boolean;
        /**
         * Checks if a property is spatial
         * @param [prop = thisProperty] - The property to check
         * @returns true if the property is spatial.
         */
        function "isSpatial"(prop?: Property): boolean;
        /**
         * Checks if the current property is animated at a given time.
         * @param [t = time] - The time
         * @param [threshold = 0.01] - The speed under which the property is considered still.
         * @param [axis = -1] - The axis to check. If < 0, will check all axis.
         * @returns true if the property does not vary.
         */
        function "isStill"(t?: number, threshold?: number, axis?: number): boolean;
        /**
         * Checks the last previous time at which the property value was not 0. (meant to be used on boolean property, works on single dimension properties too).
         * @param prop - The property to check
         * @param t - The time before which to run the check
         * @returns The last active time before t
         */
        function "lastActiveTime"(prop: Property, t: float): float;
        /**
         * Checks the next time at which the property value was not 0. (meant to be used on boolean property, works on single dimension properties too).
         * @param prop - The property to check
         * @param t - The time after which to run the check
         * @returns The next active time after t
         */
        function "nextActiveTime"(prop: Property, t: float): float;
        /**
         * Generates a "zero" value for the current property, i.e. <code>0</code> or <code>[0,0]</code>, etc. according to the property type.<br />
        Note that for path properties, this method returns a path object with three array attributes: points, inTangents, outTangents.
         * @returns The zero value.
         */
        function "zero"(): any;
        /**
         * Adds some noise to a value.<br />
        You may use seedRandom() before using this function as it will influence the generated noise.
        A timeless noise can be achieved with <code>seedRandom(index,true)</code> for example.
         * @example
         * seedRandom(index, true) // a timeless noise
        addNoise(value, 50 ); // the property value will have noise between (value * 0.5) and (value * 1.5) which won't vary through time.
         * @example
         * seedRandom(index, false);
        addNoise(value, 33 ); // the noise will change at each frame, varying between (value * .66) and (value * 1.33)
         * @param val - The value to add noise to.
         * @param quantity - The quantity of noise. A percentage. 100 means the value can range from (val * 0) to (val * 2).
         */
        function "addNoise"(val: number | number[], quantity: float): void;
        /**
         * Removes the ancestors rotation from the rotation of a layer.
        This is very useful to make a layer keep its orientation without being influenced by its parents.<br />
         * @example
         * //in a rotation property, just include the function and use:
        dishineritRotation();
        //the layer will now keep its own orientation.
         * @example
         * //you can also combine the result with something else
        var result = dishineritRotation();
        result + wiggle(5,20);
         * @param [l = thisLayer] - The layer
         * @returns The new rotation value, in degrees.
         */
        function "dishineritRotation"(l?: Layer): float;
        /**
         * Removes the ancestors scale from the scale of a layer.
        This is very useful to make a layer keep its scale without being influenced by its parents.<br />
        Note that for performance reasons with expressions, even if the parameters of the function are documented with optional/default values, you MUST provide ALL the arguments when using them.
         * @example
         * //in a rotation property, just include the function and use:
        dishineritScale();
        //the layer will now keep its own scale.
         * @example
         * //you can also combine the result with something else
        var result = dishineritScale();
        result + wiggle(5,20);
         * @param [l = thisLayer] - The layer
         * @returns The new scale value, in percent.
         */
        function "dishineritScale"(l?: Layer): float[];
        /**
         * Converts the point coordinates from the current group in the shape layer to the Layer.<br />
        Use toWorld and toComp with the result if you need te coordinates in the world or the comp.
         * @param point - The 2D coordinates of the point in the current group.
         * @returns The 2D coordinates of the point in the Layer.
         */
        function "fromGroupToLayer"(point: number[]): number[];
        /**
         * Converts the point coordinates from Layer to the current group in the shape layer.<br />
        Use fromWorld or fromComp first if you need to convert from the world or composition coordinates, and pass the result to this function.
         * @param point - The 2D coordinates of the point in the Layer.
         * @returns The 2D coordinates of the point in the current group.
         */
        function "fromLayerToGroup"(point: number[]): number[];
        /**
         * Gets the "real" scale of a layer, resulting to its scale property, the scale of its parents, and it's location in Z-space if it's 3D.<br />
        Note that for performance reasons with expressions, even if the parameters of the function are documented with optional/default values, you MUST provide ALL the arguments when using them.
         * @param [l = thisLayer] - The layer
         * @param [t = time] - The time when to get the scale
         * @returns The scale ratio. This is not a percent, 1.0 is 100%.
         */
        function "getCompScale"(l?: Layer, t?: number): number;
        /**
         * Gets the transformation Matrix for the current group in a shape layer, including the transformation from the ancestor groups<br />
        Note that for performance reasons with expressions, even if the parameters of the function are documented with optional/default values, you MUST provide ALL the arguments when using them.
         * @param [prop = thisProperty] - The property from which to get the matrix
         * @returns The 2D Transform Matrix.
         */
        function "getGroupTransformMatrix"(prop?: Property): Matrix;
        /**
         * Gets the comp position (2D Projection in the comp) of a layer.
         * @param [t = time] - Time from when to get the position
         * @param [l = thisLayer] - The layer
         * @returns The comp position
         */
        function "getLayerCompPos"(t?: number, l?: Layer): number[];
        /**
         * Gets the world position of a layer.<br />
        Note that for performance reasons with expressions, even if the parameters of the function are documented with optional/default values, you MUST provide ALL the arguments when using them.
         * @param other - The other layer
         * @param [origin = thisLayer] - The origin
         * @param [t = time] - Time from when to get the position
         * @returns The world position
         */
        function "getLayerDistance"(other: Layer, origin?: Layer, t?: number): number[];
        /**
         * Gets the world position of a layer.
         * @param [t = time] - Time from when to get the position
         * @param [l = thisLayer] - The layer
         * @returns The world position
         */
        function "getLayerWorldPos"(t?: number, l?: Layer): number[];
        /**
         * Gets the world instant speed of a layer.
         * @param [t = time] - The time when to get the velocity
         * @param [l = thisLayer] - The layer
         * @returns A positive number. The speed.
         */
        function "getLayerWorldSpeed"(t?: number, l?: Layer): number;
        /**
         * Gets the world instant velocity of a layer.<br />
        Note that for performance reasons with expressions, even if the parameters of the function are documented with optional/default values, you MUST provide ALL the arguments when using them.
         * @param [t = time] - The time when to get the velocity
         * @param [l = thisLayer] - The layer
         * @returns The velocity.
         */
        function "getLayerWorldVelocity"(t?: number, l?: Layer): number[];
        /**
         * Gets the world orientation of a (2D) layer.
         * @param l - The layer to get the orientation from
         * @returns The orientation, in degrees.
         */
        function "getOrientation"(l: Layer): float;
        /**
         * Gets the world orientation of a (2D) layer at a specific time.<br />
        Note that for performance reasons with expressions, even if the parameters of the function are documented with optional/default values, you MUST provide ALL the arguments when using them.
         * @param l - The layer to get the orientation from
         * @param [t = time] - The time at which to get the orientation
         * @returns The orientation, in degrees.
         */
        function "getOrientationAtTime"(l: Layer, t?: float): float;
        /**
         * Gets the world speed of a property.
         * @param [t = time] - Time from when to get the position
         * @param [prop = thisProperty] - The property
         * @returns The world speed
         */
        function "getPropWorldSpeed"(t?: number, prop?: Layer): number[];
        /**
         * Gets the world coordinates of a property.
         * @param [t = time] - Time from when to get the position
         * @param [prop = thisProperty] - The property
         * @returns The world coordinates
         */
        function "getPropWorldValue"(t?: number, prop?: Layer): number[];
        /**
         * Gets the world velocity of a property.<br />
        Note that for performance reasons with expressions, even if the parameters of the function are documented with optional/default values, you MUST provide ALL the arguments when using them.
         * @param [t = time] - Time from when to get the position
         * @param [prop = thisProperty] - The property
         * @returns The world velocity
         */
        function "getPropWorldVelocity"(t?: number, prop?: Layer): number[];
        /**
         * Gets the world scale of a layer.
         * @param l - The layer to get the scale from
         * @returns The scale, in percent.
         */
        function "getScale"(l: Layer): float[];
        /**
         * Checks if the layer has been flipped (scale sign is not the same on both axis).
         * @param [l = thisLayer] - The layer
         * @returns Whether the layer is flipped
         */
        function "isLayerFlipped"(l?: Layer): boolean;
        /**
         * 2D transformation matrix object initialized with identity matrix. See the source code for more documentation.
         * @property a - scale x
         * @property b - shear y
         * @property c - shear x
         * @property d - scale y
         * @property e - translate x
         * @property f - translate y
         */
        class "Matrix" {
            /**
             * scale x
            */
            a: number;
            /**
             * shear y
            */
            b: number;
            /**
             * shear x
            */
            c: number;
            /**
             * scale y
            */
            d: number;
            /**
             * translate x
            */
            e: number;
            /**
             * translate y
            */
            f: number;
        }
        /**
         * Transform the points from layer to world coordinates
         * @param points - The points
         * @param layer - The layer
         * @returns The points in world coordinates
         */
        function "pointsToWorld"(points: float[][], layer: Layer): float[][];
        /**
         * Gets the points of the shape path in layer coordinates (applies the group transform)
         * @param prop - The property from which to get the path
         * @returns The points in layer coordinates
         */
        function "shapePointsToLayer"(prop: Property): float[][];
        /**
         * Translates a point with a layer, as if it was parented to it.<br />
        Note that for performance reasons with expressions, even if the parameters of the function are documented with optional/default values, you MUST provide ALL the arguments when using them.
         * @param l - The layer to get the translation from.
         * @param [point = [0,0]] - The [X,Y] point to translate (using world coordinates).
         * @param [startT = 0] - The start time of the translation
         * @param [endT = time] - The end time of the translation
         * @returns The coordinates of the translated point.
         */
        function "translatePointWithLayer"(l: Layer, point?: float[], startT?: float, endT?: float): float[];
    }
}

/**
 * After Effects project methods
 */
declare namespace DuAEProject {
    /**
     * Sets the project in "waiting mode" to speed up things.
     * @param [inProgress = true] - True to set progress mode, false to stop it.
     * @param [showProgressBar = true] - Will show a nice progress bar if true
     * @param [askToHideLayerControls = false] - Will prompt the user to hide layer controls to improve performance.
     * @param [eventCoordinates] - Provide the screen coordinates to center the progress bar and dialogs on the corresponding screen.
     * @returns false if the user cancelled the process, true otherwise
     */
    function setProgressMode(inProgress?: boolean, showProgressBar?: boolean, askToHideLayerControls?: boolean, eventCoordinates?: int[]): boolean;
    /**
     * Gets all compositions in the project (or only the root of the project, ignoring subfolders)
     * @param [rootOnly = false] - Set to true to get only comps from the root of the project
     * @returns The compositions
     */
    function getComps(rootOnly?: boolean): CompItem[];
    /**
     * Gets all selected compositions in the project
     * @returns The compositions
     */
    function getSelectedComps(): CompItem[];
    /**
     * Gets either the active comp or the first selected one
     * @returns The composition
     */
    function getSelectedComp(): CompItem | null;
    /**
     * Runs a function on all comps of the project
     * @param func - The function, which must take a CompItem as its single argument.
     * @param [selectedOnly = false] - Runs only on selected compositions
     */
    function doComps(func: (...params: any[]) => any, selectedOnly?: boolean): void;
    /**
     * Gets the After Effects current composition
     * @returns The current composition or null if there's no current comp
     */
    function getActiveComp(): CompItem | null;
    /**
     * Retrieves an item by its Item ID
     * @returns The item
     */
    function getItemById(): Item | null;
    /**
     * Retrieves the first item with the given name
     * @param name - The name to search
     * @param [folder] - A subfolder to search in
     * @returns The item
     */
    function getItemByName(name: string, folder?: FolderItem): Item | null;
    /**
     * Generates a new unique name for a composition
     * @param newName - The wanted new name
     * @param comp - The comp
     * @param [increment = true] - true to automatically increment the new name if it already ends with a digit
     * @returns The unique name, with a new number at the end if needed.
     */
    function newUniqueCompName(newName: string, comp: CompItem, increment?: boolean): string;
    /**
     * Checks if all comps have a different name.
     * @example
     * var dupes = DuAEProject.checkCompNames();
    if (dupes.length != 0) {
    for (name in dupes)
    {
        if (dupes.hasOwnProperty(name)) alert(dupes[name]); //dupes[name] is an array of Layer
    }
    }
     * @returns The list of names used several times. Check the length attribute to know how many duplicates were found, loop through the keys to get the names. Eech key is an array containing the list of comps with that name.
     */
    function checkCompNames(): any;
    /**
     * Gets the size of the current project file
     * @returns the size in Bytes. -1 if it has not been saved yet.
     */
    function getSize(): int;
    /**
     * The Expressions Engine setting in the Project Settings dialog box, as a string.
     * @returns One of: "extendscript", "javascript-1.0"
     */
    function expressionEngine(): string;
    /**
     * Makes sure all compositions in the project have unique names, renaming them if needed.
     * @param [comps] - A list of comps, all of them by default
     */
    function setUniqueCompNames(comps?: any[] | ItemCollection): void;
    /**
     * Reduces the project using the selected compositions, the same way the native command does it, but being able to keep comps used only by expressions. If there's no comp selected, will use all comps at the root of the project.
     * @param [keepExpressionOnly = true] - Set to false to ignore comps used only by expressions (same as the native command)
     */
    function reduceSelected(keepExpressionOnly?: boolean): void;
    /**
     * Reduces the project, the same way the native command does it, but being able to keep comps used only by expressions.
     * @param [comps] - The name or the id of the comp(s) to keep. If omitted, it will use all comps at the root of the project (the ones not in a subfolder).
     * @param [keepExpressionOnly = true] - Set to false to ignore comps used only by expressions (same as the native command)
     */
    function reduce(comps?: CompItem | CompItem[], keepExpressionOnly?: boolean): void;
    /**
     * Collects all dependencies in a folder
     * @param [destination] - The folder where to save the files. The project files will be collected in a subfolder called "project name.aep.archive" or "project name.aep.zip". If not provided, will use the current folder.
     * @param [overwrite = false] - Whether to overwrite existing footage in the destination.
     * @param [zip = false] - Set to true to automatically zip the archive.
     * @param [createProjectFolder = true] - Whether to create a folder for this project or use the destination as is.
     */
    function collectFiles(destination?: Folder, overwrite?: boolean, zip?: boolean, createProjectFolder?: boolean): void;
    /**
     * Replaces text in Expressions
     * @param oldString - The string to replace
     * @param newString - The new string
     * @param [caseSensitive = true] - Whether the search has to be case sensitive
     */
    function replaceInExpressions(oldString: string, newString: string, caseSensitive?: boolean): void;
    /**
     * Reimplements <code>app.project.autoFixExpressions()</code> because it does not work with some special characters.<br/>
    Automatically replaces text found in broken expressions in the project, if the new text causes the expression to evaluate without errors.
     * @param oldText - The text to replace.
     * @param newText - The new text.
     */
    function autoFixExpressions(oldText: string, newText: string): void;
    /**
     * Gets the unused footages.
     * @returns The list of unused items.
     */
    function getUnusedFootages(): FootageItem[];
    /**
     * Gets a folder with its name. If name is "Project Root" or empty, returns the root of the project.
     * @param folderName - The name of the folder.
     * @returns The folder or null if not found.
     */
    function getFolderItem(folderName: string): FolderItem | null;
    /**
     * Gets the unused compositions, except the ones in the given folder.
     * @param [folder] - The folder to exclude.
     * @returns The unused compositions
     */
    function getUnusedComps(folder?: FolderItem): CompItem[];
    /**
     * Gets all the precompositions located at the root of the project.
     */
    function getPrecompsAtRoot(): CompItem[];
    /**
     * Gets the project name (i.e. the file name without extension)
     * @returns The project name.
     */
    function name(): string;
    /**
     * Bakes the expressions to keyframes
     * @param [mode = DuAEExpression.BakeAlgorithm.SMART] - The algorithm to use for baking the expressions.
     * @param [frameStep = 1.0] - By default, checks one value per keyframe. A lower value increases the precision and allows for sub-frame sampling. A higher value is faster but less precise.
     */
    function bakeExpressions(mode?: DuAEExpression.BakeAlgorithm, frameStep?: float): void;
    /**
     * Bakes the expressions to keyframes
     * @param [mode = DuAEExpression.BakeAlgorithm.SMART] - The algorithm to use for baking the expressions.
     * @param [frameStep = 1.0] - By default, checks one value per keyframe. A lower value increases the precision and allows for sub-frame sampling. A higher value is faster but less precise.
     */
    function bakeCompositions(mode?: DuAEExpression.BakeAlgorithm, frameStep?: float): void;
    /**
     * Checks if the project contains at least one composition.
     */
    function containsComp(): boolean;
    /**
     * The Settings of the current project, an object similar to {@link DuSettings} except that it saves in the Project XMP
     */
    var settings: any;
}

/**
 * Manages XMP Metadata of the project.
 */
declare namespace DuAEProjectXMP {
    /**
     * Gets the XMP of the current project
     * @returns The XMP data
     */
    function getXmp(): XMPMeta;
    /**
     * Gets the value of a property.
     * @param prop - The name of the property
     * @param [type] - The property data type, one of: - XMPConst.STRING - XMPConst.INTEGER - XMPConst.NUMBER - XMPConst.BOOLEAN - XMPConst.XMPDATE
     * @returns The value
     */
    function getPropertyValue(prop: string, type?: XMPConst): any;
    /**
     * Sets the value of a property.
     * @param prop - The name of the property
     * @param value - The value
     */
    function setPropertyValue(prop: string, value: any): void;
    /**
     * Gets the project settings stored in XMP by DuAEF.
     * @returns The settings.
     */
    function getSettings(): any;
    /**
     * Saves the project settings stored in XMP by DuAEF.
     * @param settings - The settings.
     */
    function saveSettings(settings: any): void;
}

/**
 * After Effects item methods
 */
declare namespace DuAEItem {
    /**
     * Gets the compositions this item is used in.
     * @param item - The item
     * @param [includeExpressionOnly = false] - Check for comps using this item only through expressions. The cache has to be updated with {@link DuAEProject.updateExpressionCache} before using this method with this argument set to true.
     * @param [recursive = false] - Check recursively in parent comps too.
     * @returns The compositions.
     */
    function usedIn(item: AVItem, includeExpressionOnly?: boolean, recursive?: boolean): CompItem[];
    /**
     * Checks if this item source is an image sequence
     * @param item - The item
     * @returns true if the source is an image sequence
     */
    function isImageSequence(item: FootageItem): boolean;
    /**
     * Checks recursively (except for root folder) if an item is in a specific folder
     * @param item - The item to check
     * @param folder - The folder
     */
    function isInFolder(item: Item, folder: FolderItem): boolean;
}

/**
 * After Effects composition methods
 */
declare namespace DuAEComp {
    /**
     * Associative array to get Comp Renderer names from their matchNames
     */
    enum RendererNames {
    }
    /**
     * Converts the number of frames to the time in seconds
     * @param frames - The frames
     * @param [comp = DuAEProject.getActiveComp] - The comp
     * @returns The time, in seconds
     */
    function framesToTime(frames: int, comp?: CompItem): float;
    /**
     * Converts the time in seconds to the number of frames
     * @param [time = comp.time] - The time in seconds
     * @param [comp = DuAEProject.getActiveComp] - The comp
     * @returns The number of frames, rounded
     */
    function timeToFrames(time?: float, comp?: CompItem): int;
    /**
     * Replaces text in Expressions
     * @param oldString - The string to replace
     * @param newString - The new string
     * @param [caseSensitive = true] - Whether the search has to be case sensitive
     * @param [selectedLayers = false] - Set to true to cache only selected layers.
     * @param [comp = DuAEProject.getActiveComp()] - The comp with expressions to cache.
     */
    function replaceInExpressions(oldString: string, newString: string, caseSensitive?: boolean, selectedLayers?: boolean, comp?: CompItem): void;
    /**
     * Replace all <code>thisComp</code> occurences by <code>comp("name")</code>.
     * @param [selectionMode = DuAE.ACTIVE_COMPOSITION] - The comp(s)/layers/properties to use.
     */
    function removeThisCompInExpressions(selectionMode?: DuAE.SelectionMode): void;
    /**
     * Replace all <code>comp("name")</code> occurences by <code>thisComp</code>.
     * @param [selectionMode = DuAE.ACTIVE_COMPOSITION] - The comp(s)/layers/properties to use.
     */
    function removeCompInExpressions(selectionMode?: DuAE.SelectionMode): void;
    /**
     * Replace all <code>thisLayer</code> occurences by <code>layer("name")</code>.
     * @param [selectionMode = DuAE.ACTIVE_COMPOSITION] - The comp(s)/layers/properties to use.
     */
    function removeThisLayerInExpressions(selectionMode?: DuAE.SelectionMode): void;
    /**
     * Replace all <code>comp("name")</code> occurences by <code>thisComp</code>.
     * @param [selectionMode = DuAE.ACTIVE_COMPOSITION] - The comp(s)/layers/properties to use.
     */
    function removeLayerInExpressions(selectionMode?: DuAE.SelectionMode): void;
    /**
     * Makes sure the composition has a unique name, renaming it if needed.
     * @param comp - The composition
     * @returns The new name.
     */
    function setUniqueCompName(comp: CompItem): string;
    /**
     * Makes sure all layers in the comp have unique names, renaming them if needed.
     * @param [layers = comp.layers] - The layers
     * @param [comp = DuAEProject.getActiveComp] - The composition
     */
    function setUniqueLayerNames(layers?: any[] | LayerCollection, comp?: CompItem): void;
    /**
     * Gets the After Effects selected properties in the current comp
     * @param [filter] - A filter to get only a certain type, or value type, or property name or matchName.<br />
    A function which take one PropertyBase as argument can be used to filter the properties: the Property will be returned if the function returns true.
     * @param [strict = false] - If a string filter is provided, whether to search for the exact name/matchName or if it contains the filter.
     * @param [caseSensitive = true] - If a string filter is provided, and not strict is false, does the search have to be case sensitive?
     * @returns The selected properties, an empty Array if nothing active or selected
     */
    function getSelectedProps(filter?: PropertyType | PropertyValueType | string | ((...params: any[]) => any), strict?: boolean, caseSensitive?: boolean): DuAEProperty[];
    /**
     * Gets the first selected property (which is not a group)
     * @param [comp] - The comnposition. The active composition by default.
     * @returns The selected property.
     */
    function getSelectedProperty(comp?: CompItem): DuAEProperty | null;
    /**
     * Gets the selected layers in the current comp
     * @returns The selected layers
     */
    function getSelectedLayers(): Layer[];
    /**
     * Gets the first selected layer in the After Effects current composition
     * @returns The layer or null if there's no current comp / no selected layer
     */
    function getActiveLayer(): Layer | null;
    /**
     * Runs a function on all the layers
     * @param method - The function to run on the layers, which takes a layer as its only argument.
     * @param [comp] - The comp containing the layers. Will use the current comp if not provided.
     * @param [reverse = false] - Set this to true to iterate from the end.
     */
    function doLayers(method: (...params: any[]) => any, comp?: CompItem, reverse?: boolean): void;
    /**
     * Gets the After Effects animated (with keyframes) properties in the current comp
     * @param [filter] - A filter to get only a certain type, or value type, or property name or matchName.<br />
    A function which take one PropertyBase as argument can be used to filter the properties: the Property will be returned if the function returns true.
     * @param [strict = false] - If a string filter is provided, whether to search for the exact name/matchName or if it contains the filter.
     * @param [caseSensitive = true] - If a string filter is provided, and not strict is false, does the search have to be case sensitive?
     * @param [selectedLayersOnly = false] - True to get the properties on the selected layers only
     * @param [comp = DuAEProject.getActiveComp] - The composition
     * @returns The selected properties, an empty Array if nothing active or selected
     */
    function getAnimatedProps(filter?: PropertyType | PropertyValueType | string | ((...params: any[]) => any), strict?: boolean, caseSensitive?: boolean, selectedLayersOnly?: boolean, comp?: CompItem): DuAEProperty[];
    /**
     * Deselects all properties in the current composition
     */
    function unselectProperties(): void;
    /**
     * Deselects all layers in a composition
     * @param [comp = app.project.activeItem] - The composition
     * @returns The previously selected layers.<br />
    A custom attribute, Layer.props is added on each layer object which is an array of all previously selected properties as DuAEProperty objects
     */
    function unselectLayers(comp?: CompItem): Layer[];
    /**
     * Selects the layers
     * @param layers - The layers
     */
    function selectLayers(layers: Layer[] | DuList<Layer>): void;
    /**
     * Generates a new unique name for a layer
     * @param newName - The wanted new name
     * @param [comp] - The comp
     * @param [increment = true] - true to automatically increment the new name if it already ends with a digit
     * @returns The unique name, with a new number at the end if needed.
     */
    function newUniqueLayerName(newName: string, comp?: CompItem, increment?: boolean): string;
    /**
     * Generates a new unique name for a marker for this comp
     * @param newName - The wanted new name
     * @param comp - The comp
     * @param [increment = true] - true to automatically increment the new name if it already ends with a digit
     * @returns The unique name, with a new number at the end if needed.
     */
    function newUniqueMarkerName(newName: string, comp: CompItem, increment?: boolean): string;
    /**
     * Creates a new Adjustment layer
     * @param comp - The comp
     * @returns The layer.
     */
    function addAdjustmentLayer(comp: CompItem): AVLayer;
    /**
     * Links all orphan layers in the comp to a layer
     * @param layer - The parent layer
     * @param [includeLockedLayers = false] - True to parent layers even if they are locked
     */
    function parentAllOrphans(layer: Layer, includeLockedLayers?: boolean): void;
    /**
     * Gets all precomps and parent comps of the composition
     * @param [comp = DuAEProject.getActiveComp()] - The composition
     * @param [recursive = false] - True to search to more than one level of precomposition
     * @returns The related compositons
     */
    function getRelatives(comp?: CompItem, recursive?: boolean): CompItem[];
    /**
     * Gets all the precomposition found in the comp.
     * @param [comp] - The composition. The active composition if ommitted.
     * @param [recursive = false] - True to get nested compositions
     * @returns The precompositions
     */
    function getPrecomps(comp?: CompItem, recursive?: boolean): DuList<CompItem>;
    /**
     * Recursively gets all compositions where this item is used
     * @param item - The item
     * @returns The compositions
     */
    function getParentComps(item: AVItem): CompItem[];
    /**
     * Gets all the layers with audio in the composition
     * @param comp - The composition where the audio will be searched
     * @param [audioActiveOnly = false] - If true, does not get muted layers.
     * @returns An array of AVLayer containing the audio layers
     */
    function getAudioLayers(comp: CompItem, audioActiveOnly?: boolean): AVLayer[];
    /**
     * Gets the total number of master properties used on precompositions in the comp.
     * @param [comp = DuAEProject.getActiveComp] - The composition to check
     * @returns The number of master properties
     */
    function numMasterProperties(comp?: CompItem): int;
    /**
     * Checks if all layers have a different name.
     * @example
     * var dupes = DuAEComp.checkLayerNames();
    if (dupes.length != 0) {
    for (name in dupes)
    {
        if (dupes.hasOwnProperty(name)) alert(dupes[name]); //dupes[name] is an array of Layer
    }
    }
     * @param [comp = DuAEProject.getActiveComp] - The comp to check
     * @returns The list of names used several times. Check the length attribute to know how many duplicates were found, loop through the keys to get the names. Eech key is an array containing the list of layers with that name.
     */
    function checkLayerNames(comp?: CompItem): any;
    /**
     * Creates a new "Null Shape" in the comp.
     * @param [comp = DuAEProject.getActiveComp] - The comp where to create the layer
     * @param [size = 100] - The size of the null
     * @param [layer] - A layer for the location of the null
     * @returns The null layer
     */
    function addNull(comp?: CompItem, size?: float, layer?: Layer): ShapeLayer;
    /**
     * Creates a new Adjustment layer
     * @param comp - The comp
     * @returns The layer.
     */
    function addAdjustmentLayer(comp: CompItem): AVLayer;
    /**
     * Creates a new "Solid Shape Layer" in the comp.
     * @param [color = DuColor.Color.RAINBOX_RED] - The color of the solid
     * @param [comp = DuAEProject.getActiveComp] - The comp where to create the layer
     * @returns The adjustment layer
     */
    function addSolid(color?: DuColor, comp?: CompItem): ShapeLayer;
    /**
     * Creates a new Shape Layer in the comp.
     * @param [shape = DuAEShapeLayer.Primitive.NONE] - The shape
     * @param [color = DuColor.Color.RAINBOX_RED] - The color of the shape
     * @param [comp = DuAEProject.getActiveComp] - The comp where to create the layer
     * @returns The adjustment layer
     */
    function addShape(shape?: DuAEShapeLayer.Primitive, color?: DuColor, comp?: CompItem): ShapeLayer;
    /**
     * Saves a thumbnail of the comp to a PNG file
     * @param file - The file to save the thumbnail
     * @param [maxRes = [500,500]] - The maximum resolution of the thumbnail, which will be smaller than that, but not exactly this size.
     * @param [time] - The time at which to grab the picture. If omitted, will use the current time.
     * @param [comp = DuAEProject.getActiveComp()] - The composition
     * @returns True on success, false otherwise.
     */
    function thumbnail(file: File, maxRes?: int[], time?: float, comp?: CompItem): boolean;
    /**
     * Gets the camera in the comp, in the given layers if possible.
     * @param [layers] - Some layers to find the camera first. Selected layers if omitted.
     * @returns The camera if it was found.
     */
    function camera(layers?: Layer[] | DuList<Layer>): CameraLayer | null;
    /**
     * Crops a composition
     * @param bounds - The bounds [top, left, width, height]
     * @param [comp] - The composition. The active composition by default.
     */
    function crop(bounds: float[], comp?: CompItem): void;
    /**
     * Bakes the expressions to keyframes.
     * @param [mode = DuAEExpression.BakeAlgorithm.SMART] - The algorithm to use for baking the expressions.
     * @param [frameStep = 1.0] - By default, checks one value per keyframe. A lower value increases the precision and allows for sub-frame sampling. A higher value is faster but less precise.
     * @param [comp] - The composition. The active composition by default.
     */
    function bakeExpressions(mode?: DuAEExpression.BakeAlgorithm, frameStep?: float, comp?: CompItem): void;
    /**
     * Bakes the expressions to keyframes and removes all non-renderable layers.
     * @param [mode = DuAEExpression.BakeAlgorithm.SMART] - The algorithm to use for baking the expressions.
     * @param [frameStep = 1.0] - By default, checks one value per keyframe. A lower value increases the precision and allows for sub-frame sampling. A higher value is faster but less precise.
     * @param [comp] - The composition. The active composition by default.
     */
    function bake(mode?: DuAEExpression.BakeAlgorithm, frameStep?: float, comp?: CompItem): void;
    /**
     * Updates the composition settings
     * @param settings - The settings to update.
     * @param [updatePrecomps = true] - Set to false to update only the selected/current comp
     * @param [comps] - The compositions to update. If omitted, will update either the selected items in the project or the current composition
     */
    function updateSettings(settings: any, updatePrecomps?: boolean, comps?: CompItem[]): void;
}

/**
 * After Effects layer methods
 */
declare namespace DuAELayer {
    /**
     * Checks if a string is one of the prefixes used to identify layer types in their names
     * @param prefix - The string to check
     * @returns True if the string is one of the predefined prefixes.
     */
    function isTypePrefix(prefix: string): boolean;
    /**
     * Checks if the layer is one of the types created by duaef.
     * @param layer - The layer to check
     * @param layerType - The type of layer
     */
    function isType(layer: Layer, layerType: Duik.Layer.Type): boolean;
    /**
     * Gets the type of the layer
     * @param [layer] - The layer. If omitted, will check the first selected bone of the current comp
     * @returns The type
     */
    function type(layer?: Layer): Duik.Layer.Type;
    /**
     * Sets the type of the layer
     * @param type - The type
     * @param [layers = DuAEComp.getSelectedLayers()] - The layer. If omitted, will use all selected layers in the comp
     */
    function setType(type: Duik.Layer.Type, layers?: Layer[] | LayerCollection | DuList<Layer> | Layer): void;
    /**
     * Renames a layer, appending a number if needed to keep unique names, and fixing expressions
     * @returns The new name which may be different than <code>newName</code> in case the layer has been numbered.
     */
    function rename(layer: Layer, newName: string): string;
    /**
     * Runs a function on all the layers
     * @param method - The function to run on the layers, which takes a layer as its only argument.
     * @param [undoGroupName] - The name of the undoGroup created before the execution. If not provided, there will not be any undoGroup created.
     */
    function doLayers(method: (...params: any[]) => any, undoGroupName?: string): void;
    /**
     * Generates a new unique name for an effect
     * @param newName - The wanted new name
     * @param layer - The layer
     * @param [increment = true] - true to automatically increment the new name if it already ends with a digit
     * @returns The unique name, with a new number at the end if needed.
     */
    function newUniqueEffectName(newName: string, layer: Layer, increment?: boolean): string;
    /**
     * Generates a new unique name for a marker for this layer
     * @param newName - The wanted new name
     * @param layer - The layer
     * @param [increment = true] - true to automatically increment the new name if it already ends with a digit
     * @returns The unique name, with a new number at the end if needed.
     */
    function newUniqueMarkerName(newName: string, layer: Layer, increment?: boolean): string;
    /**
     * Gets the After Effects selected properties in the layer
     * @param layer - The layer
     * @param [filter] - A filter to get only a certain type, or value type, or property name or matchName.<br />
    A function which take one PropertyBase as argument can be used to filter the properties: the Property will be returned if the function returns true.
     * @param [strict = false] - If a string filter is provided, whether to search for the exact name/matchName or if it contains the filter.
     * @param [caseSensitive = true] - If a string filter is provided, and not strict is false, does the search have to be case sensitive?
     * @returns The selected properties, an empty Array if nothing active or selected
     */
    function getSelectedProps(layer: Layer, filter?: PropertyType | PropertyValueType | string | ((...params: any[]) => any), strict?: boolean, caseSensitive?: boolean): DuAEProperty[];
    /**
     * Gets the After Effects active property (the last selected one)
     * @param layer - The layer
     * @returns The selected property, or null if there isn't any.
     */
    function getActiveProperty(layer: Layer): DuAEProperty | null;
    /**
     * Gets all animations on the layer in the whole timeline or in the time range<br />
    The first DuAEKeyframe._time will be adjusted relatively to the start of the time range (if provided) instead of the startTime of the composition.
     * @param layer - The layer.
     * @param [selected = false] - true to get only selected keyframes.
     * @param [timeRange] - The time range, an array of two time values, in seconds.
     * @returns The animation.
     */
    function getAnim(layer: Layer, selected?: boolean, timeRange?: float[]): DuAELayerAnimation;
    /**
     * Gets all animations on the layers in the whole timeline or in the time range<br />
    The first DuAEKeyframe._time will be adjusted relatively to the start of the time range (if provided) instead of the startTime of the composition.
     * @param layers - The layers.
     * @param [selected = false] - true to get only selected keyframes.
     * @param [timeRange] - The time range, an array of two time values, in seconds.
     * @returns The animations.
     */
    function getAnims(layers: Layer[] | LayerCollection, selected?: boolean, timeRange?: float[]): DuAELayerAnimation[];
    /**
     * Sets the property animation on the property
     * @param layer - The layer.
     * @param anims - The animation
     * @param [time = comp.time] - The time where to begin the animation
     * @param [ignoreName = false] - true to set the anim even if name of the property do not match the name of the animation.<br />
    This way, only the type of property (i.e. matchName) is checked.
     * @param [setExpression = false] - Set the expression on the property
     * @param [onlyKeyframes = true] - If false, the value of properties without keyframes will be set too.
     * @param [replace = false] - true to remove any existing keyframe on the properties before adding new keyframes
     * @param [propertyWhiteList] - A list of matchNames used as a white list for properties to set anims.<br />
    Can be the matchName of a propertyGroup to set all the subproperties.
     * @param [offset = false] - true to offset the current value, instead of replacing it
     * @param [reverse = false] - true to reverse the keyframes (in time)
     * @param [dontMoveAncestors = false] - When set to true, the transform (position, rotation) values for ancestor layers (the ones without parent) will be offset to 0 before applying the animation.
     * @returns true if the anim was actually set.
     */
    function setAnim(layer: Layer, anims: DuAELayerAnimation, time?: float, ignoreName?: boolean, setExpression?: boolean, onlyKeyframes?: boolean, replace?: boolean, propertyWhiteList?: string[], offset?: boolean, reverse?: boolean, dontMoveAncestors?: boolean): boolean;
    /**
     * Sets the animations on the layers.<br />
    If you need to set only on the same layers (same index, same name), use {@link DuAELayer.setAnims}.
     * @param layers - The layers.<br />
    If there are more layers than animations, the layers array will be truncated.
     * @param anims - The layer animations.<br />
    If there are more animations than layers, the animations array will be truncated.
     * @param [time = comp.time] - The time where to begin the animation
     * @param [ignoreName = false] - true to set the anim even if name of the property do not match the name animation.<br />
    This way, only the type of property (i.e. matchName) is checked.
     * @param [setExpression = false] - Set the expression on the property
     * @param [onlyKeyframes = true] - If false, the value of properties without keyframes will be set too.
     * @param [replace = false] - true to remove any existing keyframe on the properties before adding new keyframes
     * @param [whiteList] - A list of matchNames used as a white list for properties to set anims.<br />
    Can be the matchName of a propertyGroup to set all the subproperties.
     * @param [offset = false] - true to offset the current value, instead of replacing it
     * @param [reverse = false] - true to reverse the keyframes (in time)<br />
    Note: the remaining animations which are returned will already be reversed, do not set this to true again if you plan to set them later.
     */
    function setAllAnims(layers: Layer[] | LayerCollection, anims: DuAELayerAnimation[], time?: float, ignoreName?: boolean, setExpression?: boolean, onlyKeyframes?: boolean, replace?: boolean, whiteList?: string[], offset?: boolean, reverse?: boolean): void;
    /**
     * Sets the animations on the corresponding layers.<br />
    The animation will be set only on layers with the same name and index.<br />
    To set all animations on all layers, not checking their names or indices, use {@link DuAELayer.setAllAnims}.
     * @param layers - The layers.
     * @param anims - The layer animations
     * @param [time = comp.time] - The time where to begin the animation
     * @param [ignoreName = false] - true to set the anim even if name of the property do not match the name animation.<br />
    This way, only the type of property (i.e. matchName) is checked.
     * @param [setExpression = false] - Set the expression on the property
     * @param [onlyKeyframes = true] - If false, the value of properties without keyframes will be set too.
     * @param [replace = false] - true to remove any existing keyframe on the properties before adding new keyframes
     * @param [whiteList] - A list of matchNames used as a white list for properties to set anims.<br />
    Can be the matchName of a propertyGroup to set all the subproperties.
     * @param [offset = false] - true to offset the current value, instead of replacing it
     * @param [reverse = false] - true to reverse the keyframes (in time)<br />
    Note: the remaining animations which are returned will already be reversed, do not set this to true again if you plan to set them later.
     * @param [dontMoveAncestors = false] - When set to true, the transform (position, rotation) values for ancestor layers (the ones without parent) will be offset to 0 before applying the animation.
     * @returns The animations which were not set (no corresponding layers)
     */
    function setAnims(layers: Layer[] | LayerCollection, anims: DuAELayerAnimation[], time?: float, ignoreName?: boolean, setExpression?: boolean, onlyKeyframes?: boolean, replace?: boolean, whiteList?: string[], offset?: boolean, reverse?: boolean, dontMoveAncestors?: boolean): DuAELayerAnimation[];
    /**
     * Reverses the times of the keyframes to reverse the animation
     * @param anims - The animation
     */
    function reverseAnims(anims: DuAELayerAnimation[] | DuAELayerAnimation): void;
    /**
     * Gets the children of a layer
     * @param layer - The layer.
     * @returns All the children of the layer
     */
    function getChildren(layer: Layer): Layer[];
    /**
     * Checks if a layer has at least one child.
     * @param layer - The layer to test
     * @returns true if the layer has at least one child.
     */
    function hasChild(layer: Layer): boolean;
    /**
     * Checks if a layer is a descendant of another layer
     * @param layer1 - The first layer
     * @param layer2 - The second layer
     * @returns the degree of relation. 0 if layer1 is not a relative of layer2,<br />
    negative if layer2 is a descendant of layer1, positive if layer2 is an ancestor.<br />
    null if the two layers are not in the same composition or if they are the same layer.
     */
    function getRelation(layer1: Layer, layer2: Layer): int | null;
    /**
     * Measures the distance between two layers
     * @param [layer1] - The first layer. If omitted, will use the selected layers in the current comp
     * @param [layer2] - The second layer
     * @returns The distance (in pixels). -1 if less than two layers are found
     */
    function getDistance(layer1?: Layer, layer2?: Layer): float;
    /**
     * Gets the maximum distance between a bunch of layers
     * @param layers - The layers
     * @returns The distance (in pixels)
     */
    function getMaxDistance(layers: Layer[] | DuList<Layer> | LayerCollection): float;
    /**
     * Gets the world coordinates of the point of a layer
     * @param layer - The layer
     * @param [point = layer.transform.anchorPoint.value] - the point
     * @param [time] - the time at which to get the coordinates. Current time by default.
     * @returns The world coordinates of the layer
     */
    function getWorldPos(layer: Layer, point?: float[], time?: float): float[];
    /**
     * Adds an animation preset on the layer.<br />
    Be careful as layer selection will be kept but not properties selection,<br />
    and this can result in an "invalid object" if referencing a property.
     * @param layer - The layer
     * @param preset - The preset file
     * @param matchName - The pseudo Effect matchName
     * @returns The effect corresponding matchName or null if anything went wrong
     */
    function applyPreset(layer: Layer, preset: File, matchName: string): PropertyGroup | null;
    /**
     * This method is a workaround to AE API method layer.applyPreset to work like addProperty when adding pseudoEffects
     * @param layer - The layer
     * @param preset - The preset file
     * @param matchName - The pseudo Effect matchName.
     * @param [name] - The name to set on the effect
     * @returns The effect or null if anything went wrong
     */
    function addPseudoEffect(layer: Layer, preset: File, matchName: string, name?: string): PropertyGroup | null;
    /**
     * Checks if the layers have some selected keyframes
     * @param layers - The layers
     * @returns true if the layers have at least one selected keyframe
     */
    function haveSelectedKeys(layers: Layer[] | LayerCollection): boolean;
    /**
     * Gets the time of the first keyFrame
     * @param layer - The layer
     * @param selected - true to check selected keyframes only
     * @returns The keyframe time or null if there are no keyframe
     */
    function firstKeyFrameTime(layer: Layer[] | LayerCollection, selected: boolean): float | null;
    /**
     * Sort the layers by their parenting (root at first index 0)
    Layers with a parent outside of the list are at the beginning, followed by layers without parent
    Note that the order of these layers is reversed
     * @param layers - The layers to sort
     * @returns The sorted array
     */
    function sortByParent(layers: Layer[] | Collection | DuList<Layer>): Layer[];
    /**
     * Sort the layers by their indices. Returns a new Array, the original array or collection is not changed.
     * @param layers - The layers to sort
     * @returns The sorted array
     */
    function sortByIndex(layers: Layer[] | LayerCollection | DuList<Layer>): Layer[];
    /**
     * Parents all the layers together beginning by the end of the array
     * @param layers - The layers to parent
     */
    function parentChain(layers: Layer[] | DuList<Layer>): void;
    /**
     * Un-parents all the layers
     * @param layers - The layers
     */
    function unparent(layers: Layer[]): void;
    /**
     * (Un)parent the children of the layer.< br/>
    When children are unparented, an effect is added and the name of the layer is changed to show the "edit mode" is enabled.<br />
    When toggled again, the effect is removed, and the name is restored.
     * @param layer - The layer to toggle.
     */
    function toggleEditMode(layer: Layer): void;
    /**
     * Creates a sequence with the layers, but using opacities.
    This enables more possibilities to rig them, like with the Duik Connector
     * @param [layers] - The layers. The selected layers by default.
     * @param [expr] - An expression to add to the opacity of the layers
     */
    function sequence(layers?: Layer[] | LayerCollection, expr?: string): void;
    /**
     * Adds a new Null object just above a layer, at the same position.<br />
    This is a convenience function calling {@link DuAEComp.addNull}.
     * @param layer - The layer
     * @returns the null
     */
    function addNull(layer: Layer): Layer;
    /**
     * Locks the scale with an expression so its value cannot be changed
     * @param layer - The layer
     */
    function lockScale(layer: Layer): void;
    /**
     * Copies the layers to another comp
     * @param layers - The layers to copy and paste
     * @param destinationComp - The composition to copy to
     * @param [withPropertyLinks = false] - Add expressions on the properties to link them to the orriginal layers<br />
    Works only on 12.0 and above, ignored on 11.0 (CS6) and below
     * @returns The new layers
     */
    function copyToComp(layers: Layer[], destinationComp: CompItem, withPropertyLinks?: boolean): Layer[];
    /**
     * Parents all (unparented) layers
     * @param layers - The layers to parent
     * @param [parent] - The parent. If not defined, will use the last layer of the list
     * @param [unparentedOnly = true] - True to parent only layers which do not have a parent yet
     * @param [insert = false] - When true, the parent will be parented to the previous parent of the given layer (or first layer if the layers param is a list)
     */
    function parent(layers: Layer | LayerCollection | Layer[] | DuList<Layer>, parent?: Layer, unparentedOnly?: boolean, insert?: boolean): void;
    /**
     * Gets all the (selected) puppet pins found on the layer.<br />
    Will return all puppet pins if there is no puppet selection.
     * @param layer - The layer
     * @returns The properties
     */
    function getPuppetPins(layer: Layer): DuAEProperty[];
    /**
     * Aligns a layer in position to another layer
     * @param layer - The layer to align.
     * @param target - The reference layer.
     */
    function alignPosition(layer: Layer, target: Layer): void;
    /**
     * Aligns a layer's orientation to another layer
     * @param layer - The layer to align.
     * @param target - The reference layer.
     */
    function alignOrientation(layer: Layer, target: Layer): void;
    /**
     * Aligns a layer's scale to another layer
     * @param layer - The layer to align.
     * @param target - The reference layer.
     */
    function alignScale(layer: Layer, target: Layer): void;
    /**
     * Aligns a layer's opcaity to another layer
     * @param layer - The layer to align.
     * @param target - The reference layer.
     */
    function alignOpacity(layer: Layer, target: Layer): void;
    /**
     * Aligns the layers' transformations (position, rotation, scale) to another layer
     * @param layers - The layers to align.
     * @param target - The reference layer.
     * @param [position = true] - True to align position.
     * @param [rotation = true] - True to align orientation.
     * @param [scale = true] - True to align scale.
     * @param [opacity = false] - True to align opcacity.
     */
    function align(layers: Layer[] | LayerCollection, target: Layer, position?: boolean, rotation?: boolean, scale?: boolean, opacity?: boolean): void;
    /**
     * Gets the transformation matrix of the layer from the compostion.<br />
    Use Matrix.applyToPoint(point) to transform any coordinate with the matrix returned by this method.
     * @param layer - the layer
     * @param [time] - the time at which to get the coordinates. Current time by default.
     * @returns The coordinates.
     */
    function getTransformMatrix(layer: Layer[], time?: float): Matrix;
    /**
     * Moves a layer to the coordinates of a spatial property
     * @param layer - The layer
     * @param prop - The property
     */
    function moveLayerToProperty(layer: Layer, prop: Property | DuAEProperty): void;
    /**
     * Sets the In and Out points of a layer according to its opacity (cuts at 0%)
     * @param layer - The layer
     * @param [preExpression = false] - Whether to check for the opacity post or pre-expression value
     */
    function autoDuration(layer: Layer, preExpression?: boolean): void;
    /**
     * Checks if a layer is 3D (ie is a threeDLayer or a camera or a light)
     * @param layer - The layer
     * @returns true if the layer is a 3D layer
     */
    function isThreeD(layer: Layer): boolean;
    /**
     * Gets an expression linking to the layer
     * @param layer - The layer
     * @param [useThisComp = false] - Whether to begin the expression by 'thisComp' or 'comp("name")'
     * @returns The expression link to the layer
     */
    function expressionLink(layer: Layer, useThisComp?: boolean): str;
    /**
     * Checks if the given layer is a solid.
     * @param layer - The layer to test
     * @returns true if it is a solid
     */
    function isSolid(layer: Layer): boolean;
    /**
     * Checks if the given layer is a precomposition.
     * @param layer - The layer to test
     * @returns true if it is a composition
     */
    function isComp(layer: Layer): boolean;
    /**
     * Checks if the layer is inside the bounds of the composition
     * @param layer - the layer to check
     * @param [useBounds = false] - (not implemented yet) Checks the layer bounds if true, just the anchor point if false.
     * @returns true if the layer is inside the composition
     */
    function insideComp(layer: Layer, useBounds?: boolean): boolean;
    /**
     * Moves a layer in the center of the comp if it is outside
     * @param layer - the layer to check
     * @param [useBounds = false] - (not implemented yet) Checks the layer bounds if true, just the anchor point if false.
     */
    function moveInsideComp(layer: Layer, useBounds?: boolean): void;
    /**
     * Gets the last corresponding effect (instead of the first with the native layer.effect() method)
     * @param layer - The layer
     * @param [name] - The name or matchname to look for. If omitted, will return the last effect.
     * @param [skip = 0] - Number of effects to skip
     * @returns The effect or null if not found.
     */
    function lastEffect(layer: Layer, name?: string, skip?: int): PropertyGroup | null;
    /**
     * Changes the coordinates of the anchor point without moving the layer
     * @param layer - The layer
     * @param value - The new coordinates
     */
    function repositionAnchorPoint(layer: Layer, value: float[]): void;
    /**
     * Returns the bounds of the layer in local coordinates, like the sourceRectAtTime() function does in expressions, but can also include masks.
     * @param layer - The layer
     * @param [time] - The time at which to get the bounds, the current time by default
     * @param [includeExtents = true] - Includes the extents (strokes, accents...)
     * @param [includeMasks = true] - Includes the masks
     * @returns The bounds [top, left, width, height]
     */
    function sourceRect(layer: Layer, time?: float, includeExtents?: boolean, includeMasks?: boolean): float[];
    /**
     * Gets or create a layer control effect targetting the given target layer.
     * @param layer - The layer to get the effect from
     * @param targetLayer - The targetted layer, which must be in the same comp than the layer.
     * @param [effectName] - The name to use when creating the effect.
     * @returns The effect or null if the two layers are not in the same comp.
     */
    function getCreateLayerEffect(layer: Layer, targetLayer: Layer, effectName?: string): DuAEProperty | null;
    /**
     * Creates a new locator linked to the layer
     * @param [layerOrComp] - The layer or the containing comp
     * @returns The locator
     */
    function createLocator(layerOrComp?: Layer | CompItem): ShapeLayer;
    /**
     * Checks if a layer is renderable. A non-renderable layer can be:<br />
    <ul>
    <li>A Null layer</li>
    <li>A Guide layer</li>
    <li>An empty shape layer</li>
    <li>An empty text layer</li>
    <li>A layer with the opacity at 0% for the whole composition</li>
    </ul>
     */
    function isRenderable(): boolean;
    /**
     * Bakes the expressions to keyframes and removes all non-renderable layers.
     * @param layer - The layer to bake.
     * @param [mode = DuAEExpression.BakeAlgorithm.SMART] - The algorithm to use for baking the expressions.
     * @param [frameStep = 1.0] - By default, checks one value per keyframe. A lower value increases the precision and allows for sub-frame sampling. A higher value is faster but less precise.
     */
    function bake(layer: Layer, mode?: DuAEExpression.BakeAlgorithm, frameStep?: float): void;
    /**
     * Gets the actual width of a layer (including it's scale)
     * @param layer - The layer
     * @returns The width, in pixels.
     */
    function width(layer: AVLayer): number;
    /**
     * Gets the actual height of a layer (including it's scale)
     * @param layer - The layer
     * @returns The height, in pixels.
     */
    function height(layer: AVLayer): number;
    /**
     * Stacks the layers in the timeline according to their order in the given array/DuList
     * @param layers - The layers to stack
     */
    function stack(layers: LayerCollection | Layer[] | DuList<Layer>): void;
    /**
     * Sets the new coordinates of the layer to translate it by offset.
     * @param layer - The layer to move
     * @param offset - The value of the translation. A two or three dimensionnal array.
     * @param [world = false] - Set to true to offset in world coordinates.
     */
    function translate(layer: Layer, offset: float[], world?: boolean): void;
    /**
     * Sets the new coordinates of the layer.
     * @param layer - The layer to move
     * @param position - The new coordinates
     * @param [world = false] - Set to true to use world coordinates.
     */
    function setPosition(layer: Layer, position: float[], world?: boolean): void;
    /**
     * Checks if the layer has some keyframes
     * @param layer - The layer
     */
    function hasKeys(layer: Layer): boolean;
    /**
     * Checks if the layer has some expressions
     * @param layer - The layer
     */
    function hasExpressions(layer: Layer): boolean;
    /**
     * Checks if the layer has some masks
     * @param layer - The layer
     */
    function hasMask(layer: Layer): boolean;
    /**
     * Checks if this is a null layer, either a true AE Null layer,
    or a "Shape as Null" as created by DuAEF with {@link DuAEComp.addNull}.
     * @param layer - The layer to test
     */
    function isNull(layer: Layer): boolean;
    /**
     * Finds the angle formed by three layers
     * @param angleLayer - The layer at which to measure the angle
     * @param oppositeLayerA - One of the opposite layers
     * @param oppositeLayerB - The other opposite layer
     * @returns The angle in degrees.
     */
    function angleFromLayers(angleLayer: Layer, oppositeLayerA: Layer, oppositeLayerB: Layer): float;
    /**
     * Returns the location of the layer relative to the reference.
     * @param point - The layer to check
     * @param referenceLayer - The reference
     * @returns The location
     */
    function relativeLocation(point: Layer, referenceLayer: Layer): DuMath.Location;
}

/**
 * Puppet tool methods
 */
declare namespace DuAEPuppet {
    /**
     * Checks if a pin can be rigged or not.\nFor now, the only pins which can not be rigged are starch pins.
     * @param pin - The pin to test
     * @returns True if this pin has either a position, rotation or scale property
     */
    function riggable(pin: PropertyGroup): boolean;
}

/**
 * Render Queue methods
 */
declare namespace DuAERenderQueue {
    /**
     * Checks if the given template is installed
     * @param templateName - The name of the template
     * @returns true if the template is available
     */
    function hasRenderSettingsTemplate(templateName: string): boolean;
    /**
     * Checks if the given template is installed
     * @param templateName - The name of the template
     * @returns true if the template is available
     */
    function hasOutputModuleTemplate(templateName: string): boolean;
}

/**
 * Shape Layer methods
 */
declare namespace DuAEShapeLayer {
    /**
     * A List of primitive shapes
     */
    enum Primitive {
        NONE = 0,
        CIRCLE = 1,
        SQUARE = 2,
        ROUNDED_SQUARE = 3,
        POLYGON = 4,
        STAR = 5
    }
    /**
     * Gets the transformation matrix for all the parent groups of a given property
     * @param prop - The property
     * @returns The transformation matrix.
     */
    function getTransformMatrix(prop: Property | DuAEProperty): Matrix;
    /**
     * Checks if this shape layers contains only one shape, one fill, and one stroke,\n
    just like After Effects creates them at first.
     * @param layer - The layer to test
     * @returns True if the layer is a shape layer containing only one shape, one fill, and one stroke in a group. False otherwise.
     */
    function isSingleShape(layer: Layer): boolean;
    /**
     * Gets the content of a specific group in the shape layer
     * @param layer - The layer
     * @param path - The path, using group names. e.g. <code>'Group 1/Subgroup'</code>
     * @returns The contents of the vector group, or null if it can't be found.
     */
    function getVectorGroupContents(layer: ShapeLayer, path: string): PropertyGroup | null;
    /**
     * Gets the transform of a specific group in the shape layer
     * @param layer - The layer
     * @param path - The path, using group names. e.g. <code>'Group 1/Subgroup'</code>
     * @returns The contents of the vector group, or null if it can't be found.
     */
    function getVectorGroupTransform(layer: ShapeLayer, path: string): PropertyGroup | null;
}

/**
 * Constructs a Pseudo Effect.
 * @param binaryFile - The ffx file encoded as a {@link DuBinary}.<br />
Note that the pseudo effect's matchName <strong>must start with <code>"Pseudo/"</code></strong>.
 */
declare class DuAEPseudoEffect {
    constructor(binaryFile: DuBinary);
    /**
     * Will be false if the ffx can't be correctly parsed.<br />
    Note that an invalid pseudo effect can still be applied (if the file exists), but the new effect may not be returned,<br />
    or the {@link DuAEPseudoEffect.index} Object may be empty.
     */
    static readonly valid: boolean;
    /**
     * The matchName
     */
    static readonly matchName: string;
    /**
     * The default (localized) name
     */
    static readonly name: string;
    /**
     * An object containing information about the properties of the effect, which can be used to generate expressions.<br />
    Access properties with their names, using the group hierarchy.<br />
    The info available for each property depends on the original pseudo effect, but there's at least the type and the index of the property.
     * @example
     * var pseudoEffect = new DuAEPseudoEffect( pseudoEffectBin );
    var propIndex = pseudoEffect.props["groupName"]["PropertyName"].index;
    var effect = pseudoEffect.apply( aLayer );
    var expression = 'thisLayer.effect("' + pseudoEffect.name + '")(' + propIndex + ');';
     */
    static readonly props: any;
    /**
     * The ffx file
     */
    static readonly file: File;
    /**
     * This method adds the pseudo effect to a layer
     * @param layer - The layer
     * @param [name = this.name] - A name for the effect
     * @returns The effect. May be null if the pseudo effect was not parsed correctly
     */
    apply(layer: Layer, name?: string): PropertyGroup | null;
}

/**
 * <h3>Sanity tests for After Effects</h3>
<p>DuSan requires <i>DuAEF</i>, the <i>Duduf After Effects Framework</i>. Two builds of the <i>DuSan API</i> are available:<br />
<ul><li><code>DuSan_api.jsxinc</code> does not include <i>DuAEF</i>, and can be used to compine multiple <i>Duduf APIs</i> with a single copy of <i>DuAEF</i>.<br />
Be careful to grab the right version of <i>DuAEF</i> in this case.</li>
<li><code>DuAEF_DuSan_api.jsxinc</code> includes all dependencies, with <i>DuAEF</i>, and is easier to include in your scripts.</li></ul></p>
 */
declare namespace DuSanity {
    /**
     * The sanity levels.
     */
    enum Level {
        UNKNOWN = -1,
        OK = 0,
        INFO = 1,
        WARNING = 2,
        DANGER = 3,
        CRITICAL = 4,
        FATAL = 5
    }
    /**
     * The current sanity level
     */
    const currentLevel: DuSanity.Level;
    /**
     * Fixes the issues for the given test, if possible
     * @param test - The test to fix
     * @returns The level after the fix
     */
    function fix(test: DuSanity.Test): DuSanity.Level;
    /**
     * Checks if the the live fix is enabled for the given test
     * @param test - The test
     * @returns True if the test live fix is enabled
     */
    function isLiveFixEnabled(test: DuSanity.Test): boolean;
    /**
     * Enables or disables the live fix for the given test
     * @param test - The test
     */
    function setLiveFixEnabled(test: DuSanity.Test, enabled?: boolean): void;
    /**
     * Checks if the fiven test needs a fix
     * @param test - The test to fix
     * @returns True if the test needs a fix
     */
    function needsFix(test: DuSanity.Test): boolean;
    /**
     * Checks if the fiven test is enabled for the current project
     * @param test - The test
     * @returns True if the test is enabled for the current project
     */
    function isProjectEnabled(test: DuSanity.Test): boolean;
    /**
     * Checks if the fiven test is globally enabled
     * @param test - The test
     * @returns True if the test is enabled
     */
    function isGloballyEnabled(test: DuSanity.Test): boolean;
    /**
     * Globally enables or disables the test
     * @param test - The test
     */
    function setGloballyEnabled(test: DuSanity.Test, enabled?: boolean): void;
    /**
     * Checks if a Sanity Test is enabled
     * @param test - The test
     */
    function isEnabled(test: DuSanity.Test): boolean;
    /**
     * Enables or disables the test
     * @param test - The test
     */
    function setEnabled(test: DuSanity.Test, enabled?: boolean): void;
    /**
     * Enables or disables the test for the current project only
     * @param test - The test
     */
    function setProjectEnabled(test: DuSanity.Test, enabled?: boolean): void;
    /**
     * Sets the timeout for the test
     * @param test - The test
     * @param timeOut - The time out in milliseconds.
     */
    function setTimeOut(test: DuSanity.Test, timeOut: int): void;
    /**
     * Runs a test
     * @param [dontFix = false] - If false, will automatically fix the issue.
     * @param [force = false] - To improve performance, the test may be automatically paused. Set this to true to force it to run if calling this method.
     * @returns The level of the result of the test.
     */
    function runTest(dontFix?: boolean, force?: boolean): DuSanity.Level;
    /**
     * All the available tests.
     */
    namespace Test {
        /**
         * Checks if some compositions share the same name.
         * @param [dontFix = false] - If false, will automatically fix the issue.
         * @param [force = false] - To improve performance, this test may be automatically paused. Set this to true to force it to run if calling this method.
         */
        function compNames(dontFix?: boolean, force?: boolean): void;
        /**
         * Checks if some layers share the same name in the current comp.
         * @param [dontFix = false] - If false, will automatically fix the issue.
         */
        function layerNames(dontFix?: boolean): void;
        /**
         * Checks the expression engine.
         * @param [dontFix = false] - If false, will automatically fix the issue.
         */
        function expressionEngine(dontFix?: boolean): void;
        /**
         * Checks the project size
         * @param [dontFix = false] - If false, will automatically fix the issue.
         */
        function projectSize(dontFix?: boolean): void;
        /**
         * Checks the project size
         * @param [dontFix = false] - If false, will automatically fix the issue.
         */
        function projectItems(dontFix?: boolean): void;
        /**
         * Checks if some items have the same source file
         * @param [dontFix = false] - If false, will automatically fix the issue.
         * @param [force = false] - To improve performance, this test may be automatically paused. Set this to true to force it to run if calling this method.
         */
        function itemSources(dontFix?: boolean, force?: boolean): void;
        /**
         * Checks if some items (footages) are not used
         * @param [dontFix = false] - If false, will automatically fix the issue.
         */
        function unusedItems(dontFix?: boolean): void;
        /**
         * Checks if some precomps are in the root of the project
         * @param [dontFix = false] - If false, will automatically fix the issue.
         */
        function precomps(dontFix?: boolean): void;
        /**
         * Checks if there are multiple comps in the root of the project
         * @param [dontFix = false] - If false, will automatically fix the issue.
         */
        function unusedComps(dontFix?: boolean): void;
        /**
         * Checks the memory in use
         * @param [dontFix = false] - If false, will automatically fix the issue.
         */
        function memory(dontFix?: boolean): void;
        /**
         * Checks the number of essential properties in the current comp
         * @param [dontFix = false] - If false, will automatically fix the issue.
         */
        function essentialProperties(dontFix?: boolean): void;
        /**
         * Checks the elapsed time since last save
         * @param [dontFix = false] - If false, will automatically fix the issue.
         */
        function save(dontFix?: boolean): void;
        /**
         * Checks the up time of After Effects
         * @param [dontFix = false] - If false, will automatically fix the issue.
         */
        function upTime(dontFix?: boolean): void;
    }
    /**
     * UI tools to show sanity levels and settings
     */
    namespace UI {
        /**
         * Creates an icon to show the current sanity level
         * @param container - A ScriptUI group where to add the icon
         * @param [addLabel = true] - Adds a label next to the icon
         * @param [autoUpdate = true] - If true, the icon will be automatically updated according to the current sanity level. Otherwise, call setLevel to change the level.
         * @returns The ScriptUI Group containing the icon and its label
         */
        function icon(container: Group, addLabel?: boolean, autoUpdate?: boolean): Group;
        /**
         * Creates a button to show the current sanity level
         * @param container - A ScriptUI group where to add the button
         * @param [addLabel = true] - Adds a label next to the icon
         * @param [autoUpdate = true] - If true, the button will be automatically updated according to the current sanity level. Otherwise, call setLevel to change the level.
         * @returns The DuButton
         */
        function button(container: Group, addLabel?: boolean, autoUpdate?: boolean): DuButton;
        /**
         * Creates a panel showing all tests and current status
         * @param container - The ScriptUI Group containing the DuSanity panel
         * @returns The panel
         */
        function panel(container: Group): Group;
        /**
         * Adds the UI to display a test in the UI
         * @param container - A ScriptUI group where to add the test report
         * @param test - The test to show
         * @returns The ScriptUI Group containing the test report
         */
        function test(container: Group, test: DuSanity.Test): Group;
    }
    /**
     * Runs all sanity tests
     * @param [force = false] - Force running all tests even if they've not timed out yet.
     */
    function run(force?: boolean): void;
    /**
     * This function must be called once when everything in the script is ready and after {@link DuAEF.init}
     */
    function init(): void;
}

