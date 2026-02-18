import os
from rxbuilder.utils import run_py
from _config import REPO_PATH, GETTEXT_REPO_PATH, LANGUAGES

def json2jsxinc( json_path ):

    if not os.path.isfile(json_path):
        return

    jsxinc_path = json_path + '.jsxinc'
    jsxinc_name = os.path.basename(json_path)
    jsxinc_data = ''
    jsxinc_var = os.path.splitext(jsxinc_name)[0]

    with open(json_path, 'r', encoding='utf8') as json_file:
        data = json_file.read()
        jsxinc_data = ( 'var ' +
                        jsxinc_var +
                        ' = new DuBinary( "' +
                        data.replace('\"', '\\"').replace('\\\\"', '\\\\\\"').replace('\n','\\n') +
                        '", "' + jsxinc_name + '", "tr");\n' +
                        jsxinc_var + ';\n'
                    )
    if jsxinc_data:
        with open(jsxinc_path, 'w', encoding='utf8') as jsxinc_file:
            jsxinc_file.write(jsxinc_data)
        print('JSXINC created at ' + jsxinc_path)

def l10n( languages=LANGUAGES ):

    po_dir = os.path.join(
        REPO_PATH,
        'translation'
        )
    json_dir = os.path.join(
        REPO_PATH,
        'src', 'Scripts', 'ScriptUI Panels',
        'inc', 'tr'
        )

    gettext_path = os.path.join(
        GETTEXT_REPO_PATH,
        'tools',
        'po2json.py'
        )

    for language in languages:
        po_path = os.path.join(
            po_dir,
            'Duik_'+language+'.po'
        )
        if not os.path.isfile(po_path):
            continue
        
        json_path = os.path.join(
            json_dir,
            'Duik_'+language+'.json'
        )

        run_py(
            gettext_path,
            [
                '--po', po_path,
                '--json', json_path
            ]
        )

        json2jsxinc(json_path)

if __name__ == '__main__':
    l10n()
