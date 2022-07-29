import json

# Load JSON file
jsonPath = "inc/tr/Duik_zh.json"
poPath = "translation/Duik_zh.po"

poStr = ""

with open(jsonPath, "r", encoding="utf8") as jsonFile:
    jsonDoc = json.load(jsonFile)

msgs = jsonDoc["Duik"][1]["translations"]

for msg in msgs:
    comment =  msg["comment"]
    context =  msg["context"]
    msgid =  msg["source"]
    msgstr =  msg["translation"]

    if msgstr == msgid:
        msgstr = ""

    if comment.strip() == "NEW":
        comment = ""

    if comment != "":
        poStr += "# " + comment + "\n"

    poStr += "#, qt-format\n"

    if context != "":
        poStr += "msgctxt \"" + context + "\"\n"

    poStr += "msgid \"" + msgid.replace("{#}", "%1").replace('"','\\"').replace("\n",'\\n"\n"') + "\"\n"
    poStr += "msgstr \"" + msgstr.replace("{#}", "%1").replace('"','\\"').replace("\n",'\\n"\n"') + "\"\n\n"
    
with open(poPath, "w", encoding="utf8") as poFile:
    poFile.write(poStr)