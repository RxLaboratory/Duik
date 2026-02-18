import os
import platform
from datetime import datetime
from pathlib import Path
from rxbuilder_ import utils, git

REPO_PATH = utils.normpath(Path(__file__).parent.parent.resolve())
SRC_PATH = os.path.join(REPO_PATH, 'src')
SRC_DOCS_PATH = os.path.join(REPO_PATH, 'src-docs')
DEPLOY_PATH = os.path.join(REPO_PATH, 'build')
DIST_PATH = os.path.join(REPO_PATH, 'dist')
DOCS_PATH = os.path.join(REPO_PATH, 'docs')
API_DOCS_PATH = os.path.join(REPO_PATH, 'docs-api')
TYPES_PATH = os.path.join(REPO_PATH, 'types')
ASSETS_PATH = os.path.join(REPO_PATH, 'tools', 'assets')
SYSTEM = platform.system()
VERSION = utils.read_version(REPO_PATH)
YEAR = datetime.now().year
IS_PRERELEASE = git.current_branch_name() not in ('main', 'master')
DUIK_ANGELA_SRC = os.path.join(SRC_PATH, 'Scripts', 'ScriptUI Panels', 'Duik Angela.jsx')
