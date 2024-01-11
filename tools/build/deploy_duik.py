import os
import rxbuilder as builder

builder.ENVIRONMENT.ENV_FILE = os.path.join(
    builder.ENVIRONMENT.REPO_DIR,
    'tools', 'build', 'environment.json'
)
builder.ENVIRONMENT.load_environment()

if __name__ == '__main__':
    builder.build_jsx()
