import os
import re

def case_preserving_replace(match, repl):
    text = match.group(0)
    if text.isupper():
        return repl.upper()
    elif text.istitle():
        return repl.title()
    elif text.islower():
        return repl.lower()
    return repl

def make_replacer(repl):
    return lambda match: case_preserving_replace(match, repl)

def process_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        return False
    
    orig_content = content
    
    # Precise replacements
    content = re.sub(r'Yoel Bulacia', 'Lumen', content, flags=re.IGNORECASE)
    content = re.sub(r'YoelBulacia', 'Lumen', content, flags=re.IGNORECASE)
    content = re.sub(r'yoelbulaciavaca178@gmail\.com', 'contacto@lumen.com', content, flags=re.IGNORECASE)
    content = re.sub(r'Bulacia', 'Lumen', content, flags=re.IGNORECASE)
    content = re.sub(r'Yoel', 'Lumen', content, flags=re.IGNORECASE)
    content = re.sub(r'1Benji-1', 'lumen-org', content, flags=re.IGNORECASE)
    
    content = re.sub(r'iscomrad', 'islumen', content, flags=re.IGNORECASE)
    content = re.sub(r'comrad', make_replacer('lumen'), content, flags=re.IGNORECASE)
    
    content = re.sub(r'"@type":\s*"Person"', '"@type": "Organization"', content)
    
    # Portfolio -> Website
    content = re.sub(r'portafolio', make_replacer('website'), content, flags=re.IGNORECASE)
    content = re.sub(r'portofolio', make_replacer('website'), content, flags=re.IGNORECASE)
    content = re.sub(r'portfolio', make_replacer('website'), content, flags=re.IGNORECASE)

    if content != orig_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

if __name__ == "__main__":
    count = 0
    modified_files = []
    for root, dirs, files in os.walk('/home/bulaciayoel/Documentos/portafolio'):
        if 'node_modules' in root or '.git' in root or 'dist' in root:
            continue
        for file in files:
            # only process text files
            if file.endswith(('.html', '.js', '.jsx', '.ts', '.tsx', '.json', '.md', '.txt', '.xml', '.css')):
                filepath = os.path.join(root, file)
                if process_file(filepath):
                    modified_files.append(filepath)
                    count += 1
    
    with open('scratch/modified_files.txt', 'w') as f:
        for p in modified_files:
            f.write(p + '\n')
    print(f"Modified {count} files")
