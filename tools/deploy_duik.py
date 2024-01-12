import os
import assets._setup_env as duik
duik.init()
B = duik.builder

def rename_duik_zip():
    build_path = B.get_build_path()
    for f in os.listdir(build_path):
        file = os.path.join(build_path, f)
        if not os.path.isfile(file):
            continue
        if f.startswith('Duik_API'):
            continue
        if not f.startswith('Duik_') and f.endswith('.zip'):
            continue
        new_file = os.path.join(
            build_path,
            f.replace('Duik_', 'Duik_Angela_')
        )
        os.rename(file, new_file)
        break

if __name__ == '__main__':
    B.build_jsx()
    B.build_mkdocs()
    B.build_jsdoc()
    B.deploy_jsx()
    rename_duik_zip()
