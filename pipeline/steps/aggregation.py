"""Generate a convenient JSON output file."""

from tqdm import tqdm
from typing import List
import pandas as pd
from langchain.chat_models import ChatOpenAI
import json


def aggregation(config):

    path = f"outputs/{config['output_dir']}/result.json"

    results = {
        "clusters": [],
        "comments": {},
        "translations": {},
        "overview": "",
        "config": config,
    }

    arguments = pd.read_csv(f"outputs/{config['output_dir']}/args.csv")
    arguments.set_index('arg-id', inplace=True)

    comments = pd.read_csv(f"inputs/{config['input']}.csv")
    useful_comment_ids = set(arguments['comment-id'].values)
    for _, row in comments.iterrows():
        id = row['comment-id']
        if id in useful_comment_ids:
            res = {'comment': row['comment-body']}
            numeric_cols = ['agrees', 'disagrees']
            string_cols = ['video', 'interview', 'timestamp']
            for col in numeric_cols:
                if col in row:
                    res[col] = float(row[col])
            for col in string_cols:
                if col in row:
                    res[col] = row[col]
            results['comments'][str(id)] = res

    languages = list(config.get('translation', {}).get('languages', []))
    if len(languages) > 0:
        with open(f"outputs/{config['output_dir']}/translations.json") as f:
            translations = f.read()
        results['translations'] = json.loads(translations)

    clusters = pd.read_csv(f"outputs/{config['output_dir']}/clusters.csv")
    labels = pd.read_csv(f"outputs/{config['output_dir']}/labels.csv")
    takeaways = pd.read_csv(f"outputs/{config['output_dir']}/takeaways.csv")
    takeaways.set_index('cluster-id', inplace=True)

    with open(f"outputs/{config['output_dir']}/overview.txt") as f:
        overview = f.read()
    results['overview'] = overview

    for _, row in labels.iterrows():
        cid = row['cluster-id']
        label = row['label']
        arg_rows = clusters[clusters['cluster-id'] == cid]
        arguments_in_cluster = []
        for _, arg_row in arg_rows.iterrows():
            arg_id = arg_row['arg-id']
            argument = arguments.loc[arg_id]['argument']
            comment_id = arguments.loc[arg_id]['comment-id']
            x = float(arg_row['x'])
            y = float(arg_row['y'])
            p = float(arg_row['probability'])
            obj = {
                'arg_id': arg_id,
                'argument': argument,
                'comment_id': str(comment_id),
                'x': x,
                'y': y,
                'p': p,
            }
            arguments_in_cluster.append(obj)
        results['clusters'].append({
            'cluster': label,
            'cluster_id': str(cid),
            'takeaways': takeaways.loc[cid]['takeaways'],
            'arguments': arguments_in_cluster
        })

    with open(path, 'w') as file:
        json.dump(results, file, indent=2)
