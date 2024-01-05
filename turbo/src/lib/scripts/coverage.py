import json
import subprocess

subprocess.run("./src/lib/scripts/convert-svelte-to-tsx.cjs")

result = subprocess.run(
    ["npx", "type-coverage", "-p", "tsconfig.json", "--json-output"],
    capture_output=True,
    text=True,
)

if result.returncode == 0:
    json_data = json.loads(result.stdout)
    with open('package.json') as f:
        package_json = json.load(f)
        package_json['tsCoverage'] = f'{int(json_data["percent"])}%'
    with open('package.json', 'w') as f:
        json.dump(package_json, f, indent='\t')
