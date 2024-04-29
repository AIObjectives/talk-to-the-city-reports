import { refreshStore } from '$lib/store';
import { type User } from 'firebase/auth';
import { goto } from '$app/navigation';
import Cookies from 'js-cookie';
import { get } from 'svelte/store';
import Deepcopy from 'deep-copy';
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
import { pipelineStepsRemaining, globalViewMode } from '$lib/store';
import { logger } from '$lib/logger';

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
  enableForking: boolean = true;
  isPrivate: boolean = false;

  constructor(
    projectTitle: string,
    projectSlug: string,
    ownerId: string,
    projectTemplate: string,
    projectDescription: string,
    graph: any,
    id?: string,
    projectParent?: string,
    enableForking: boolean = true,
    isPrivate: boolean = false
  ) {
    this.title = projectTitle;
    this.slug = projectSlug;
    this.owner = ownerId;
    this.template = projectTemplate;
    this.timestamp = new Date();
    this.description = projectDescription;
    this.graph = new DependencyGraph(graph?.nodes, graph?.edges, this);
    this.id = id;
    this.projectParent = projectParent;
    this.enableForking = enableForking;
    this.isPrivate = isPrivate;
  }

  propagateDirtyState() {
    const dataset = this;
    const dirtyNodes = new Set(
      get(this.graph.nodes)
        .filter((node) => node.data.dirty)
        .map((node) => node.id)
    );

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
    return dirtyNodes;
  }

  refresh() {
    this.graph.nodes.update((node) => node);
    this.graph.nodes = this.graph.nodes;
    refreshStore.set(Math.random());
  }

  independentSets(sortedNodes, edges) {
    const independentNodeSets = [];
    const nodeDependencies = new Map();

    for (const node of sortedNodes) {
      nodeDependencies.set(node.id, 0);
    }

    for (const edge of edges) {
      if (nodeDependencies.has(edge.target)) {
        nodeDependencies.set(edge.target, nodeDependencies.get(edge.target) + 1);
      }
    }

    while (nodeDependencies.size > 0) {
      const currentSet = Array.from(nodeDependencies.entries())
        .filter(([nodeId, count]) => count === 0)
        .map(([nodeId]) => sortedNodes.find((node) => node.id === nodeId));

      if (currentSet.length === 0) {
        throw new Error('Cyclic dependency detected or missing nodes.');
      }

      independentNodeSets.push(currentSet);

      for (const node of currentSet) {
        nodeDependencies.delete(node.id);
        edges
          .filter((edge) => edge.source === node.id)
          .forEach((edge) => {
            if (nodeDependencies.has(edge.target)) {
              nodeDependencies.set(edge.target, nodeDependencies.get(edge.target) - 1);
            }
          });
      }
    }

    return independentNodeSets;
  }

  getDirtyUINodes() {
    if (get(globalViewMode) === 'standard')
      return get(this.graph.nodes).filter((node) => node.data.dirty && node.data.show_in_ui);
    else return get(this.graph.nodes).filter((node) => node.data.dirty);
  }

  async processNodes(context: string, user: User, save = false, refreshData = null) {
    this.propagateDirtyState();
    if (context == 'run') pipelineStepsRemaining.set(this.getDirtyUINodes().length);
    const nodeOutputs = {};
    let shouldSave = false;

    // load speed optimization:
    // report_v1 gets to front-run the rest of the nodes
    const report_v1 = this.graph.findByComputeType('report_v1');
    if (!_.isEmpty(report_v1) && refreshData) {
      const report_v1_impl = nodes.init('report_v1', report_v1[0].node);
      const result = await report_v1_impl.compute(
        {},
        context,
        info,
        error,
        success,
        this.slug,
        Cookies
      );
      this.graph.nodes.update((nodes) => {
        const nodeToUpdate = nodes.find((n) => n.id === report_v1_impl.id);
        nodeToUpdate.data.output = result;
        nodeToUpdate.data.dirty = false;
        return nodes;
      });
      if (refreshData) refreshData();
    }

    const independentNodeSets = this.independentSets(
      topologicalSort(get(this.graph.nodes), get(this.graph.edges)),
      get(this.graph.edges)
    );

    for (const nodeSet of independentNodeSets) {
      const inputData = {};
      for (const node of nodeSet) {
        get(this.graph.edges)
          .filter((edge) => edge.target === node.id)
          .forEach((edge) => {
            const outputData = edge.sourceHandle
              ? nodeOutputs[edge.source]?.[edge.sourceHandle]
              : nodeOutputs[edge.source];
            if (outputData !== undefined) {
              if (inputData[node.id] === undefined) {
                inputData[node.id] = {};
              }
              if (edge.sourceHandle)
                inputData[node.id][edge.source + '|' + edge.sourceHandle] = outputData;
              else inputData[node.id][edge.source] = outputData;
            }
          });
      }

      const innerPromises = nodeSet.map((node) =>
        (async () => {
          shouldSave = shouldSave || node.data.dirty;
          const node_impl = nodes.init(node.data.compute_type, node);
          const { info, error, success } = logger(node);

          try {
            if (context == 'run' && node.data.logs?.length > 0) node.data.logs = [];
            this.graph.nodes.update((nodes) => {
              const nodeToUpdate = nodes.find((n) => n.id === node.id);
              nodeToUpdate.data.processing = true;
              return nodes;
            });
            if (node.data.dirty && context == 'run') {
              pipelineStepsRemaining.set(this.getDirtyUINodes().length);
            }
            const result = await node_impl.compute(
              inputData[node.id],
              context,
              info,
              error,
              success,
              this.slug,
              Cookies,
              this
            );
            this.graph.nodes.update((nodes) => {
              const nodeToUpdate = nodes.find((n) => n.id === node.id);
              nodeToUpdate.data.processing = false;
              nodeToUpdate.data.output = result;
              nodeToUpdate.data.dirty = false;
              return nodes;
            });
            const obj = {
              id: node.id,
              output: result
            };
            return obj;
          } catch (e) {
            console.error(e);
            error(
              $__('error_running') +
                ' ' +
                node.id +
                ' ' +
                $__('please_view_console_for_more_details'),
              e
            );
            this.graph.nodes.update((nodes) => {
              const nodeToUpdate = nodes.find((n) => n.id === node.id);
              nodeToUpdate.data.processing = false;
              nodeToUpdate.data.output = undefined;
              nodeToUpdate.data.dirty = true;
              if (!_.isEmpty(e)) nodeToUpdate.data.log.push(JSON.stringify(e));
              return nodes;
            });
          }
        })()
      );

      const results = await Promise.all(innerPromises);

      for (const result of results) {
        if (result !== undefined) {
          nodeOutputs[result.id] = result.output;
        }
      }
    }
    await this.refresh();

    if (context == 'run') {
      pipelineStepsRemaining.set(0);
      success($__('pipeline_run_complete'));
      if (save && shouldSave) await this.updateDataset(user);
    }
  }

  async updateDataset(user: User, notify = true) {
    if (user && (user.uid === this.owner || user.uid == import.meta.env.VITE_ADMIN)) {
      try {
        if (notify) info($__('updating_dataset'));
        let copy: any = Deepcopy(this.datasetToDoc());
        if (copy.template === undefined) {
          copy.template = '';
        }
        this.sanitizeNodes(copy.graph.nodes);
        copy = JSON.parse(JSON.stringify(copy));
        await updateDoc(doc(datasetCollection, this.id), copy);
        if (notify) success($__('dataset_updated'));
      } catch (err) {
        console.error(err);
        if (notify) error($__('error_updating_dataset'));
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
    if (!this.enableForking) {
      error($__('forking_disabled'));
      return false;
    }
    try {
      info($__('forking_dataset'));
      let copy = Deepcopy(this.datasetToDoc());
      if (copy.template === undefined) {
        copy.template = '';
      }
      this.sanitizeNodes(copy.graph.nodes);
      copy = JSON.parse(JSON.stringify(copy));
      const dataset = new Dataset(
        this.title,
        slug,
        auth!.currentUser!.uid,
        this.template,
        this.description,
        Deepcopy({ nodes: copy.graph.nodes, edges: copy.graph.edges }),
        undefined,
        this.slug
      );

      await dataset.sanitize();
      info($__('copying_assets'));
      await dataset.graph.copyAssets(this.slug, slug);
      info($__('saving_dataset_with_new_asset_paths'));
      await dataset.addDatasetToFirebase();
      success($__('dataset_forked'));
      goto(`/report/${slug}`);
      setTimeout(() => {
        if (window) window.location.reload();
      }, 3000);
      return true;
    } catch (err) {
      error($__('error_forking_dataset'));
      console.error(err);
      return false;
    }
  }

  clearLogs() {
    this.graph.nodes.update((nodes) => {
      nodes.forEach((node) => {
        node.data.log = [];
      });
      return nodes;
    });
  }

  sanitizeNodes(nodes) {
    return nodes.map((node) => {
      for (const key in node) {
        if (!_.includes(['id', 'position', 'type', 'data', 'width', 'height'], key))
          delete node[key];
      }
      node.data.output = {};
      if (node.data.cache) node.data.cache = {};
      node.data.log = [];
      return node;
    });
  }

  sanitize() {
    this.graph.nodes.update((nodes) => this.sanitizeNodes(nodes));
  }

  async deleteDataset() {
    await this.graph.deleteAssets();
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
      doc.projectParent,
      doc.enableForking,
      doc.isPrivate
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
      projectParent: this.projectParent,
      enableForking: this.enableForking,
      isPrivate: this.isPrivate
    };
  }

  getNodeById(id: string) {
    return get(this.graph.nodes).find((node) => node.id === id);
  }

  static async loadDataset(slug: string): Promise<Dataset | null> {
    if (slug)
      try {
        const fbDoc = await this.loadDoc(slug);
        if (!_.isEmpty(fbDoc)) {
          const { doc, id } = fbDoc;
          const dataset = new Dataset(
            doc.title,
            doc.slug,
            doc.owner,
            doc.template,
            doc.description,
            doc.graph,
            id,
            doc.projectParent,
            doc.enableForking,
            doc.isPrivate
          );
          dataset.sanitize();
          await dataset.graph.conform(false, false, false);
          // console.log('nodes', get(dataset.graph.nodes));
          // console.log('edges', get(dataset.graph.edges));
          return dataset;
        }
      } catch (e) {
        error($__('an_error_occurred_while_loading_the_dataset'));
        console.error(e);
        return null;
      }
  }

  async addDatasetToFirebase(): Promise<boolean> {
    if (!this.title || !this.slug || !this.description) {
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
      const docs = await addDoc(datasetCollection, {
        title: this.title,
        slug: this.slug,
        owner: auth.currentUser.uid,
        template: this.template,
        timestamp: serverTimestamp(),
        description: this.description,
        graph: { nodes: get(this.graph.nodes), edges: get(this.graph.edges) },
        projectParent: this.projectParent,
        enableForking: this.enableForking,
        isPrivate: this.isPrivate
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
