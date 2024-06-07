import os
import json
from tqdm import tqdm
import pandas as pd
from langchain.chat_models import ChatOpenAI
from utils import messages, update_progress
import concurrent.futures


def extraction(config):
    dataset = config['output_dir']
    path = f"outputs/{dataset}/args.csv"
    comments = pd.read_csv(f"inputs/{config['input']}.csv")

    model = config['extraction']['model']
    prompt = config['extraction']['prompt']
    workers = config['extraction']['workers']
    limit = config['extraction']['limit']

    comment_ids = (comments['comment-id'].values)[:limit]
    comments.set_index('comment-id', inplace=True)
    results = pd.DataFrame()
    update_progress(config, total=len(comment_ids))
    for i in tqdm(range(0, len(comment_ids), workers)):
        batch = comment_ids[i: i + workers]
        batch_inputs = [comments.loc[id]['comment-body'] for id in batch]
        batch_results = extract_batch(batch_inputs, prompt, model, workers)
        for comment_id, extracted_args in zip(batch, batch_results):
            for j, arg in enumerate(extracted_args):
                new_row = {"arg-id": f"A{comment_id}_{j}",
                           "comment-id": int(comment_id), "argument": arg}
                results = pd.concat(
                    [results, pd.DataFrame([new_row])], ignore_index=True)
        update_progress(config, incr=len(batch))
    results.to_csv(path, index=False)


def extract_batch(batch, prompt, model, workers):
    with concurrent.futures.ThreadPoolExecutor(max_workers=workers) as executor:
        futures = [executor.submit(
            extract_arguments, input, prompt, model) for input in list(batch)]
        concurrent.futures.wait(futures)
        return [future.result() for future in futures]


def extract_arguments(input, prompt, model, retries=3):
    llm = ChatOpenAI(model_name=model, temperature=0.0)
    response = llm(messages=messages(prompt, input)).content.strip()
    try:
        obj = json.loads(response)
        # LLM sometimes returns valid JSON string
        if isinstance(obj, str):
            obj = [obj]
        items = [a.strip() for a in obj]
        items = filter(None, items)  # omit empty strings
        return items
    except json.decoder.JSONDecodeError as e:
        print("JSON error:", e)
        print("Input was:", input)
        print("Response was:", response)
        if retries > 0:
            print("Retrying...")
            return extract_arguments(input, prompt, model, retries - 1)
        else:
            print("Silently giving up on trying to generate valid list.")
            return []
