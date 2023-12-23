"""Create summaries for the clusters."""

from tqdm import tqdm
import os
from typing import List
import numpy as np
import pandas as pd
from langchain.chat_models import ChatOpenAI
from utils import messages, update_progress


def takeaways(config):
    dataset = config['output_dir']
    path = f"outputs/{dataset}/takeaways.csv"

    arguments = pd.read_csv(f"outputs/{dataset}/args.csv")
    clusters = pd.read_csv(f"outputs/{dataset}/clusters.csv")

    results = pd.DataFrame()

    sample_size = config['takeaways']['sample_size']
    prompt = config['takeaways']['prompt']
    model = config['takeaways']['model']

    model = config.get('model_takeaways', config.get('model', 'gpt3.5-turbo'))
    cluster_ids = clusters['cluster-id'].unique()

    update_progress(config, total=len(cluster_ids))

    for _, cluster_id in tqdm(enumerate(cluster_ids), total=len(cluster_ids)):
        args_ids = clusters[clusters['cluster-id']
                            == cluster_id]['arg-id'].values
        args_ids = np.random.choice(args_ids, size=min(
            len(args_ids), sample_size), replace=False)
        args_sample = arguments[arguments['arg-id']
                                .isin(args_ids)]['argument'].values
        label = generate_takeaways(args_sample, prompt, model)
        results = pd.concat([results, pd.DataFrame(
            [{'cluster-id': cluster_id, 'takeaways': label}])], ignore_index=True)
        update_progress(config, incr=1)

    results.to_csv(path, index=False)


def generate_takeaways(args_sample, prompt, model):
    llm = ChatOpenAI(model_name=model, temperature=0.0)
    input = "\n".join(args_sample)
    response = llm(messages=messages(prompt, input)).content.strip()
    return response
