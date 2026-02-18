"""Deploys Duik in the 'build' folder"""

import os
from _config import SYSTEM, DUIK_ANGELA_SRC
from build import update_dependencies

if SYSTEM == 'Windows':
    from pyuac import main_requires_admin

def symlink_path(src, dst):
    if not os.path.exists(dst):
        os.symlink(src, dst)

def install( ae_version ):
    """Symlinks dependencies in After Effects"""
    if ae_version == 'Beta':
        ae_version = '(Beta)'
    # Find install path
    ae_path = ''
    if SYSTEM == 'Windows':
        ae_path = 'C:/Program Files/Adobe/Adobe After Effects '+ ae_version +'/Support Files/Scripts/ScriptUI Panels'

    if not os.path.isdir(ae_path):
        print(">> Can't install: After Effects "+ae_version+" not found.")


    # Symlink Duik
    # Remove existing
    dest = os.path.join(ae_path, 'Duik Angela.jsx')
    if os.path.isfile(dest):
        os.unlink(dest)
    symlink_path(
        DUIK_ANGELA_SRC,
        dest
        )

    # Symlink libs
    # Remove existing
    dest = os.path.join(ae_path, 'inc')
    if os.path.exists(dest):
        os.rmdir(dest)
    libs_path = os.path.join(
        os.path.dirname(DUIK_ANGELA_SRC),
        'inc'
    )
    symlink_path(
        libs_path,
        dest
        )

@main_requires_admin
def main( ae_versions ):
    print("> Updating dependencies.")
    update_dependencies()
    print("> Installing Duik.")
    for version in ae_versions:
        install(version)
    print(">> Done!")

if __name__ == '__main__':
    main((
            '2026',
            '(Beta)'
        ))
