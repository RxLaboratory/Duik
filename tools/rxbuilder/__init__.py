"""! @brief A suite of useful functions to automatically build apps
 @file __init__.py
 @section authors Author(s)
  - Created by Nicolas Dufresne on 1/3/2024 .
"""

import platform

from .environment import Environment

from .utils import get_build_path

from .qt_build import build as build_qt
from .qt_build import wipe as wipe_qt
from .qt_deploy import deploy as deploy_qt
from .qt_deploy import add_deploy_step as add_qt_deploy_step

from .jsx_build import build as build_jsx
from .jsx_install import update_dependencies as update_jsx_dependencies
from .jsx_deploy import deploy as deploy_jsx

from .mkdocs_build import build as build_mkdocs

from .jsdoc_build import build as build_jsdoc

ENVIRONMENT = Environment.instance()

if ENVIRONMENT.load_environment():
    print(
        "RxBuilder initialized. We're on " +
        platform.system() + " using " +
        str(ENVIRONMENT.BUILD_THREADS) + " threads."
        )
else:
    print(
        "NOTE: you'll need to set an environment file.\n" +
        "We're on " +
        platform.system() + " using " +
        str(ENVIRONMENT.BUILD_THREADS) + " threads."
    )
