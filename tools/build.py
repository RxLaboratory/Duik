"""Builds the Duik API"""

import os
import shutil
import zipfile
from _config import (
    REPO_PATH,
    DIST_PATH,
    TYPES_PATH,
    DOCS_PATH,
    API_DOCS_PATH,
    ASSETS_PATH,
    SRC_PATH,
    SRC_DOCS_PATH,
    VERSION,
    YEAR,
    SYSTEM,
    IS_PRERELEASE,
    DEPLOY_PATH
)
from rxbuilder import utils, jsx, mkdocs, jsdoc

DUIK_TYPES_PATH = os.path.join(TYPES_PATH, 'duik')
DUAEF_REPO_PATH = os.path.join(REPO_PATH, '..', 'DuAEF')
# Metadata
META = {
    '#version#': VERSION,
    '#year#': YEAR,
    '#prerelease#': str(IS_PRERELEASE).lower()
}

def clean():
    """Cleans all build and docs paths"""
    # Clean build folders
    utils.wipe(DIST_PATH)
    utils.wipe(DUIK_TYPES_PATH)
    utils.wipe(API_DOCS_PATH)
    utils.wipe(DOCS_PATH)
    utils.wipe(DEPLOY_PATH)

def update_duaef(build_doc=True):
    """Builds and updates DuAEF"""
    if not os.path.isdir(DUAEF_REPO_PATH):
        print('DuAEF repository not found, skipping DuESF build.')
        return

    if build_doc:
        build_script = os.path.join(DUAEF_REPO_PATH, 'tools', 'build.py')
        utils.run_py(build_script)
    else:
        build_script = os.path.join(DUAEF_REPO_PATH, 'tools', 'build_api.py')
        utils.run_py(build_script)

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

def build_api():
    """Builds the API in the dist folder"""
    print("> Building Duik API...")

    # Build all jsxinc files
    # Note : because there is a limitation in the
    # included file sizes with ExtendScript,
    # the API is split in multiple files.
    inc_path = os.path.join(SRC_PATH, 'Scripts', 'ScriptUI Panels', 'inc')
    dist_libs_path = os.path.join(DIST_PATH, 'libs')
    utils.wipe(dist_libs_path)
    os.makedirs(dist_libs_path)
    jsx.build(
        os.path.join(inc_path, 'api1.jsx'),
        os.path.join(dist_libs_path, 'api1.jsxinc'),
        META
    )
    jsx.build(
        os.path.join(inc_path, 'api2.jsx'),
        os.path.join(dist_libs_path, 'api2.jsxinc'),
        META
    )
    jsx.build(
        os.path.join(inc_path, 'api3.jsx'),
        os.path.join(dist_libs_path, 'api3.jsxinc'),
        META
    )

    # Copy dependencies (all modules except setup.jsxinc)
    modules_path = os.path.join(inc_path, 'modules')
    modules = []
    for file_name in os.listdir(modules_path):

        if file_name == 'setup.jsxinc':
            continue

        ext = os.path.splitext(file_name)[1]
        if ext.lower() not in ('.jsx', '.jsxinc'):
            continue

        shutil.copy(
            os.path.join(modules_path, file_name),
            os.path.join(dist_libs_path, file_name)
        )
        modules.append(file_name)

    # Create the Duik API file
    api_path = os.path.join(DIST_PATH, 'Duik_api.jsxinc')
    with open(api_path, 'w', encoding='utf8') as api_file:
        for mod in modules:
            api_file.write( '//@include "libs/' + mod + '"\n')
        api_file.write( '//@include "libs/api1.jsxinc"\n')
        api_file.write( '//@include "libs/api2.jsxinc"\n')
        api_file.write( '//@include "libs/api3.jsxinc"\n')

def deploy_scripts():
    """Builds the end-user scripts"""
    print("> Building Duik Scripts...")

    # Build all jsx files in the scripts folder
    scripts_path = os.path.join(SRC_PATH, 'Scripts')
    scripts_deploy_path = os.path.join(DEPLOY_PATH, 'Duik', 'Scripts')
    api_deploy_path = os.path.join(DEPLOY_PATH, 'Duik_API')

    if not os.path.isdir(scripts_deploy_path):
        os.makedirs(scripts_deploy_path)
    if not os.path.isdir(api_deploy_path):
        os.makedirs(api_deploy_path)

    for script in os.listdir(scripts_path):
        ext = os.path.splitext(script)[1]
        if ext.lower() != '.jsx':
            continue

        script_path = os.path.join(scripts_deploy_path, script)
        jsx.build(
            os.path.join(scripts_path, script),
            script_path,
            META
        )

        # Deploy them with the Duik API
        api_script_path = os.path.join(api_deploy_path, script)
        if os.path.isfile(api_script_path):
            os.remove(api_script_path)
        shutil.copy(
            script_path,
            api_script_path
        )

def deploy_scriptui_panels():
    """Builds the end-user panels"""
    print("> Building Duik ScriptUI Panels...")

    # Build all jsx files in the scriptUI Panels folder
    scriptui_path = os.path.join(SRC_PATH, 'Scripts', 'ScriptUI Panels')
    scriptui_deploy_path = os.path.join(DEPLOY_PATH, 'Duik', 'Scripts', 'ScriptUI Panels')

    if not os.path.isdir(scriptui_deploy_path):
        os.makedirs(scriptui_deploy_path)

    for script in os.listdir(scriptui_path):
        ext = os.path.splitext(script)[1]
        if ext.lower() != '.jsx':
            continue

        script_path = os.path.join(scriptui_deploy_path, script)
        jsx.build(
            os.path.join(scriptui_path, script),
            script_path,
            META
        )

def deploy():
    """Deploys Duik"""

    if not os.path.isdir(DEPLOY_PATH):
        os.makedirs(DEPLOY_PATH)

    duik_path = os.path.join(DEPLOY_PATH, 'Duik')
    duik_api_path = os.path.join(DEPLOY_PATH, 'Duik_API')
    tools_path = os.path.join(duik_path, 'Tools')

    if os.path.isdir(duik_api_path):
        os.remove(duik_api_path)

    # Copy the API
    shutil.copytree(
        DIST_PATH,
        duik_api_path
    )

    deploy_scripts()
    deploy_scriptui_panels()

    # Add the tools
    if not os.path.isdir(tools_path):
        os.makedirs(tools_path)
    shutil.copy(
        os.path.join(ASSETS_PATH, 'DuSI.jsx'),
        os.path.join(tools_path, 'DuSI.jsx')
    )

    # Add license and readme files
    shutil.copy(
        os.path.join(ASSETS_PATH, 'README.txt'),
        os.path.join(duik_path, 'README.txt')
    )
    shutil.copy(
        os.path.join(ASSETS_PATH, 'LICENSE.md'),
        os.path.join(duik_path, 'LICENSE.md')
    )
    shutil.copy(
        os.path.join(ASSETS_PATH, 'LICENSE.txt'),
        os.path.join(duik_path, 'LICENSE.txt')
    )
    shutil.copy(
        os.path.join(ASSETS_PATH, 'LICENSE.md'),
        os.path.join(duik_api_path, 'LICENSE.md')
    )
    shutil.copy(
        os.path.join(ASSETS_PATH, 'LICENSE.txt'),
        os.path.join(duik_api_path, 'LICENSE.txt')
    )

    # Copy the docs and types in the API
    shutil.copytree(
        API_DOCS_PATH,
        os.path.join(duik_api_path, 'docs')
    )
    shutil.copytree(
        TYPES_PATH,
        os.path.join(duik_api_path, 'types')
    )

    print("Zipping files...")

    # ZIP Duik!
    zip_file = os.path.join(
        DEPLOY_PATH,
        'Duik_Angela_' + VERSION + '.zip'
    )
    with zipfile.ZipFile(zip_file, 'w', zipfile.ZIP_DEFLATED) as z:
        utils.zip_dir(duik_path, z)

    # ZIP API!
    zip_file = os.path.join(
        DEPLOY_PATH,
        'Duik_API_' + VERSION + '.zip'
    )
    with zipfile.ZipFile(zip_file, 'w', zipfile.ZIP_DEFLATED) as z:
        utils.zip_dir(duik_api_path, z)

def build_user_guide():
    """Builds the user guide"""
    print("> Building Duik User Guide")

    utils.wipe(DOCS_PATH)
    os.makedirs(DOCS_PATH)

    mkdocs.build(SRC_DOCS_PATH)

def build_docs():
    """Builds the API docs """
    print("> Building API reference")

    # List libs to build
    includes = []
    libs_path = os.path.join(DIST_PATH, 'libs')
    for lib in os.listdir(libs_path):
        includes.append(
            '"' + os.path.join(libs_path, lib).replace('\\','/') + '"'
        )

    jsdoc.build(
        os.path.join(ASSETS_PATH, 'jsdoc_conf.json'),
        {
            "#includepath#": ',\n'.join(includes),
            "#year#": YEAR,
            "#destpath#": API_DOCS_PATH.replace('\\', '/')
        }
    )

    # Replace the index
    index_path = os.path.join(API_DOCS_PATH, 'index.html')
    if os.path.isfile(index_path):
        os.remove(index_path)
    shutil.copy(
        os.path.join(API_DOCS_PATH, 'Duik.html'),
        index_path
    )

    # Set the style
    shutil.copy(
        os.path.join(ASSETS_PATH, 'jsdoc.css'),
        os.path.join(API_DOCS_PATH, 'jsdoc.css')
    )

def build_types():
    """Builds the API type defs """
    print("> Building API type defs")

    # List libs to build
    includes = []
    libs_path = os.path.join(DIST_PATH, 'libs')
    for lib in os.listdir(libs_path):
        includes.append(
            '"' + os.path.join(libs_path, lib).replace('\\','/') + '"'
        )

    jsdoc.build(
        os.path.join(ASSETS_PATH, 'jsdoc_ts_conf.json'),
        {
            "#includepath#": ',\n'.join(includes),
            "#destpath#": DUIK_TYPES_PATH.replace('\\', '/')
        }
    )

def build():
    """Auto build all."""
    clean()
    build_api()
    build_user_guide()
    build_docs()
    build_types()

if __name__ == '__main__':
    update_dependencies()
    build()
