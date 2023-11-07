import csv
import json
import uuid
import pickle
import logging
import requests
import argparse


class Client:
    def __init__(self, base_url):
        if base_url.endswith("/"):
            base_url = base_url[:-1]
        self.base_url = base_url
        logging.warn(f"Client initialized with base_url: {self.base_url}")
        self.token = None
        self.session = requests.Session()

    def login(self, username, password):
        self.token = self._retrieve_token(username, password)
        if not self.token:
            raise Exception("Login failed")
        self.session.headers.update({"Authorization": f"Bearer {self.token}"})

    def _retrieve_token(self, username, password):
        boundary = f"----WebKitFormBoundary{uuid.uuid4().hex}"
        data = f"--{boundary}\r\n"
        data += 'Content-Disposition: form-data; name="username"\r\n\r\n'
        data += f"{username}\r\n"
        data += f"--{boundary}\r\n"
        data += 'Content-Disposition: form-data; name="password"\r\n\r\n'
        data += f"{password}\r\n"
        data += f"--{boundary}--\r\n"
        headers = {"Content-Type": f"multipart/form-data; boundary={boundary}"}
        response = self.session.post(
            f"{self.base_url}/token/", data=data, headers=headers
        )
        return response.json().get("access_token")

    def get(self, endpoint, *args, **kwargs):
        return self.session.get(f"{self.base_url}{endpoint}", *args, **kwargs)

    def post(self, endpoint, *args, **kwargs):
        logging.warn(f"Posting to {self.base_url}{endpoint}")
        return self.session.post(f"{self.base_url}{endpoint}", *args, **kwargs)

    def delete(self, endpoint, *args, **kwargs):
        return self.session.delete(f"{self.base_url}{endpoint}", *args, **kwargs)

    def patch(self, endpoint, *args, **kwargs):
        return self.session.patch(f"{self.base_url}{endpoint}", *args, **kwargs)


def create_dataset(client, dataset):
    exists = client.get(f"/api/db/dataset/{dataset}").status_code == 200
    if exists:
        print("Dataset already exists - deleting")
        client.delete(f"/api/db/dataset/{dataset}")
    client.post(f"/api/db/dataset/{dataset}")


# Function to ingest sources
def ingest_source(client, dataset, input_name):
    ingestion_data = []
    with open(f"inputs/{input_name}.csv", newline="", encoding="utf-8") as csvfile:
        for row in csv.DictReader(csvfile):
            ingestion_data.append(
                {
                    "id": row["comment-id"],
                    "text": row["comment-body"],
                    "timestamp": row["timestamp"],
                }
            )
    resp = client.post(
        f"/api/db/sources/{dataset}",
        data=json.dumps(ingestion_data),
        headers={"Content-Type": "application/json"},
    )
    print(resp)


# Function to ingest arguments
def ingest_arguments(client, arg_ids, arg_sources, dataset, input_name):
    argument_data = []
    with open(
        f"outputs/{input_name}/args.csv", newline="", encoding="utf-8"
    ) as csvfile:
        for row in csv.DictReader(csvfile):
            uid = uuid.uuid4().hex
            arg_ids[row["arg-id"]] = uid
            arg_sources[row["arg-id"]] = int(row["comment-id"])
            argument_data.append(
                {
                    "argument_id": uid,
                    "source_id": int(row["comment-id"]),
                    "document": row["argument"],
                }
            )
    resp = client.post(
        f"/api/db/arguments/{dataset}",
        data=json.dumps(argument_data),
        headers={"Content-Type": "application/json"},
    )
    print(resp)


# Function to ingest clusters
def ingest_clusters(client, arg_ids, arg_sources, dataset, input_name):
    cluster_data = []
    with open(
        f"outputs/{input_name}/clusters.csv", newline="", encoding="utf-8"
    ) as csvfile:
        for row in csv.DictReader(csvfile):
            if row["arg-id"] in arg_ids:
                cluster_data.append(
                    {
                        "document": "N/A",
                        "topic_id": int(row["cluster-id"]),
                        "name": "N/A",
                        "representation": "N/A",
                        "representative_docs": "[]",
                        "probability": float(row["probability"]),
                        "argument_id": arg_ids[row["arg-id"]],
                        "source_id": arg_sources[row["arg-id"]],
                        "x": float(row["x"]),
                        "y": float(row["y"]),
                        "cluster": int(row["cluster-id"]),
                    }
                )
    resp = client.post(
        f"/api/db/clusters/{dataset}",
        data=json.dumps(cluster_data),
        headers={"Content-Type": "application/json"},
    )
    print(resp)


# Function to publish labels
def ingest_labels(client, dataset, input_name):
    topic_label_data = []
    cluster_label_data = []
    with open(
        f"outputs/{input_name}/labels.csv", newline="", encoding="utf-8"
    ) as csvfile:
        for row in csv.DictReader(csvfile):
            topic_label_data.append(
                {"topic_id": int(row["cluster-id"]), "label": row["label"]}
            )
            cluster_label_data.append(
                {
                    "topic_id": int(row["cluster-id"]),
                    "cluster_id": int(row["cluster-id"]),
                    "label": row["label"],
                }
            )

    resp_topic_labels = client.post(
        f"/api/db/topic-labels/{dataset}",
        data=json.dumps(topic_label_data),
        headers={"Content-Type": "application/json"},
    )
    print(resp_topic_labels)

    resp_cluster_labels = client.post(
        f"/api/db/cluster-labels/{dataset}",
        data=json.dumps(cluster_label_data),
        headers={"Content-Type": "application/json"},
    )
    print(resp_cluster_labels)


def make_public(client, dataset):
    resp = client.get(f"/api/db/dataset/{dataset}").json()
    resp["public"] = True
    resp = client.patch(f"/api/db/dataset/{dataset}", data=json.dumps(resp))


def ingest_embeddings(client, arg_ids, dataset, input_name):
    emb_data = pickle.load(open(f"outputs/{input_name}/embeddings.pkl", "rb")).to_dict()
    kvs = [
        dict(argument_id=arg_ids[it[0]], embedding=it[1])
        for it in zip(emb_data["arg-id"].values(), emb_data["embedding"].values())
    ]
    print(client.post(f"/api/db/argument-embeddings/{dataset}", data=json.dumps(kvs)))


def parse_args():
    args = argparse.ArgumentParser()
    args.add_argument("--base_url", type=str, default="https://tttc-staging-2.link")
    args.add_argument("--username", type=str, default="admin")
    args.add_argument("--password", type=str, default="talktothecity")
    args.add_argument("--dataset", type=str, default="tttc-light")
    args.add_argument("--input_name", type=str, default="example-polis")
    args = args.parse_args()
    return args


def main():
    args = parse_args()
    client = Client(args.base_url)
    client.login(args.username, args.password)

    arg_ids = {}
    arg_sources = {}

    create_dataset(client, args.dataset)
    ingest_source(client, args.dataset, args.input_name)
    ingest_arguments(client, arg_ids, arg_sources, args.dataset, args.input_name)
    ingest_clusters(client, arg_ids, arg_sources, args.dataset, args.input_name)
    ingest_labels(client, args.dataset, args.input_name)
    make_public(client, args.dataset)
    ingest_embeddings(client, arg_ids, args.dataset, args.input_name)
    print(client.post("/api/pipeline/generate_ui_clusters/tttc-light"))


if __name__ == "__main__":
    main()
