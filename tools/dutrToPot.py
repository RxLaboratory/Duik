import json

# Load JSON file
jsonPath = "inc/tr/Duik_fr.json"
poPath = "translation/Duik2.pot"

poStr = """#, fuzzy
msgid ""
msgstr ""
"Project-Id-Version: Duik 17.0.0"
"POT-Creation-Date: "
"PO-Revision-Date: "
"Last-Translator: "
"Language-Team: RxLaboratory <http://rxlaboratory.org>"
"MIME-Version: 1.0"
"Content-Type: text/plain; charset=UTF-8"
"Content-Transfer-Encoding: 8bit"
"X-Generator: Poedit 3.1.1"
"X-Poedit-SourceCharset: UTF-8"
"X-Poedit-KeywordsList: tr;__;_;_n:1,2;_p:1c,2;gettext;ngettext:1,2;pgettext:1c,2;dcnpgettext:2c,3,4"

"""

with open(jsonPath, "r", encoding="utf8") as jsonFile:
    jsonDoc = json.load(jsonFile)

msgs = jsonDoc["Duik"][1]["translations"]

for msg in msgs:
    comment =  msg["comment"]
    context =  msg["context"]
    msgid =  msg["source"]

    if comment.strip() == "NEW":
        comment = ""

    if comment != "":
        poStr += "# " + comment + "\n"

    poStr += "#, qt-format\n"

    if context != "":
        poStr += "msgctxt \"" + context + "\"\n"

    poStr += "msgid \"" + msgid.replace("{#}", "%1").replace('"','\\"').replace("\n",'\\n"\n"') + "\"\n"
    poStr += "msgstr \"\"\n\n"
    
with open(poPath, "w", encoding="utf8") as poFile:
    poFile.write(poStr)