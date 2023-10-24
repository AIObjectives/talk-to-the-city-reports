"""Cluster the arguments using UMAP + HDBSCAN and GPT-4."""

import pandas as pd
import numpy as np
from importlib import import_module


def clustering(config):
    dataset = config['output_dir']
    path = f"outputs/{dataset}/clusters.csv"
    arguments_df = pd.read_csv(f"outputs/{dataset}/args.csv")
    arguments_array = arguments_df["argument"].values

    embeddings_df = pd.read_pickle(f"outputs/{dataset}/embeddings.pkl")
    embeddings_array = np.asarray(embeddings_df["embedding"].values.tolist())
    clusters = config['clustering']['clusters']

    result = cluster_embeddings(
        docs=arguments_array,
        embeddings=embeddings_array,
        metadatas={
            "arg-id": arguments_df["arg-id"].values,
            "comment-id": arguments_df["comment-id"].values,
        },
        n_topics=clusters,
    )
    result.to_csv(path, index=False)


def cluster_embeddings(
    docs,
    embeddings,
    metadatas,
    min_cluster_size=2,
    n_components=2,
    n_topics=6,
):
    # (!) we import the following modules dynamically for a reason
    # (they are slow to load and not required for all pipelines)
    SpectralClustering = import_module('sklearn.cluster').SpectralClustering
    stopwords = import_module('nltk.corpus').stopwords
    HDBSCAN = import_module('hdbscan').HDBSCAN
    UMAP = import_module('umap').UMAP
    CountVectorizer = import_module(
        'sklearn.feature_extraction.text').CountVectorizer
    BERTopic = import_module('bertopic').BERTopic

    umap_model = UMAP(
        random_state=42,
        n_components=n_components,
    )
    hdbscan_model = HDBSCAN(min_cluster_size=min_cluster_size)

    stop = stopwords.words("english")
    vectorizer_model = CountVectorizer(stop_words=stop)
    topic_model = BERTopic(
        umap_model=umap_model,
        hdbscan_model=hdbscan_model,
        vectorizer_model=vectorizer_model,
        verbose=True,
    )

    # Fit the topic model.
    _, __ = topic_model.fit_transform(docs, embeddings=embeddings)

    n_samples = len(embeddings)
    n_neighbors = min(n_samples - 1, 10)
    spectral_model = SpectralClustering(
        n_clusters=n_topics,
        affinity="nearest_neighbors",
        n_neighbors=n_neighbors,  # Use the modified n_neighbors
        random_state=42
    )
    umap_embeds = umap_model.fit_transform(embeddings)
    cluster_labels = spectral_model.fit_predict(umap_embeds)

    result = topic_model.get_document_info(
        docs=docs,
        metadata={
            **metadatas,
            "x": umap_embeds[:, 0],
            "y": umap_embeds[:, 1],
        },
    )

    result.columns = [c.lower() for c in result.columns]
    result = result[['arg-id', 'x', 'y', 'probability']]
    result['cluster-id'] = cluster_labels

    return result
