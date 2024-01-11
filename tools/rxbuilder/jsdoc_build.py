import subprocess
import os
import shutil
from .utils import get_build_path
from .environment import Environment

E = Environment.instance()

def build():
    if 'src' not in E.ENV:
        raise ValueError("src not set in Environment file.")
    
    print("> Building API Docs...")

    conf_path = E.ENV['src'].get('jsdoc_conf',"./tools")
    conf_path = os.path.join(conf_path, "jsdoc_conf.json")
    if not os.path.isabs(conf_path):
        conf_path = os.path.join(
            E.REPO_DIR,
            conf_path
        )
    if not os.path.isfile(conf_path):
        print(">> Nothing to build at " + conf_path)
        return
    
    bin_args = [ "cmd", "/c", "jsdoc", "-c", os.path.basename(conf_path) ]
    readme = os.path.join(E.REPO_DIR, "README.md")
    if os.path.isfile(readme):
        bin_args = bin_args + ["-R", readme]
    
    jsdoc_process = subprocess.Popen(
        bin_args,
        cwd = os.path.dirname(conf_path)
        )
    jsdoc_process.communicate()

    css = os.path.join(
        os.path.dirname(conf_path),
        'jsdoc.css'
    )
    if os.path.isfile(css):
        shutil.copy(
            css,
            os.path.join(get_build_path(), 'docs', 'api', 'jsdoc.css')
        )

    print(">> Docs built!")