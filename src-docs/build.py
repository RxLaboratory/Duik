import os
from datetime import datetime

import git

authors = 'Nicolas "Duduf" Dufresne'
license = 'GNU-FDL'
copyright_from = '2022'

currentDateTime = datetime.now()
date = currentDateTime.date()
copyright_to = date.strftime("%Y")

folder = os.path.dirname(os.path.abspath(__file__))
os.chdir(folder)
repo_folder = os.path.dirname(folder)
repo = git.Repo( repo_folder )

def update_meta( repository, path='' ):

    tree = repository.tree()
    if path != '':
        path = path.split('/')
        for p in path:
            tree = tree[p]

    for blob in tree.traverse():
        subfile = blob.path
        if os.path.splitext(subfile)[1] != '.md':
            continue
        if os.path.basename(subfile).lower() == 'license.md':
            continue

        subfile = os.path.join(repo_folder, subfile)   
    
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
        
        commit = next(repository.iter_commits(paths=blob.path, max_count=1))
        modified_date = datetime.fromtimestamp(
            commit.committed_date
            ).date()

        # Build the new string
        meta = '![META](' + ";".join([
            "authors:" + the_authors,
            "license:" + the_license,
            "copyright:" + the_copyright,
            "updated:" + modified_date.strftime("%Y-%m-%d")
            ]) + ')\n'
        
        print(">> " + subfile)
        print(">>> " + meta)

        if i >= len(lines):
            lines.append("\n")
            lines.append("\n")
            lines.append(meta)
        else:
            lines[i] = meta
        with open(subfile, "w", encoding="UTF8") as file:
            file.writelines(lines)

print("Updating metadata...")
update_meta(repo, 'src-docs')
print("Building...")
#os.system("mkdocs build")