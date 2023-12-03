import Cookies from 'js-cookie';
import { get } from 'svelte/store';
import type { User } from '$lib/types';
import { compute } from '$lib/node_types';
import { topologicalSort } from '$lib/utils';
import {
	query,
	where,
	getDocs,
	addDoc,
	doc,
	serverTimestamp,
	deleteDoc,
	updateDoc
} from 'firebase/firestore/lite';
import { auth, datasetCollection } from '$lib/firebase';
import { success, error, info } from '$components/toast/theme';
import { DependencyGraph } from '$lib/graph';

export class Dataset {
	title: string;
	slug: string;
	owner: string;
	template: string;
	timestamp: Date;
	description: string;
	graph: DependencyGraph;
	id?: string;

	constructor(
		projectTitle: string,
		projectSlug: string,
		ownerId: string,
		projectTemplate: string,
		projectDescription: string,
		graph: any,
		id?: string
	) {
		this.title = projectTitle;
		this.slug = projectSlug;
		this.owner = ownerId;
		this.template = projectTemplate;
		this.timestamp = new Date();
		this.description = projectDescription;
		this.graph = new DependencyGraph(graph.nodes, graph.edges, this);
		this.id = id;
	}

	async processNodes(context: string, user: User) {
		let nodeOutputs = {},
			save = false,
			dirtyNodes = new Set(
				get(this.graph.nodes)
					.filter((node) => node.data.dirty)
					.map((node) => node.id)
			);

		const dataset = this;

		function markDownstreamNodesAsDirty(nodeId) {
			get(dataset.graph.edges).forEach((edge) => {
				if (edge.source === nodeId && !dirtyNodes.has(edge.target)) {
					dirtyNodes.add(edge.target);
					get(dataset.graph.nodes).find((n) => n.id === nodeId).data.dirty = true;
					markDownstreamNodesAsDirty(edge.target);
				}
			});
		}

		dirtyNodes.forEach((nodeId) => markDownstreamNodesAsDirty(nodeId));

		for (let node of topologicalSort(get(this.graph.nodes), get(this.graph.edges))) {
			let inputData = {};
			get(this.graph.edges)
				.filter((edge) => edge.target === node.id)
				.forEach((edge) => {
					inputData[edge.source] = nodeOutputs[edge.source];
				});

			save = save || node.data.dirty;
			nodeOutputs[node.id] = await compute[node.data.compute_type](
				node,
				inputData,
				context,
				info,
				error,
				success,
				this.slug,
				Cookies
			);
			this.graph.nodes.update((node) => node);
			this.graph.nodes = this.graph.nodes;
		}
		if (context == 'run' && save) await this.updateDataset(user);
	}

	async updateDataset(user: User) {
		if (user.uid === this.owner) {
			try {
				info('Updating dataset...');
				const copy = JSON.parse(
					JSON.stringify({ graph: { nodes: get(this.graph.nodes), edges: get(this.graph.edges) } })
				);
				copy.graph.nodes = copy.graph.nodes.map((x) => {
					x.data.output = null;
					return x;
				});
				await updateDoc(doc(datasetCollection, this.id), copy);
				success('Dataset updated');
			} catch (err) {
				console.error('Error updating dataset: ', err);
				error('Error updating dataset');
			}
		}
	}

	async deleteDataset(): Promise<boolean> {
		this.graph.deleteAssets();
		await deleteDoc(doc(datasetCollection, this.id));
	}

	static async loadDataset(slug: string): Promise<Dataset | null> {
		try {
			const q = query(datasetCollection, where('slug', '==', slug));
			const querySnapshot = await getDocs(q);

			if (querySnapshot.empty) {
				error('No dataset found with the provided slug');
				return null;
			}

			const doc = querySnapshot.docs[0].data();
			return new Dataset(
				doc.title,
				doc.slug,
				doc.owner,
				doc.template,
				doc.description,
				doc.graph,
				querySnapshot.docs[0].id
			);
		} catch (e) {
			error('An error occurred while loading the dataset');
			console.error(e);
			return null;
		}
	}

	async addDatasetToFirebase(): Promise<boolean> {
		if (!this.title || !this.slug || !this.description || !this.template) {
			error('Please fill all fields');
			return false;
		}

		const q = query(datasetCollection, where('slug', '==', this.slug));
		const querySnapshot = await getDocs(q);
		if (!querySnapshot.empty) {
			error('Project slug already exists');
			return false;
		}

		try {
			let docs = await addDoc(datasetCollection, {
				title: this.title,
				slug: this.slug,
				owner: auth.currentUser.uid,
				template: this.template,
				timestamp: serverTimestamp(),
				description: this.description,
				graph: { nodes: get(this.graph.nodes), edges: get(this.graph.edges) }
			});

			this.id = docs.id;

			success('Project added successfully');
			return true;
		} catch (e) {
			error('An error occurred while adding the project');
			console.error(e);
			return false;
		}
	}
}
