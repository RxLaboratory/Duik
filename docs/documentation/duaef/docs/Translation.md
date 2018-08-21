# DuTranslator

The tools available in the Duduf After Effects Framework are translated using DuTranslator, a tool set dedicated to script translations.

To work on the translations, you will need to download the DuTranslator Application (available only on _Windows_ for now, but _Mac_ and _Linux_ versions will be available soon). **[Click here to download it](https://rainboxprod.coop/downloads/dutr/DuTranslator_WIN.zip)** and unzip all the files on your computer. Double click on `DuTranslator.exe` to launch it.

# Duik

It is very easy to contribute to the translations of Duik.

## Existing translations

The default language of Duik is English. [Available translations](https://github.com/Rainbox-dev/DuAEF_Duik/raw/master/src/tools%20(ScriptUI)/Duik/translation) are:  **Chinese** ([file](https://github.com/Rainbox-dev/DuAEF_Duik/raw/master/src/tools%20(ScriptUI)/Duik/translation/Duik%20Bassel_xh.json)),**Español** ([file](https://github.com/Rainbox-dev/DuAEF_Duik/raw/master/src/tools%20(ScriptUI)/Duik/translation/Duik%20Bassel_es.json)), **Français** ([file](https://github.com/Rainbox-dev/DuAEF_Duik/raw/master/src/tools%20(ScriptUI)/Duik/translation/Duik%20Bassel_fr.json)).

The translation which would be great to do in priority are (Brazilian) **Portuguese**, **German**, **Japanese**. This list is based on the use of Duik in the world, but if you'd like Duik in any other language, you're free to translate it to whatever you want. Esparanto would be great too!

## Translating

First, you will need to [download DuTranslator](https://rainboxprod.coop/downloads/dutr/DuTranslator_WIN.zip) (read just above).

Then, all you have to do is to open a translation file and start translating all the texts. You can either work on/from an existing translation or create a new one.

If you want to modify an existing translation, you can find the translation file in your `Documents` folder, if Duik has been launched at least once. Just open it with _DuTranslator_ and start working on the translation.

If you are creating a new translation for Duik, you can either begin with an existing one, or use [this empty file](https://github.com/Rainbox-dev/DuAEF_Duik/raw/master/src/tools%20(ScriptUI)/Duik/translation/Duik%20Bassel_new.json). Don't forget to change the _language id_ and the _language name_ in the top of DuTranslator after you have opened the file, and save it to a new name.

!!! note
    The _language id_ is a simple code consisting of two or three letters. Search in [this table](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) to find the _language id_ you need, in the 639-1 column.

!!! important
    The translation file must be named `Duik Bassel_id.json` where `id` is the _language id_ you have set in DuTranslator.

## Testing the translations

To see what your translation looks like in Duik, you just have to:

- Copy the translation file to your `Documents` folder, where the existing translations should already be.  
- Restart Duik. The new translation should be listed in the settings panel so you can select and use it.

> If you have moved the settings file of Duik in the settings panel, the translations are moved with it. You'll find them in the same folder than the settings file.

## Submitting

If you want to share your translation with the rest of the world (thanks!), just send your new or updated translation file to `contact_at_rainboxprod_dot_coop`. (replace `_at_` by `@` and `_dot_` by `.`).

You can also create a Pull Request if you know how to use Git and Github.
