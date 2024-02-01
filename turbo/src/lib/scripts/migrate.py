#!/usr/bin/env python3

from pathlib import Path
import subprocess
import json

def switch_preserve_value_imports(val: bool):
    tsconfig = Path('.svelte-kit/tsconfig.json')
    with tsconfig.open('r') as f:
        config = json.load(f)
        config['preserveValueImports'] = val
    with tsconfig.open('w') as f:
        json.dump(config, f, indent=2)

def migrate():
    subprocess.run(["npx",
                    "fireway",
                    "migrate",
                    "--require=ts-node/register",
                    "--path",
                    "src/migrations"])

def main():
    switch_preserve_value_imports(False)
    migrate()
    switch_preserve_value_imports(True)

if __name__ == '__main__':
    main()