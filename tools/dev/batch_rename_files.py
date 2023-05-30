import os

search = '.jsxinc'
replace = '.jsx'
input_folder = 'src/inc/api'

i = 0
for file in os.listdir(input_folder):
    if search in file:
        filename = file.replace(search, replace)
        print("Renaming "  + file + " to " + filename)
        os.rename(
            os.path.join(input_folder, file),
            os.path.join(input_folder, filename)
            )
        i = i + 1

print( "Renamed " + str(i) + " files.")