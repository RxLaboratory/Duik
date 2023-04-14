import os

path = 'icons/w50'
output_path = 'api/ctrl_icons.jsxinc'


inc_path = os.path.dirname(os.path.abspath(__file__)) + '/../inc/'
path = os.path.join(inc_path, path)
output_path = os.path.join(inc_path, output_path)

with open(output_path, mode='w', encoding='utf8') as output_file:
    for f in os.listdir(path):
        n = os.path.splitext(f)
        if n[1] != '.jsxinc':
            continue
        f = os.path.join(path, f)
        f = os.path.relpath(f, os.path.dirname(output_path))
        f = f.replace('\\', '/')
        output_file.write('#include "' + f + '"\n')