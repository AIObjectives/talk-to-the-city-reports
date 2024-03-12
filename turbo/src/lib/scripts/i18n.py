import json
from glob import glob
import os
from pathlib import Path
from oai import call_open_ai
import argparse

"""
This script performs the following:
- loads the i18n translation files
- uses en-US.json as the reference language
- uses the other language files as the target language
- looks for missing keys (keys that are in en-US.json but not in the target language file)
- translates the missing keys using OpenAI's GPT-4
- writes the translated keys to the target language file
"""

files = glob("src/lib/i18n/*.json")
en_us_file = "src/lib/i18n/en-US.json"
files.remove(en_us_file)


def load_json(file):
    with open(file, "r") as f:
        return json.load(f)


languages = {
    "src/lib/i18n/ja-JP.json": "Japanese",
    "src/lib/i18n/zh-TW.json": "Traditional Chinese for Taiwanese users",
}

tr = load_json(en_us_file)

for file in files:
    print(file)
    tr2 = load_json(file)
    for key in tr:
        if key not in tr2:
            prompt = f"""Please translate the following to {languages[file]}. Respond with the translation and nothing else.

{tr[key]}
"""
            print(f"Translating {key}...")
            tr2[key] = call_open_ai(prompt=prompt, system_prompt="")
            print(tr2[key])
    with open(file, "w") as f:
        json.dump(tr2, f, indent=2, ensure_ascii=False)
    print(f"Updated {file}")
