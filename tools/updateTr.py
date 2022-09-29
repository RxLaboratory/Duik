import os
import re

folder_path = "DuGR/inc"

# Load string libs
dict_paths = (
    "DuGR/inc/strings.jsxinc.txt",
    "DuGR/DuAEF/inc/duscriptui_extension.jsxinc",
    "DuGR/DuAEF/DuESF/inc/scriptui/strings_.jsxinc",
)
dictionary = {}

re_dict = re.compile('\\s*(DuScriptUI.String.[A-Z_1-9]+)\\s*=\\s*(".+")')
re_source = re.compile('(i18n\\._\\s*\\()?(\\s*)(DuScriptUI.String.[A-Z_1-9]+)')

def addToDict(file_path):
    print("> Looking for keys in " + file_path)
    with open(file_path, 'r', encoding='utf8') as file:
        content = file.read()
        for match in re_dict.findall(content):
            dictionary[match[0]] = match[1]

for dict_path in dict_paths:
    addToDict(dict_path)
        
for file_name in os.listdir(folder_path):
    if not file_name.endswith('.jsxinc'):
        continue
    if file_name == "duscriptui_extension.jsxinc":
        continue
    if file_name == "strings.jsxinc":
        continue
    file_path = folder_path + '/' + file_name
    if not os.path.isfile(file_path):
        continue

    newContent = []
    matched = False
    with open(file_path, 'r', encoding='utf8') as file:
        print("Updating: " + file_path)
        
        for line in file.readlines():
            match = re_source.search( line )
            if match:
                matched = True
                if match.group(3) not in dictionary:
                    print(">>>>> WARNING! <<<<< Can't replace: " + match.group(0))
                    print("   Not found in dictionnaries.")
                    newContent.append(line) 
                    continue

                print('-- Replacing: ' + match.group(0))
                print('   With: ' + dictionary[match.group(3)])
                if match.group(1) is None:
                    space = ' '
                    if match.group(2):
                        space = match.group(2)
                    newLine = re_source.sub( space + 'i18n._(' + dictionary[match.group(3)] + ')', line )
                    newContent.append(newLine)
            else:
                newContent.append(line) 

    if len(newContent) > 0 and matched:
        with open(file_path, 'w', encoding='utf8') as file:
            file.writelines(newContent)
            print(">> Updated: " + file_path)

