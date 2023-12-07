import { goto } from '$app/navigation';
import Cookies from 'js-cookie';
import { get } from 'svelte/store';
import Deepcopy from 'deep-copy';
import '$lib/node_types';
import nodes from '$lib/node_register';
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
			const node_impl = nodes.init(node.data.compute_type, node);
			nodeOutputs[node.id] = await node_impl.compute(
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
		if (user && user.uid === this.owner) {
			try {
				info('Updating dataset...');
				const copy = JSON.parse(
					JSON.stringify({
						graph: { nodes: get(this.graph.nodes), edges: get(this.graph.edges) }
					})
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

	static async exists(slug: string): Promise<boolean> {
		const q = query(datasetCollection, where('slug', '==', slug));
		const querySnapshot = await getDocs(q);
		return !querySnapshot.empty;
	}

	async fork(slug: string): Promise<boolean> {
		try {
			info('Forking dataset...');
			const dataset = new Dataset(
				this.title,
				slug,
				auth!.currentUser!.uid,
				this.template,
				this.description,
				Deepcopy({ nodes: get(this.graph.nodes), edges: get(this.graph.edges) })
			);

			await dataset.sanitize();
			await dataset.addDatasetToFirebase();
			info('Copying assets...');
			await dataset.graph.copyAssets();
			info('Saving dataset with new asset paths...');
			await dataset.updateDataset(auth.currentUser);
			success('Dataset forked');
			goto(`/report/${slug}`);
			return true;
		} catch (err) {
			console.error('Error forking dataset: ', err);
			error('Error forking dataset');
			return false;
		}
	}

	sanitize() {
		this.graph.nodes.update((nodes) =>
			nodes.map((node) => {
				for (const key in node) {
					if (key !== 'id' && key !== 'position' && key !== 'type' && key !== 'data') {
						delete node[key];
					}
				}
				delete node.data.output;
				return node;
			})
		);
	}

	async deleteDataset(): Promise<boolean> {
		this.graph.deleteAssets();
		await deleteDoc(doc(datasetCollection, this.id));
	}

	static async loadDoc(slug: string) {
		const q = query(datasetCollection, where('slug', '==', slug));
		const querySnapshot = await getDocs(q);
		if (querySnapshot.empty) {
			error('No dataset found with the provided slug');
			return null;
		}
		const doc = querySnapshot.docs[0].data();
		return { doc: doc, id: querySnapshot.docs[0].id };
	}

	static loadDatasetFromDoc(doc: Object, id: string): Promise<Dataset | null> {
		return new Dataset(
			doc.title,
			doc.slug,
			doc.owner,
			doc.template,
			doc.description,
			doc.graph,
			id
		);
	}

	datasetToDoc(): Object {
		return {
			title: this.title,
			slug: this.slug,
			owner: this.owner,
			template: this.template,
			timestamp: this.timestamp,
			description: this.description,
			graph: { nodes: get(this.graph.nodes), edges: get(this.graph.edges) }
		};
	}

	static async loadDataset(slug: string): Promise<Dataset | null> {
		try {
			const { doc, id } = await this.loadDoc(slug);
			return new Dataset(
				doc.title,
				doc.slug,
				doc.owner,
				doc.template,
				doc.description,
				doc.graph,
				id
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
