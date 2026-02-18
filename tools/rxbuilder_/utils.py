import os
import sys
import shutil
import subprocess
import platform

def normpath(path):
    """!
    @brief Normalizes a path

    Parameters : 
        @param path => The path to normalize

    """
    path = os.path.abspath(path)
    if platform.system() != 'Windows':
        return path

    if not path.startswith('\\\\') and not path.startswith('//'):
        return path

    drives = { os.path.splitdrive(os.path.realpath(chr(x) + ":"))[0].lower(): chr(x) + ":" for x in range(65,91) if os.path.exists(chr(x) + ":") } # reverse map available drives to realpath
    drive, tail = os.path.splitdrive(path)
    if drive.lower() in drives:
        return os.path.join(drives[drive.lower()], tail) # apply letter drive instead of realpath to wdir

def get_dir_size( dir ):
    """!
    @brief Computes the total size of a given dir

    Parameters : 
        @param dir => the dir path
    """
    total_size = 0
    for dirpath, dirnames, filenames in os.walk(dir):
        for f in filenames:
            fp = os.path.join(dirpath, f)
            # skip if it is symbolic link
            if not os.path.islink(fp):
                total_size += os.path.getsize(fp)

    return total_size

def replace_in_file( replacements, file ):
    """!
    @brief Replaces strings in a file

    Parameters : 
        @param replacements => Dict in the form { 'from': 'to' }
        @param file => The path to the file

    """
    lines = []
    with open( file, 'r', encoding='utf8' ) as infile:
        for line in infile:
            for src, target in replacements.items():
                line = line.replace(src, str(target))
            lines.append(line)
    with open( file , 'w', encoding='utf8' ) as outfile:
        for line in lines:
            outfile.write(line)

def wipe(folder):
    """!
        Wipes the folder
    """
    print("> Wiping "+folder+" ...")
    if os.path.isdir(folder):
        shutil.rmtree(folder)
    print("> Wiped!")

def zip_dir( dir, zip_file_handler ):
    """!
    @brief Zips a given folder

    Parameters : 
        @param dir => The path
        @param zip_file_handler => The zip file handler

    """
    for root, dirs, files in os.walk(dir):
        for file in files:
            zip_file_handler.write(os.path.join(root, file),
                                  os.path.join(root.replace(dir, ''), file)
                                  )

def write_version(build_path, version):
    v_file = os.path.join(build_path, 'version')
    with open(v_file, 'w', encoding='utf8') as f:
        f.write(version)

def read_version(path, default='0.0.0'):
    version_file = os.path.join(path, 'version')
    version = default
    with open(version_file, encoding='utf8') as f:
        version = f.readline().strip()
    return version

def run_py(py_file):
    """Runs a python script"""
    bin_args = [
        sys.executable,
        py_file
    ]
    p = subprocess.Popen( bin_args, cwd=os.path.dirname(py_file) )
    p.communicate()
