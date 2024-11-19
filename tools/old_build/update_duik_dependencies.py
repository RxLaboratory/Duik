"""If you're a developer, use this script to install Duik directly from the repository."""

import assets._setup_env as duik
duik.init()
B = duik.builder
E = B.ENVIRONMENT

# Install dependencies
B.update_jsx_dependencies()
