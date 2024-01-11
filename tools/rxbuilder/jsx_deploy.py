import os
from .environment import Environment

E = Environment.instance()

def get_dist_path():
    """!
    @brief Gets the 'dist' folder, containing the dist file for the API
    @returns The path
    """
    return os.path.join(E.REPO_DIR, 'dist')

def get_types_path():
    """!
    @brief Gets the 'types/scriptName folder, containing the type defs for the API
    @returns The path
    """
    p = os.path.join(E.REPO_DIR, 'types')
    if 'jsx' in E.ENV:
        p = os.path.join(p, E.ENV['jsx'].get("project_name", ""))
    return p
