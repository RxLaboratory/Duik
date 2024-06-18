"""! @brief Build ExtendScript (JSX) files
 @file jsx_build.py
 @section authors Author(s)
  - Created by Nicolas Dufresne on 1/11/2024 .
"""

import shutil
import os
from multiprocessing import Pool
from .utils import (
    get_build_path
)
from .environment import Environment

E = Environment.instance()

def get_api_build_path():
    """!
    @brief Gets the path where the API is built
    @returns {string} The path
    """
    return os.path.join(
        get_build_path(),
        E.ENV['src'].get('project', '') + "_API"
    )

def get_jsx_build_path():
    """!
    @brief Gets the path where the scripts are built
    @returns The path
    """
    return os.path.join(
        get_build_path(),
        E.ENV['src'].get('project', '')
    )

def build_script(file_path):
    """!
    @brief Builds a JSX file
    @returns {str} The built script"""

    if not os.path.isfile(file_path):
        raise FileNotFoundError("Can't build " + file_path + ". The file does not exist.")

    with open(file_path, 'r', encoding='utf-8-sig') as file:
        built_lines = []
        for line in file:
            trimmed_line = line.strip()
            # Is this an include?
            if trimmed_line.startswith("#include") or trimmed_line.startswith("//@include"):
                # remove trailing ";" if any
                if trimmed_line.endswith(";"):
                    trimmed_line = trimmed_line[:-1]
                # Get the script and build it.
                split_line = trimmed_line.split(" ")
                split_line.pop(0)
                include_path = " ".join(split_line)
                # Remove quotes
                if include_path.startswith('"') and include_path.endswith('"'):
                    include_path = include_path[1:-1]
                include_path = os.path.join(
                    os.path.dirname(file_path),
                    include_path
                )
                
                if not os.path.isfile(include_path):
                    raise FileNotFoundError("Can't build " + os.path.basename(file_path) +
                                            ". This included file can't be found: " + trimmed_line)
                
                built_lines.append("\n")
                built_lines.append("// ====== " + os.path.basename(include_path) + "======\n")
                built_lines.append("\n")
                built_lines += build_script(include_path)
            else:
                # Replace vars
                if 'meta' in E.ENV:
                    for key, value in E.ENV['meta'].items():
                        line = line.replace("%"+key+"%", str(value))
                built_lines.append(line)

        return built_lines

def build_file(file_path, build_path):

    script_file = os.path.join(
        E.REPO_DIR,
        file_path
    )

    print(">> Building " + os.path.basename(script_file) + "...")
    script = build_script( script_file )
    script_filename = os.path.basename(script_file)
    script_filedest = os.path.join(
        build_path,
        script_filename
    )

    with open(script_filedest, 'w', encoding='utf8') as f:
        f.writelines(script)
    return script_filedest

def build_api():
    """Builds all the API files"""

    print("> Building API...")

    if 'jsx' not in E.ENV:
        raise ValueError("Environement doesn't contain JSX data.")

    build_path = get_api_build_path()
    dist_path = os.path.join(E.REPO_DIR, 'dist')

    if os.path.isdir(dist_path):
        shutil.rmtree(dist_path)

    multiple_api = len(E.ENV['jsx'].get('API_files', ())) > 1
    api_file = ""
    api_file_lines = []
    if multiple_api:
        # Prepare an include file
        api_filename = E.ENV['src']['project'] + "_API.jsxinc"
        api_file = os.path.join(build_path, api_filename)
        api_dist_file = os.path.join(dist_path, api_filename)
        build_path = os.path.join(build_path, 'libs')
        dist_path = os.path.join(dist_path, 'libs')

    if not os.path.isdir(build_path):
        os.makedirs(build_path)
    if not os.path.isdir(dist_path):
        os.makedirs(dist_path)

    for file in E.ENV['jsx'].get('API_files', ()):
        built_file = build_file(file, build_path)

        if built_file.endswith("jsx"):
            os.rename(built_file, built_file.replace("jsx", "jsxinc"))
            built_file = built_file.replace("jsx", "jsxinc")

        # Copy to dist
        dist_file = os.path.join(
            dist_path,
            os.path.basename(built_file)
            )
        if os.path.isfile(dist_file):
            os.remove(dist_file)
        shutil.copy(built_file, dist_file)

        api_file_lines.append(
            '//@include "libs/' + os.path.basename(built_file)
            )
        api_file_lines.append("\"\n")

    if multiple_api:
        with open(api_file, 'w', encoding='utf8') as f:
            f.writelines(api_file_lines)
        with open(api_dist_file, 'w', encoding='utf8') as f:
            f.writelines(api_file_lines)
        

    print(">> API Built!")

def build_folder(scripts_dir, build_path):
    
    if not os.path.isdir(build_path):
        os.makedirs(build_path)

    if not os.path.isdir(scripts_dir):
        print(">> Source Scripts folder not found.")
        return

    for file in os.listdir(scripts_dir):
        ext = file.split(".")[-1]
        if ext not in ('jsx'):
            continue
        p = os.path.join(scripts_dir, file)
        if not os.path.isfile(p):
            continue
        build_file(p, build_path)

def build_scripts():
    """Builds all end-user scripts"""

    print("> Building Scripts...")

    build_path = os.path.join(
        get_jsx_build_path(),
        "Scripts"
    )
    scripts_dir = os.path.join(
        E.REPO_DIR,
        E.ENV['jsx'].get('Scripts', "")
    )

    build_folder( scripts_dir, build_path)

    print(">> Scripts Built!")

def build_scriptUI():
    """Builds all end-user scripts"""

    print("> Building ScriptUI Panels...")

    build_path = os.path.join(
        get_jsx_build_path(),
        "Scripts", "ScriptUI Panels"
    )
    scripts_dir = os.path.join(
        E.REPO_DIR,
        E.ENV['jsx'].get('ScriptUI_Panels', "")
    )

    build_folder( scripts_dir, build_path)

    print(">> ScriptUI Panels Built!")

def build():
    """Builds all"""

    if 'jsx' not in E.ENV:
        raise ValueError("Environement doesn't contain JSX data.")

    wipe()
    build_api()
    build_scripts()
    build_scriptUI()

def wipe():
    """!
    @brief Removes previous builds to start over.
    """
    p = get_build_path()
    if os.path.isdir(p):
        shutil.rmtree(p)
