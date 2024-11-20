"""Deploys Duik in the 'build' folder"""

from build import update_dependencies, build, deploy


if __name__ == '__main__':
    update_dependencies()
    build()
    deploy()
