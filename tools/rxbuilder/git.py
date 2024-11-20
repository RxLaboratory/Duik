"""Git tools"""

import subprocess

def current_branch_name():
    """Gets the name of the current branch"""

    bin_args = [
        'git',
        'branch',
        '--show-current'
    ]

    result = subprocess.run( bin_args, capture_output=True, text=True, check=True )
    return result.stdout.strip()

if __name__ =='__main__':
    print(
        current_branch_name()
    )
