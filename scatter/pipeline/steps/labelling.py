"""Create labels for the clusters."""

from tqdm import tqdm
from typing import List
import numpy as np
import pandas as pd
from langchain.chat_models import ChatOpenAI
from utils import messages, update_progress


def labelling(config):
    dataset = config['output_dir']
    path = f"outputs/{dataset}/labels.csv"

    arguments = pd.read_csv(f"outputs/{dataset}/args.csv")
    clusters = pd.read_csv(f"outputs/{dataset}/clusters.csv")

    results = pd.DataFrame()

    sample_size = config['labelling']['sample_size']
    prompt = config['labelling']['prompt']
    model = config['labelling']['model']

    question = config['question']
    cluster_ids = clusters['cluster-id'].unique()

    update_progress(config, total=len(cluster_ids))

    for _, cluster_id in tqdm(enumerate(cluster_ids), total=len(cluster_ids)):
        args_ids = clusters[clusters['cluster-id']
                            == cluster_id]['arg-id'].values
        args_ids = np.random.choice(args_ids, size=min(
            len(args_ids), sample_size), replace=False)
        args_sample = arguments[arguments['arg-id']
                                .isin(args_ids)]['argument'].values

        args_ids_outside = clusters[clusters['cluster-id']
                                    != cluster_id]['arg-id'].values
        args_ids_outside = np.random.choice(args_ids_outside, size=min(
            len(args_ids_outside), sample_size), replace=False)
        args_sample_outside = arguments[arguments['arg-id']
                                        .isin(args_ids_outside)]['argument'].values

        label = generate_label(question, args_sample,
                               args_sample_outside, prompt, model)
        results = pd.concat([results, pd.DataFrame(
            [{'cluster-id': cluster_id, 'label': label}])], ignore_index=True)
        update_progress(config, incr=1)

    results.to_csv(path, index=False)


def generate_label(question, args_sample, args_sample_outside, prompt, model):
    llm = ChatOpenAI(model_name=model, temperature=0.0)
    outside = '\n * ' + '\n * '.join(args_sample_outside)
    inside = '\n * ' + '\n * '.join(args_sample)
    input = f"Question of the consultation:{question}\n\n" + \
        f"Examples of arguments OUTSIDE the cluster:\n {outside}" + \
        f"Examples of arguments INSIDE the cluster:\n {inside}"
    response = llm(messages=messages(prompt, input)).content.strip()
    return response
