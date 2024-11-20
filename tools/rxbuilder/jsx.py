import os

def build_script(file_path:str, replacements:dict = {}) -> str:
    """Builds the script and returns the string
    All keys from replacements found in the script
    will be replaced by the replacements dict corresponding value.
    """
    if not os.path.isfile(file_path):
        raise FileNotFoundError("Can't build " + file_path + ". The file does not exist.")

    with open(file_path, 'r', encoding='utf-8-sig') as file:
        built_lines = []
        for line in file:
            trimmed_line = line.strip()
            # Is this an include?
            if trimmed_line.startswith("#include") or trimmed_line.startswith("//@include"):
                # remove trailing ";" if any
                if trimmed_line.endswith(";"):
                    trimmed_line = trimmed_line[:-1]
                # Get the script and build it.
                split_line = trimmed_line.split(" ")
                split_line.pop(0)
                include_path = " ".join(split_line)
                # Remove quotes
                if include_path.startswith('"') and include_path.endswith('"'):
                    include_path = include_path[1:-1]
                include_path = os.path.join(
                    os.path.dirname(file_path),
                    include_path
                )

                if not os.path.isfile(include_path):
                    raise FileNotFoundError("Can't build " + os.path.basename(file_path) +
                                            ". This included file can't be found: " + trimmed_line)

                built_lines.append("\n")
                built_lines.append("// ====== " + os.path.basename(include_path) + "======\n")
                built_lines.append("\n")
                built_lines += build_script(include_path, replacements)
            else:
                # Replace vars
                for key, value in replacements.items():
                    if key in line:
                        line = line.replace(key, str(value))
                built_lines.append(line)

        return built_lines

def build(source_file_path:str, dest_file_path:str, replacements:dict = {}):
    """Builds the source to the destination.
    All keys from replacements found in the script
    will be replaced by the replacements dict corresponding value.
    """
    print(">> Building " + os.path.basename(source_file_path) + "...")
    script = build_script( source_file_path, replacements )
    with open(dest_file_path, 'w', encoding='utf8') as f:
        f.writelines(script)
