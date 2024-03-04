import os
import zipfile
from .file_deploy import deploy as deploy_files
from .utils import (
    get_build_path,
    zip_dir
)
from .jsx_build import (
    get_api_build_path,
    get_jsx_build_path
)
from .environment import Environment

E = Environment.instance()

def get_types_path():
    """!
    @brief Gets the 'types/scriptName folder, containing the type defs for the API
    @returns The path
    """
    p = os.path.join(E.REPO_DIR, 'types')
    if 'jsx' in E.ENV:
        p = os.path.join(p, E.ENV['jsx'].get("project_name", ""))
    return p

def deploy_jsx(build_path, version):
    print(">> Deploying Scripts...")

    jsx_path = get_jsx_build_path()
    zip_file = os.path.join(build_path, os.path.basename(jsx_path) + version + '.zip')

    with zipfile.ZipFile(zip_file, 'w', zipfile.ZIP_DEFLATED) as zip:
        zip_dir(jsx_path, zip)

def deploy_api(build_path, version):

    print(">> Deploying API...")

    api_path = get_api_build_path()
    zip_file = os.path.join(build_path, os.path.basename(api_path) + version + '.zip')

    with zipfile.ZipFile(zip_file, 'w', zipfile.ZIP_DEFLATED) as zip:
        zip_dir(api_path, zip)

def deploy():

    print("> Deploying...")

    deploy_files()

    build_path = get_build_path()
    version = ""
    if 'meta' in E.ENV:
        version = E.ENV['meta'].get('version', '')
        if version != '':
            version = '_' + version

    deploy_api(build_path, version)
    deploy_jsx(build_path, version)

    print(">> Deployed!")

    