import { goto } from '$app/navigation';
import Cookies from 'js-cookie';
import { get } from 'svelte/store';
import Deepcopy from 'deep-copy';
import '$lib/node_types';
import { saveTemplate } from '$lib/templates';
import nodes from '$lib/node_register';
import { topologicalSort } from '$lib/utils';
import _ from 'lodash';
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
import { format, unwrapFunctionStore } from 'svelte-i18n';
const $__ = unwrapFunctionStore(format);

export class Dataset {
	title: string;
	slug: string;
	owner: string;
	template: string;
	timestamp: Date;
	description: string;
	graph: DependencyGraph;
	id?: string;
	projectParent?: string;

	constructor(
		projectTitle: string,
		projectSlug: string,
		ownerId: string,
		projectTemplate: string,
		projectDescription: string,
		graph: any,
		id?: string,
		projectParent?: string
	) {
		this.title = projectTitle;
		this.slug = projectSlug;
		this.owner = ownerId;
		this.template = projectTemplate;
		this.timestamp = new Date();
		this.description = projectDescription;
		this.graph = new DependencyGraph(graph.nodes, graph.edges, this);
		this.id = id;
		this.projectParent = projectParent;
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

			if (!node.data) {
				continue;
			}

			save = save || node.data.dirty;
			const node_impl = nodes.init(node.data.compute_type, node);
			try {
				nodeOutputs[node.id] = await node_impl.compute(
					inputData,
					context,
					info,
					error,
					success,
					this.slug,
					Cookies
				);
			} catch (e) {
				console.error(e);
				error(
					$__('error_running') + ' ' + node.id + ' ' + $__('please_view_console_for_more_details')
				);
			}
			this.graph.nodes.update((node) => node);
			this.graph.nodes = this.graph.nodes;
		}
		if (context == 'run' && save) await this.updateDataset(user);
	}

	async updateDataset(user: User) {
		if (user && user.uid === this.owner) {
			try {
				info($__('updating_dataset'));
				const copy = Deepcopy(this.datasetToDoc());
				this.sanitizeNodes(copy.graph.nodes);
				await updateDoc(doc(datasetCollection, this.id), copy);
				success($__('dataset_updated'));
			} catch (err) {
				error($__('error_updating_dataset'));
			}
		}
	}

	static async exists(slug: string): Promise<boolean> {
		const q = query(datasetCollection, where('slug', '==', slug));
		const querySnapshot = await getDocs(q);
		return !querySnapshot.empty;
	}

	saveAsTemplate(name: string) {
		const data = { nodes: get(this.graph.nodes), edges: get(this.graph.edges) };
		saveTemplate(name, data);
	}

	async fork(slug: string): Promise<boolean> {
		try {
			info($__('forking_dataset'));
			const dataset = new Dataset(
				this.title,
				slug,
				auth!.currentUser!.uid,
				this.template,
				this.description,
				Deepcopy({ nodes: get(this.graph.nodes), edges: get(this.graph.edges) }),
				undefined,
				this.slug
			);

			await dataset.sanitize();
			await dataset.addDatasetToFirebase();
			info($__('copying_assets'));
			await dataset.graph.copyAssets();
			info($__('saving_dataset_with_new_asset_paths'));
			await dataset.updateDataset(auth.currentUser);
			success($__('dataset_forked'));
			goto(`/report/${slug}`);
			setTimeout(() => {
				if (window) window.location.reload();
			}, 3000);
			return true;
		} catch (err) {
			error($__('error_forking_dataset'));
			return false;
		}
	}

	sanitizeNodes(nodes) {
		return nodes.map((node) => {
			for (const key in node) {
				if (!_.includes(['id', 'position', 'type', 'data', 'width', 'height'], key))
					delete node[key];
				node.data.message = '';
			}
			node.data.output = {};
			return node;
		});
	}

	sanitize() {
		this.graph.nodes.update((nodes) => this.sanitizeNodes(nodes));
	}

	async deleteDataset(): Promise<boolean> {
		this.graph.deleteAssets();
		await deleteDoc(doc(datasetCollection, this.id));
	}

	static async loadDoc(slug: string) {
		if (slug) {
			const q = query(datasetCollection, where('slug', '==', slug));
			const querySnapshot = await getDocs(q);
			if (querySnapshot.empty) {
				error(`${$__('no_dataset_was_found_with_the_provided_slug')} ${slug}`);
				return null;
			}
			const doc = querySnapshot.docs[0].data();
			return { doc: doc, id: querySnapshot.docs[0].id };
		}
	}

	static loadDatasetFromDoc(doc: Object, id: string): Promise<Dataset | null> {
		return new Dataset(
			doc.title,
			doc.slug,
			doc.owner,
			doc.template,
			doc.description,
			doc.graph,
			id,
			doc.projectParent
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
			graph: { nodes: get(this.graph.nodes), edges: get(this.graph.edges) },
			projectParent: this.projectParent
		};
	}

	static async loadDataset(slug: string): Promise<Dataset | null> {
		if (slug)
			try {
				const { doc, id } = await this.loadDoc(slug);
				const dataset = new Dataset(
					doc.title,
					doc.slug,
					doc.owner,
					doc.template,
					doc.description,
					doc.graph,
					id,
					doc.projectParent
				);
				dataset.sanitize();
				return dataset;
			} catch (e) {
				error($__('an_error_occurred_while_loading_the_dataset'));
				console.error(e);
				return null;
			}
	}

	async addDatasetToFirebase(): Promise<boolean> {
		if (!this.title || !this.slug || !this.description || !this.template) {
			error($__('please_fill_all_fields'));
			return false;
		}

		const q = query(datasetCollection, where('slug', '==', this.slug));
		const querySnapshot = await getDocs(q);
		if (!querySnapshot.empty) {
			error($__('project_slug_already_exists'));
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
				graph: { nodes: get(this.graph.nodes), edges: get(this.graph.edges) },
				projectParent: this.projectParent
			});

			this.id = docs.id;

			success($__('project_added_successfully'));
			return true;
		} catch (e) {
			error($__('an_error_occurred_while_adding_the_project'));
			console.error(e);
			return false;
		}
	}
}
