#!/usr/bin/python

# Conver a jsxinx duik translation file to json dutranslator format
# see https://github.com/Rainbox-dev/Dutranslator/issues/23

# use example :
# python jsxTrToJson.py Duik_translations_fr.jsxinc fr_FR Français
# will output json translations to Duik_translations_fr.json

import sys
import json
import os


if __name__ == '__main__':

    if len(sys.argv) != 4:
        print("USAGE: python {} jsxincFile\
 languageId languageName".format(sys.argv[0]))
        sys.exit(1)

    # Real job starts here
    jsFile = open(sys.argv[1], "r")

    lines = jsFile.readlines()

    jsFile.close()


    jsonRes = {}
    jsonRes["duik"] = {}
    jsonDuik = jsonRes["duik"]  # shortcut

    jsonDuik["version"] = "1.0"
    jsonDuik["languageId"] = sys.argv[2]
    jsonDuik["languageName"] = sys.argv[3]
    jsonDuik["translations"] = []
    jsonTrs = jsonDuik["translations"]  # shortcut

    # Lines parsing
    index = 0
    for line in lines:
        index += 1
        if (not line.startswith("DutranslatorArray.push([") or
            not line.endswith("]);\n")):
            print("{} - Line ignored: {}".format(index, line))
        else:
            eline = line[23:]  # remove first 23 characters
            eline = eline[:-3]  # remove last 3 charcaters
            try:
                lineData = json.loads(eline)
                source = lineData[0]
                ctxId = lineData[1]
                trans = lineData[2]
                jsonLine = {}
                jsonLine["source"] = source
                jsonLine["translation"] = trans
                jsonLine["context"] = ""
                jsonLine["contextId"] = ctxId
                jsonLine["comment"] = ""
                jsonTrs.append(jsonLine)
            except json.decoder.JSONDecodeError as detail:
                print("{} - Unable to parse translation, you should add it manualy (error {}):\n{}".format(index, detail, line))


    basename = os.path.splitext(
            os.path.basename(sys.argv[1]))[0]
    dirname = os.path.dirname(sys.argv[1])

    newFileBase = os.path.join(dirname, "{}.json".format(basename))
    newFile = newFileBase

    index = 1  # Make sure that the file does not already exists
    while os.path.isfile(newFile) or os.path.isdir(newFile):
        newFile = "{}.{}".format(newFileBase, index)
        index += 1

    with open(newFile, "w") as out:
        json.dump(jsonRes, out, 
                indent=4, 
                separators=(',', ': '),
                ensure_ascii=False)

    print("File correctly converted, result is at {}.".format(newFile))


    sys.exit(0)
    # end
