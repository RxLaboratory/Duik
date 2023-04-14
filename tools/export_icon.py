import tempfile
import subprocess
import os

icon_name = 'expose_transform'
icon_size = '50'
icon_color = "#a526c4"

inkscape_path = 'C:/Program Files/Inkscape/bin/inkscape.exe'
repoPath = os.path.dirname(os.path.abspath(__file__)) + '/../'
icon_path = repoPath + 'inc/icons/'+icon_name+'.svg'

with open(icon_path, mode='r', encoding='utf8') as icon_file:
    content = icon_file.read()

content = content.replace('#b1b1b1', '#a526c4')

with tempfile.TemporaryDirectory() as td:
    temp_path =os.path.join(td, 'duikicon.svg')

    with open(temp_path, 'w', encoding='utf8') as temp_svg:
        temp_svg.write(content)

    dest_path =  repoPath + 'inc/icons/w'+icon_size+'/w'+icon_size+'_'+icon_name+'.png'
    bin_args = (
        inkscape_path,
        '-w', icon_size,
        temp_path,
        '-o', dest_path
    )

    bin_process = subprocess.Popen( bin_args )
    result = bin_process.communicate()
