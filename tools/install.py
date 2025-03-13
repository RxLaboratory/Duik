"""Symlinks Duik in scriptui panels"""

import os
from pyuac import main_requires_admin
from _config import (
    SRC_PATH,
)

AE_VERSION = '2025'
DESTINATION = f"C:/Program Files/Adobe/Adobe After Effects {AE_VERSION}/Support Files/Scripts/ScriptUI Panels"

def symlink(src):
    """Symlink a folder"""
    dst = os.path.join(DESTINATION, src)
    src = os.path.join(SRC_PATH, 'Scripts', 'ScriptUI Panels', src)
    if not os.path.exists(dst):
        os.symlink(src, dst)

@main_requires_admin
def install():
    """Install Duik"""
    symlink("Duik Angela.jsx")
    symlink("inc")

if __name__ == '__main__':
    install()
    print("Duik installed!")
