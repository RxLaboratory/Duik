"""jsdoc tools"""

import os
import shutil
import platform
import subprocess

from . import utils

def build(conf_file:str, replacements={}):
    """Builds a jsdoc using a conf file.
    Use the @replacements to set variables in the conf file.
    @index_page_name is the name of the resulting html page to replace index.html
    """

    dir_path = os.path.dirname(conf_file)

    # Prepare the conf file
    jsdoc_conf_path = os.path.join(
        dir_path,
        'rxbuilder_conf.json'
    )
    if os.path.isfile(jsdoc_conf_path):
        os.remove(jsdoc_conf_path)
    shutil.copy(
        os.path.join(conf_file),
        jsdoc_conf_path
    )

    utils.replace_in_file(replacements, jsdoc_conf_path)

    bin_args = []
    system = platform.system()
    if system == "Windows":
        bin_args = [
            'cmd',
            '/c',
            'jsdoc',
            '-c',
            jsdoc_conf_path
        ]
    elif system == "Darwin":
        # MacOS : TODO
        pass

    bin_process = subprocess.Popen( bin_args, cwd=dir_path )
    bin_process.communicate()

    os.remove(jsdoc_conf_path)
