import os
import shutil
import subprocess
import sys
from .environment import Environment

E = Environment.instance()

def build_dependency(build_script, repo_path):
    print(">> Building...")
    args = '"%s" "%s" "%s"' % (sys.executable,              # command
                           build_script,                     # argv[0]
                           os.path.basename(build_script))   # argv[1]
    build_process = subprocess.Popen( args, cwd=repo_path )
    build_process.communicate()

def install_types(path, name):
    types_path = os.path.join(
            E.REPO_DIR,
            'types', name.lower()
        )
    if not os.path.isdir(types_path):
        os.makedirs(types_path)
    
    for f in os.listdir(path):
        ext = f.split(".")[-1]
        if ext != "ts":
            continue

        src = os.path.join(path, f)
        if not os.path.isfile(src):
            continue

        print(">> Adding types for " + name)

        dest = os.path.join(types_path, f)
        if os.path.exists(dest):
            os.remove(dest)

        os.symlink(  src, dest )

def install_include(src_dist_path, dest_include_path):
    if not os.path.isabs(dest_include_path):
        dest_include_path = os.path.join(
            E.REPO_DIR,
            dest_include_path
        )
    if not os.path.isdir(dest_include_path):
        os.makedirs(dest_include_path)

    # subfolders first (for dependencies)
    for f in os.listdir(src_dist_path):
        # Recurse
        p = os.path.join(src_dist_path, f)
        print(">>>>>>>>>>>>>>",p)
        if os.path.isdir(p):
            install_include(
                p,
                os.path.join(dest_include_path, f)
                )

    # include files
    for f in os.listdir(src_dist_path):
        ext = f.split(".")[-1]
        if ext != "jsxinc":
            continue

        src = os.path.join(src_dist_path, f)
        if not os.path.isfile(src):
            continue

        print(">> Including " + f)

        dest = os.path.join(dest_include_path, f)
        if os.path.exists(dest):
            os.remove(dest)

        os.symlink( src, dest )

def install_dependency(dep):
    if 'name' not in dep:
            raise ValueError("Dependendy has no name.")
        
    name = dep['name']
    print("> Installing " + name)

    dep_repo_path = dep.get('repo_path', None)
    if not dep_repo_path:
        dep_repo_path = dep.get('dep_path', None)
    if not dep_repo_path:
        print("Dependency doesn't have a repo, nothing to do.")
        return

    if not os.path.isabs(dep_repo_path):
        dep_repo_path = os.path.join(
            E.REPO_DIR,
            dep_repo_path
        )

    if not os.path.exists(dep_repo_path):
        raise FileNotFoundError("Can't find the repo at " + dep_repo_path)

    # If this is a folder (a repo)
    if os.path.isdir(dep_repo_path):
        # Build the dependency if needed
        build_script = os.path.join(
            dep_repo_path,
            'tools','build_'+name.lower()+'.py'
        )
        if os.path.isfile(build_script):
            build_dependency(build_script, dep_repo_path)

        # Check if there are types to symlink
        dep_types_path = os.path.join(
            dep_repo_path,
            'types',
            name.lower()
        )

        if os.path.isdir(dep_types_path):
            install_types(dep_types_path, name)

        # Check if we're including the dist somewhere
        if 'include_path' in dep:
            dep_dist_path = os.path.join( dep_repo_path, 'dist' )
            if os.path.isdir(dep_dist_path):
                install_include(dep_dist_path, dep['include_path'])
    # If it is a file, just symlink
    else:
        dest = dep['include_path']
        if os.path.exists(dest):
            os.remove(dest)

        os.symlink( dep_repo_path, dest )

def update_dependencies():

    if 'jsx' not in E.ENV:
        raise ValueError("Environement doesn't contain JSX data.")
    
    if 'dependencies' not in E.ENV:
        return
    
    print("Installing dependencies...")
    
    for dep in E.ENV['dependencies']:
        install_dependency(dep)

    print("> Dependencies installed!")
