import subprocess
import os
import shutil
from .utils import get_build_path
from .jsx_build import get_api_build_path
from .environment import Environment

E = Environment.instance()

def build():
    if 'src' not in E.ENV:
        raise ValueError("src not set in Environment file.")
    
    print("> Building API Docs...")

    conf_path = os.path.join(
        E.ENV['src'].get('jsdoc_conf',"./tools"),
        "jsdoc_conf.json"
        )
    if not os.path.isabs(conf_path):
        conf_path = os.path.join(
            E.REPO_DIR,
            conf_path
        )

    conf_ts_path = os.path.join(
        E.ENV['src'].get('jsdoc_conf',"./tools"),
        "jsdoc_ts_conf.json"
        )
    if not os.path.isabs(conf_ts_path):
        conf_ts_path = os.path.join(
            E.REPO_DIR,
            conf_ts_path
        )
    
    if not os.path.isfile(conf_path) and not os.path.isfile(conf_ts_path):
        print(">> Nothing to build at " + conf_path)
        return
    
    bin_args = [ "cmd", "/c", "jsdoc", "-c", os.path.basename(conf_path) ]
    readme = os.path.join(E.REPO_DIR, "README.md")
    if os.path.isfile(readme):
        bin_args = bin_args + ["-R", readme]

    print(">> Building Reference...")
    jsdoc_process = subprocess.Popen(
        bin_args,
        cwd = os.path.dirname(conf_path)
        )
    jsdoc_process.communicate()

    css = os.path.join(
        os.path.dirname(conf_path),
        'jsdoc.css'
    )
    build_path = get_build_path()
    if os.path.isfile(css):
        shutil.copy(
            css,
            os.path.join(build_path, 'docs', 'api', 'jsdoc.css')
        )

    # Copy the reference to the built folder
    api_build_path = get_api_build_path()
    docs_path = os.path.join(
            build_path,
            'docs', 'api'
        )
    if os.path.isdir(api_build_path) and os.path.isdir(docs_path):
        docs_build_path = os.path.join(
            api_build_path,
            'docs'
        )
        if os.path.isdir(docs_build_path):
            shutil.rmtree(docs_build_path)
        
        shutil.copytree(docs_path, docs_build_path)

    print("> Building type defs...")
    bin_args = [ "cmd", "/c", "jsdoc", "-c", os.path.basename(conf_ts_path) ]
    jsdoc_process = subprocess.Popen(
        bin_args,
        cwd = os.path.dirname(conf_ts_path)
        )
    jsdoc_process.communicate()

    # Copy types to the built folder
    api_build_path = get_api_build_path()
    types_path = os.path.join(
            E.REPO_DIR,
            'types'
        )
    if os.path.isdir(api_build_path) and os.path.isdir(types_path):
        types_build_path = os.path.join(
            api_build_path,
            'types'
        )
        if os.path.isdir(types_build_path):
            shutil.rmtree(types_build_path)
        
        shutil.copytree(types_path, types_build_path)


    print(">> Docs built!")