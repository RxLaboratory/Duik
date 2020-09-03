# Translating Duik

Duik uses *DuTF - The Duduf Translation Framework* to translate all its user interface into many languages. Our goal is to make Duik available in as many languages as users are using, plus [Esperanto]()https://en.wikipedia.org/wiki/Esperanto. If you speak a language which is not yet available in Duik, do not hesitate to help translating Duik into it, it's easy and you don't need to be a developer!

## Status

### Currently, Duik is available in

- [x] Deutsch
- [x] English
- [x] Español
- [x] Esperanto
- [x] Français
- [x] 中文

But we always need translators in these languages to update the translations when there are new versions.

### Work in progress

We're also working on these translations

- [ ] Picard (ch'ti)
- [ ] Italiano
- [ ] Nederlands
- [ ] русский

Help is always welcome to finish these translations.

### Looking for new translators

We would also like to find someone willing to start the translations for other languages from countries where we know Duik is used a lot

- Português
- 日本語
- 한국어

### Other languages

Of course, it would be nice to have Duik in any and all other languages!

## How to translate Duik

### 1. Submit your information

Help us coordinate the translation effort by submitting your contact info and the language you'd like to translate to, using [this form](https://rainboxlab.org/documentation/translate-the-tools/)! Thanks a lot.

### 2. Join our Discord Server

It's best to [join us on our *Discord* server](http://chat.rainboxlab.org/) so that you can chat with other people translating, and help each other and coordinate your efforts if there are several of you working on the same translation.

### 3. Download *DuTranslator*

*DuTranslator* is the application used by *DuTF - The Duduf Translation Framework* to help non-developers contribute with their translations. It's very easy to use, and comes with a [comprehensive documentation available here](http://dutranslator-docs.rainboxlab.org).

### 4. Install the latest version of Duik

Make sure you have installed [the latest version of Duik](https://rainboxlab.org/download-duik-bassel/) before starting your work.

### 5. Edit the translation file, or create a new one

#### 5.A. Edit an existing translation

If you plan to update an existing translation, you'll just have to edit the corresponding translation file with *DuTranslator*. The translation files are available in your *Documents* folder, in a *Duik Bassel* subfolder. There is one *.json* file for each language, which you can recognise with its [language code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes).

#### 5.B. Create a new translation

If you're starting a translation to a new language, grab [the empty template here](https://github.com/Rainbox-dev/DuAEF_Duik/blob/master/src/duik_required/translation/Duik%20Bassel_new.json) (click on the "raw" button, then save the page [Ctrl+S]).

Open it in *DuTranslator* and don't forget to add the language code and native language name in the upper right part of *DuTranslator*, then save the file with the name *Duik Bassel_xx.json* where *xx* is your language code.

To use *Duik* with your new translation, just save it in the *Duik Bassel* subfolder of your *Documents* folder, next to the other translations, and restart *Duik*. The new language will be available in the language selector of the settings panel.

### 6. Submit your translation

If you know how *git* and *github* works, submit a pull request with your modifications or the new file. Translations are stored [here](https://github.com/Rainbox-dev/DuAEF_Duik/tree/master/src/duik_required/translation).

If you don't know what *git* is, don't worry, just send us your translation file via our [Discord server](http://chat.rainboxlab.org/) or through a [new issue here](https://github.com/Rainbox-dev/DuAEF_Duik/issues/new).

Thank you very much for your contribution!
