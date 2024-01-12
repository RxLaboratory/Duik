"""! @brief Misc. useful functions
 @file utils.py
 @section libs Librairies/Modules
 @section authors Author(s)
  - Created by Nicolas Dufresne on 1/3/2024 .
"""

import os
from .environment import Environment

E = Environment.instance()

def abs_path( rel_path ):
    """!
    @brief Returns the absolute path of a path relative to this py file

    Parameters : 
        @param rel_path => The relative path to convert

    """
    return os.path.abspath(
        os.path.join( E.THIS_DIR, rel_path)
        ).replace('/', os.sep)

def add_to_PATH( p:str ): # pylint: disable=invalid-name
    """!
    @brief Adds a path to the PATH environment variable
    @param p The path to add
    """
    os.environ["PATH"] = (
            p +
            os.pathsep +
            os.environ["PATH"]
        )

def get_build_path():
    """!
    @brief Gets the build path
    """
    build_path = os.path.join(E.REPO_DIR, 'build')
    return abs_path(build_path)

def zip_dir( dir, zip_file_handler ):
    for root, dirs, files in os.walk(dir):
        for file in files:
            zip_file_handler.write(os.path.join(root, file),
                                  os.path.join(root.replace(dir, ''), file)
                                  )
