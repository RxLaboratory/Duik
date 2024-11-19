import os
import platform
from datetime import datetime
from pathlib import Path
from rxbuilder.utils import (normpath, read_version)

REPO_PATH = normpath(Path(__file__).parent.parent.resolve())
SRC_PATH = os.path.join(REPO_PATH, 'src')
DEPLOY_PATH = os.path.join(REPO_PATH, 'build')
DIST_PATH = os.path.join(REPO_PATH, 'dist')
DOCS_PATH = os.path.join(REPO_PATH, 'docs')
TYPES_PATH = os.path.join(REPO_PATH, 'types')
ASSETS_PATH = os.path.join(REPO_PATH, 'tools', 'assets')
SYSTEM = platform.system()
VERSION = read_version(REPO_PATH)
YEAR = datetime.now().year
