import os
import shutil
import subprocess
from .utils import abs_path
from .qt_build import get_build_path
from .qt_build import get_pro_file
from .environment import Environment

E = Environment.instance()

deploy_steps = []

def get_built_exe():
    """!
    @brief Gets the executable file name
    @returns The name
    """
    exe_name = '.'.join(
        E.ENV["src"]["project"].split(".")[:-1]
    )
    if E.IS_WIN:
        return exe_name + ".exe"
    if E.IS_LINUX:
        return exe_name.lower()
    if E.IS_MAC:
        return exe_name + ".app"

def get_deploy_path():
    """!
    @brief Gets the deploy path
    @returns The absolute path
    """
    build_path = os.path.join(E.REPO_DIR, 'build')

    if E.IS_WIN:
        build_path = build_path + "/windows/deploy"
    elif E.IS_LINUX:
        build_path = build_path + "/linux/deploy"
    elif E.IS_MAC:
        build_path = build_path + "/mac/deploy"

    return abs_path(build_path)

def deploy():
    """!
    @brief Deploys the previously built DuGit (in release mode)
    """

    print("Deploying...")

    build_path = get_build_path()
    
    if E.IS_WIN:
        build_path = os.path.join(build_path, "windows")
    elif E.IS_LINUX:
        build_path = os.path.join(build_path, "linux")
    elif E.IS_MAC:
        build_path = os.path.join(build_path, "mac")

    exe_built = ""
    exe_name = get_built_exe()
    if E.IS_WIN:
        build_path = os.path.join(build_path, 'release')
        exe_built = os.path.join(build_path, exe_name)
    elif E.IS_LINUX:
        exe_built = os.path.join(build_path, exe_name)
    elif E.IS_MAC:
        exe_built = os.path.join(build_path, exe_name)

    if not os.path.isfile(exe_built):
        raise FileNotFoundError( "DuGit can't be found at " + exe_built )

    deploy_path = get_deploy_path()

    if not os.path.isdir(deploy_path):
        os.makedirs(deploy_path)

    exe_deployed = os.path.join(deploy_path, exe_name)

    print("> Deploy path: " + deploy_path)

    shutil.copy(
        exe_built,
        exe_deployed
    )

    if E.IS_WIN:
        deploy_win(exe_deployed)
    if E.IS_LINUX:
        deploy_linux(exe_deployed)

    for step in deploy_steps:
        step(E.ENV, deploy_path, exe_deployed)

def deploy_win(exe:str):
    """!
    @brief Deploys the exe on Windows

    Parameters : 
        @param exe : str => The path to the executable file
    """
    bin_args = [
        E.ENV["Qt"]["deployqt_bin"],
        exe
    ]

    print("> Deploying...")

    bin_process = subprocess.Popen( bin_args, cwd=os.path.dirname(exe) )
    bin_process.communicate()

def deploy_linux(exe:str):
    """!
    @brief Deploys the app on Linux

    Parameters : 
        @param exe : str => The path to the executable file

    """
    deploy_path = os.path.dirname(exe)
    # Create the main app dir
    app_name = os.path.basename(get_pro_file())
    app_name = os.path.splitext(app_name)[0]
    app_dir = os.path.join(deploy_path, app_name)

    # Clean
    if os.path.isdir(app_dir):
        shutil.rmtree(app_dir)

    usr_dir = os.path.join(app_dir, 'usr')
    if not os.path.isdir(usr_dir):
        os.makedirs(usr_dir)

    bin_dir = os.path.join(usr_dir, 'bin')
    if not os.path.isdir(bin_dir):
        os.makedirs(bin_dir)

    share_dir = os.path.join(usr_dir, 'share')
    if not os.path.isdir(share_dir):
        os.makedirs(share_dir)

    icons_dir = os.path.join(share_dir, 'icons', 'hicolor')
    if not os.path.isdir(icons_dir):
        os.makedirs(icons_dir)

    applications_dir = os.path.join(share_dir, 'applications')
    if not os.path.isdir(applications_dir):
        os.makedirs(applications_dir)

    # Copy icons
    resource_icons = os.path.join(E.REPO_DIR, E.ENV['src']['icon_set'])
    for i in os.listdir(resource_icons):
        dest_dir = ""
        if "24x24" in i:
            dest_dir = os.path.join(icons_dir, "24x24", "apps")
        elif "32x32" in i:
            dest_dir = os.path.join(icons_dir, "32x32", "apps")
        elif "48x48" in i:
            dest_dir = os.path.join(icons_dir, "48x48", "apps")
        elif "128x128" in i:
            dest_dir = os.path.join(icons_dir, "128x128", "apps")
        elif "256x256" in i:
            dest_dir = os.path.join(icons_dir, "256x256", "apps")
        else:
            continue
        i_file = os.path.join(resource_icons, i)
        if not os.path.isdir(dest_dir):
            os.makedirs(dest_dir)
        shutil.copy(
            i_file,
            os.path.join(dest_dir, os.path.basename(exe) + ".png")
        )

    # Copy Desktop file
    desktop_file = os.path.join(E.REPO_DIR, E.ENV['src']['desktop'])
    if os.path.isfile(desktop_file):
        shutil.copy(
            desktop_file,
            os.path.join(applications_dir, app_name + ".desktop")
        )

    # Move bin
    shutil.move(
        exe,
        os.path.join(bin_dir, os.path.basename(exe))
    )

def add_deploy_step(func):
    """!
    @brief Adds a step to the deploy process

    Parameters : 
        @param func => The function to run, which takes three args: 

    """
    deploy_steps.append(func)
