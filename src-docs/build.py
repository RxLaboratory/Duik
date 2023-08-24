import os
from datetime import datetime

authors = 'Nicolas "Duduf" Dufresne'
license = 'GNU-FDL'
copyright_from = '2022'

currentDateTime = datetime.now()
date = currentDateTime.date()
copyright_to = date.strftime("%Y")

folder = os.path.dirname(os.path.abspath(__file__))
folder = os.path.join(folder, "docs")

def update_meta( path ):

    print("> Folder: " + path)

    for f in os.listdir( path ):
        subfile = os.path.join(path, f)
        if os.path.isdir(subfile):
            update_meta(subfile)
            continue
        if os.path.splitext(subfile)[1] != '.md':
            continue
    
        lines = ()
        with open(subfile, "r", encoding="UTF8") as file:
            lines = file.readlines()
        
        i = 0
        line = ""
        for line in lines:
            line = line.strip()
            if line.startswith("![META]"):
                break
            i = i+1
            line = ""

        # Get current info
        line = line.replace("![META](", "")
        line = line[:-1]
        items = line.split(";")

        the_authors = authors
        the_license = license
        the_copyright = copyright_from + "-" + copyright_to

        for item in items:
            item_list = item.split(":")
            if len(item_list) != 2:
                continue
            key = item_list[0]
            value = item_list[1]
            if key == 'authors':
                the_authors = value
            elif key == license:
                the_license = value
            elif key == 'copyright':
                value = value.split("-")
                start = value[0]
                the_copyright = start + "-" + copyright_to
        
        modified_date = datetime.fromtimestamp(
            os.path.getmtime(subfile)
            ).date()

        # Build the new string
        meta = '![META](' + ";".join([
            "authors:" + the_authors,
            "license:" + the_license,
            "copyright:" + the_copyright,
            "updated:" + modified_date.strftime("%Y-%m-%d")
            ]) + ')'
        
        print(">> " + subfile)
        print(">>> " + str(i))
        print(">>> " + str(len(lines)))
        print(">>> " + meta)

        if i >= len(lines):
            lines.append("")
            lines.append(meta)
        else:
            lines[i] = meta
        with open(subfile, "w", encoding="UTF8") as file:
            file.writelines(lines)

print("Updating metadata...")
update_meta(folder)
print("Building...")
os.chdir(folder)
os.system("mkdocs build")