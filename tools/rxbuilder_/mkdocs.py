"""mkddocs tools"""

import subprocess

def build(path:str):
    mkdocs_process = subprocess.Popen( ("mkdocs", "build"), cwd=path)
    mkdocs_process.communicate()
