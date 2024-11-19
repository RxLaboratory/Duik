"""Updates the dependencies needed by Duik"""

import os
import shutil
from _config import (
    REPO_PATH,
    DIST_PATH,
    TYPES_PATH,
    DOCS_PATH,
    ASSETS_PATH,
    SRC_PATH,
    VERSION,
    YEAR,
    SYSTEM
)
from rxbuilder.utils import (
    wipe,
    replace_in_file,
    run_py
)

DUAEF_REPO_PATH = os.path.join(REPO_PATH, '..', 'DuAEF')

def update_duaef(build_doc=True):
    """Builds and updates DuAEF"""
    if not os.path.isdir(DUAEF_REPO_PATH):
        print('DuAEF repository not found, skipping DuESF build.')
        return

    if build_doc:
        build_script = os.path.join(DUAEF_REPO_PATH, 'tools', 'build.py')
        run_py(build_script)
    else:
        build_script = os.path.join(DUAEF_REPO_PATH, 'tools', 'build_api.py')
        run_py(build_script)

    # Copy the types and lib
    shutil.copy(
        os.path.join(DUAEF_REPO_PATH, 'dist', 'DuAEF.jsxinc'),
        os.path.join(REPO_PATH, 'src', 'Scripts', 'ScriptUI Panels', 'inc', 'modules', 'DuAEF.jsxinc')
    )
    shutil.copy(
        os.path.join(DUAEF_REPO_PATH, 'dist', 'setup.jsxinc'),
        os.path.join(REPO_PATH, 'src', 'Scripts', 'ScriptUI Panels', 'inc', 'modules', 'setup.jsxinc')
    )
    shutil.copy(
        os.path.join(DUAEF_REPO_PATH, 'types', 'duaef', 'types.d.ts'),
        os.path.join(REPO_PATH, 'types', 'duaef', 'types.d.ts')
    )

def update_dependencies(build_doc=True):
    """Builds and updates the dependencies:
    - DuAEF
    - DuGR
    - DuIO
    - DuSan
    """

    update_duaef(build_doc)
    # TODO DuSan, DuIO, DuGR

if __name__ == '__main__':
    update_dependencies()
