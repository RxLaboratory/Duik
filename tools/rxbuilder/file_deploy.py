import os
import shutil
from .utils import get_build_path
from .environment import Environment

E = Environment.instance()

def deploy():

    print(">> Deploying additional files...")
    if not "deploy" in E.ENV:
        print(">> No other files to deploy!")
        return
    
    build_path = get_build_path()
    deploy = E.ENV['deploy']
    for d in deploy:
        src = d.get('src','')
        if src == '':
            continue
        dest = d.get('dest', '')
        if dest == '':
            continue
        if not os.path.isabs(src):
            src = os.path.join(E.REPO_DIR, src)
        if not os.path.isabs(dest):
            dest = os.path.join(build_path, dest)
        if os.path.isfile(dest):
            os.remove(dest)
        dest_dir = os.path.dirname(dest)
        if not os.path.isdir(dest_dir):
            os.makedirs(dest_dir)

        shutil.copy(src, dest)
