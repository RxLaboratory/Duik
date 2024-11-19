import subprocess
import os
from .environment import Environment

E = Environment.instance()

def build():
    if 'src' not in E.ENV:
        raise ValueError("src not set in Environment file.")
    
    print("> Building Docs...")
    
    docs_path = E.ENV['src'].get('docs_path',"src-docs")
    if not os.path.isabs(docs_path):
        docs_path = os.path.join(
            E.REPO_DIR,
            docs_path
        )
    if not os.path.isdir(docs_path):
        print(">> Nothing to build!")
        return
    
    mkdocs_process = subprocess.Popen( ("mkdocs", "build"), cwd=docs_path)
    mkdocs_process.communicate()

    print(">> Docs built!")