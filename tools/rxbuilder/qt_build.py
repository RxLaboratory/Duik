"""! @brief Build functions for Qt
 @file qt_build.py
 @section libs Librairies/Modules
  - os (link)
  - subprocess (link)
  - .environment (link)
  - .utils (link)
 @section authors Author(s)
  - Created by Nicolas Dufresne on 1/3/2024 .
"""

import os
import subprocess
import shutil
from .utils import (
    add_to_PATH,
    get_build_path
)
from .environment import Environment

E = Environment.instance()

def is_mingw():
    """!
    @brief Checks if we're using MinGW to build
    @returns True if we're using MinGW
    """
    if "Qt" not in E.ENV:
        return False
    make_bin = E.ENV["Qt"].get("make_bin","")
    make_name = os.path.basename(make_bin)
    return make_name.startswith("mingw")

def get_qt_build_path(debug=False):
    """!
    @brief Gets the build path

    Parameters : 
        @param debug = False => Debug mode

    @returns The build path
    """

    build_path = get_build_path()

    if E.IS_WIN:
        build_path = os.path.join(build_path, "windows")
    elif E.IS_LINUX:
        build_path = os.path.join(build_path, "linux")
    elif E.IS_MAC:
        build_path = os.path.join(build_path, "mac")

    if not is_mingw(): # MinGW already creates the subfolders
        if debug:
            build_path = os.path.join(build_path,"debug")
        else:
            build_path = os.path.join(build_path,"release")

    return build_path

def get_pro_file():
    """Gets the .pro file"""
    pro_name = E.ENV["src"]["project"]
    if not pro_name.endswith(".pro"):
        pro_name = pro_name + ".pro"
    return os.path.join(E.REPO_DIR, pro_name )

def build(debug=False):
    """!
    @brief Builds DuGit

    Parameters : 
        @param debug = False => Set to True to build in Debug mode
    """
    print("Building...")

    # On windows, we need g++ in PATH
    if E.IS_WIN:
        add_to_PATH(
            os.path.dirname(
                E.ENV["Qt"]["make_bin"]
                )
        )

    build_path = get_qt_build_path(debug)

    print("> Build path: " + build_path)

    if not os.path.isdir(build_path):
        os.makedirs(build_path)

    print("> Running qmake...")

    pro_path = get_pro_file()
    print(">> Project: " + pro_path)

    bin_args = [
        os.path.expanduser(E.ENV["Qt"]["qmake_bin"]),
        pro_path
    ]
    if debug:
        bin_args.append("CONFIG+=debug")
        bin_args.append("CONFIG+=qml_debug")

    bin_process = subprocess.Popen( bin_args, cwd=build_path )
    bin_process.communicate()

    print("> Running make...")

    bin_args = [
        os.path.expanduser(E.ENV["Qt"]["make_bin"]),
        "-j" + str(E.BUILD_THREADS)
    ]

    bin_process = subprocess.Popen( bin_args, cwd=build_path )
    bin_process.communicate()

def wipe(debug=False):
    """!
    @brief Removes previous builds to start over.

    Parameters : 
        @param debug = False => Whether to wipe the debug or release folder
    """
    build_path = get_qt_build_path(debug)
    shutil.rmtree(build_path)
