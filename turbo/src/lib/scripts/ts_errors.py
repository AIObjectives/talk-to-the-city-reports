#!/usr/bin/env python3

import re
import subprocess
from pathlib import Path
import sys
import argparse
import json

parser = argparse.ArgumentParser(description='Check for errors in Svelte files.')
parser.add_argument('--fix-path', help='Fix given path.')
parser.add_argument('--show-path', help='Show errors in given path.')
parser.add_argument('--pre-commit-hook', action='store_true', help='Fix errors.')
parser.add_argument('--show-all-errors', action='store_true', help='Show all errors.')
args = parser.parse_args()

def get_staged_files():
    try:
        result = subprocess.run(['git', 'diff', '--name-only', '--staged'], check=True, stdout=subprocess.PIPE)
        file_list = result.stdout.decode('utf-8').strip().split('\n')
        file_list = list(filter(None, file_list))
        file_list = [str(Path(*Path(file).parts[1:])) for file in file_list]
        return file_list
    except subprocess.CalledProcessError as e:
        print("An error occurred while trying to get staged files from git.")
        return None

def run_svelte_check():
    result = subprocess.run('npx svelte-check --tsconfig ./tsconfig.json --output machine'.split(), check=False, stdout=subprocess.PIPE)
    errors_dict = {}
    error_pattern = re.compile(r'(\d+) ERROR "(.+)" (\d+):(\d+) "(.*)"')
    for line in result.stdout.decode('utf-8').split('\n'):
        match = error_pattern.match(line)
        if match:
            _, filename, line_number, column_number, error_message = match.groups()
            if filename not in errors_dict:
                errors_dict[filename] = []
            errors_dict[filename].append({
                "line": int(line_number),
                "column": int(column_number),
                "message": error_message
            })
    return errors_dict

def fix(path, errors):
    print(f"Fixing: {path}")
    from oai import call_open_ai
    from utils import file_to_prompt

    system_prompt = """
You are an expert at fixing typescript errors in .ts and .svelte files.
"""
    prompt = f"""
You are tasked to fix the errors in this file:

{path}:

{open(path).read()}

Here are all the file paths in the codebase:

{subprocess.run('tree src -I src/lib/pyodide/'.split(), subprocess.STDOUT)}

Please return the paths of the files you want to recieve in your context
to help you fix the errors.

Respond with a JSON document in the form:

{{
    'path1': 'path/to/file1',
    'path2': 'path/to/file2',
    ...
}}
    """

    result = call_open_ai(system_prompt, prompt, { 'type': 'json_object' })
    print(result)
    result = json.loads(result)
    for k, v in result.items():
        v = v.replace('$lib', 'src/lib')
        v = v.replace('$components', 'src/components')

    prompts = '\n\n'.join([file_to_prompt(v) for v in result.values() if v != path])

    system_prompt = """
You are an expert at fixing typescript errors in .ts and .svelte files.
You output the complete fixed file from start to finish.
You output code and nothing else (not even comments, unless they were there already) also no ``` code brackets.
In Svelte templates (anything inside {...}) leave that as plain javascript.
You get paid by the token, so every token is another opportunity for more computation.
"""

    prompt = f"""

Here are some files to help you understand the codebase:

{prompts}

Here is the file that needs fixing:

{open(path).read()}

And here are the errors:

{json.dumps(errors, indent=4)}

"""
    result = call_open_ai(system_prompt, prompt)
    with open(path, 'w') as w:
        w.write(result)

def fix_path(path, svelteCheck = None):
    if svelteCheck:
        res = svelteCheck
    else:
        res = run_svelte_check()
    errors = res[path]
    print(errors)
    fix(args.fix_path, errors)

def show_path(path):
    res = run_svelte_check()
    for error in res[path]:
        print(f"  Line {error['line']}, Column {error['column']}: {error['message']}")

def show_all_errors():
    res = run_svelte_check()
    for file, errors in res.items():
        print(f"{file}:")
        for error in errors:
            print(f"  Line {error['line']}, Column {error['column']}: {error['message']}")
            print(f"There are errors in {file}")
            print("Would you like to try auto-fixing errors in this file?")
            print("You will need your OpenAI Key in OPEN_AI")
            print("You will also need the openai module installed.")
            answer = input(f"y/n: ").strip()
            if answer == 'y':
                fix(file, errors)


def pre_commit_hook():
    res = run_svelte_check()
    staged = get_staged_files()
    has_error = False
    for file in staged:
        if file not in res:
            continue
        print(f"{file}:")
        for error in res[file]:
            print(f"  Line {error['line']}, Column {error['column']}: {error['message']}")
            has_error = True
            print(f"There are errors in {file}")
    if has_error:
        sys.exit(1)

if __name__ == '__main__':
    if args.pre_commit_hook:
        pre_commit_hook()
    elif args.fix_path:
        fix_path(args.fix_path)
    elif args.show_all_errors:
        show_all_errors()