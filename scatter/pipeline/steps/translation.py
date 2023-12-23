
import json
from tqdm import tqdm
import pandas as pd
from langchain.chat_models import ChatOpenAI
from utils import messages
from langchain.schema import AIMessage
import pandas as pd
import json
from tqdm import tqdm


def translation(config):

    dataset = config['output_dir']
    path = f"outputs/{dataset}/translations.json"
    results = {}

    languages = list(config.get('translation', {}).get('languages', []))
    if len(languages) == 0:
        print("No languages specified. Skipping translation step.")
        # creating an empty file any, to reduce special casing later
        with open(path, 'w') as file:
            json.dump(results, file, indent=2)
        return

    arguments = pd.read_csv(f"outputs/{dataset}/args.csv")
    labels = pd.read_csv(f"outputs/{dataset}/labels.csv")
    takeaways = pd.read_csv(f"outputs/{dataset}/takeaways.csv")
    with open(f"outputs/{dataset}/overview.txt") as f:
        overview = f.read()

    UI_copy = ["Argument", "Original comment", "Representative arguments",
               "Open full-screen map", "Back to report", "Hide labels", "Show labels",
               "Show filters", "Hide filters", "Min. votes", "Consensus",
               "Showing", "arguments", "Reset zoom", "Click anywhere on the map to close this",
               "Click on the dot for details",
               "agree", "disagree", "Language", "English", "arguments", "of total",
               "Overview", "Cluster analysis", "Representative comments", "Introduction",
               "Clusters", "Appendix", "This report was generated using an AI pipeline that consists of the following steps",
               "Step", "extraction", "show code", "hide code", "show prompt", "hide prompt", "embedding",
               "clustering", "labelling", "takeaways", "overview"]

    arg_list = arguments['argument'].to_list() + \
        labels['label'].to_list() + \
        UI_copy + \
        languages

    if 'name' in config:
        arg_list.append(config['name'])
    if 'question' in config:
        arg_list.append(config['question'])

    prompt_file = config.get('translation_prompt', 'default')
    with open(f"prompts/translation/{prompt_file}.txt") as f:
        prompt = f.read()
    model = config['model']

    config['translation_prompt'] = prompt

    translations = [translate_lang(
        arg_list, 10, prompt, lang, model) for lang in languages]

    # handling long takeaways differently, WITHOUT batching too much
    long_arg_list = takeaways['takeaways'].to_list()
    long_arg_list.append(overview)
    if 'intro' in config:
        long_arg_list.append(config['intro'])

    long_translations = [translate_lang(
        long_arg_list, 1, prompt, lang, model) for lang in languages]

    for i, id in enumerate(arg_list):
        print('i, id', i, id)
        results[str(id)] = list([t[i] for t in translations])
    for i, id in enumerate(long_arg_list):
        results[str(id)] = list([t[i] for t in long_translations])

    with open(path, 'w') as file:
        json.dump(results, file, indent=2)


def translate_lang(arg_list, batch_size, prompt, lang, model):
    translations = []
    lang_prompt = prompt.replace("{language}", lang)
    print(f"Translating to {lang}...")
    for i in tqdm(range(0, len(arg_list), batch_size)):
        batch = arg_list[i: i + batch_size]
        translations.extend(translate_batch(batch, lang_prompt, model))
    return translations


def translate_batch(batch, lang_prompt, model, retries=3):
    llm = ChatOpenAI(model_name=model, temperature=0.0)
    input = json.dumps(list(batch))
    response = llm(messages=messages(lang_prompt, input)).content.strip()
    if "```" in response:
        response = response.split("```")[1]
    if response.startswith("json"):
        response = response[4:]
    try:
        parsed = [a.strip() for a in json.loads(response)]
        if len(parsed) != len(batch):
            print("Warning: batch size mismatch!")
            print("Batch len:", len(batch))
            print("Response len:", len(parsed))
            for i, item in enumerate(batch):
                print(f"Batch item {i}:", item)
                if (i < len(parsed)):
                    print("Response:", parsed[i])
            if (len(batch) > 1):
                print("Retrying with smaller batches...")
                mid = len(batch) // 2
                return translate_batch(batch[:mid], lang_prompt, model, retries - 1) + \
                    translate_batch(
                        batch[mid:], lang_prompt, model, retries - 1)
            else:
                print("Retrying batch...")
                return translate_batch(batch, lang_prompt, model, retries - 1)
        else:
            return parsed
    except json.decoder.JSONDecodeError as e:
        print("JSON error:", e)
        print("Response was:", response)
        if retries > 0:
            print("Retrying batch...")
            return translate_batch(batch, lang_prompt, model, retries - 1)
        else:
            raise e
