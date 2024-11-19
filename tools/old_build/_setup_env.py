import os
import rxbuilder as builder

def init():
    builder.ENVIRONMENT.ENV_FILE = os.path.join(
        builder.ENVIRONMENT.REPO_DIR,
        'tools', 'assets', 'environment.json'
    )
    builder.ENVIRONMENT.load_environment()

if __name__ == "__main__":
    init()