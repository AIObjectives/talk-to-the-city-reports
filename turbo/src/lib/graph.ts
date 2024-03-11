import { getAuth } from 'firebase/auth';
import { tick } from 'svelte';
import type { Node, Edge } from '@xyflow/svelte';
import { DGNode } from '$lib/node';
import deepCopy from 'deep-copy';
import type { Writable } from 'svelte/store';
import { writable, get } from 'svelte/store';
import nodesRegister from '$lib/node_register';
import { getLayoutedElements, elkOptions } from '$lib/elk';
import { db } from '$lib/firebase';
import { getStorage, ref as storageRef, deleteObject } from 'firebase/storage';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore/lite';
import { feedbackCollection } from '$lib/firebase';
import { listAll } from 'firebase/storage';
import _ from 'lodash';

async function onLayout(direction: string, useInitialNodes = false, nodes, edges) {
  const opts = { 'elk.direction': direction, ...elkOptions };
  const ns = get(nodes);
  const es = get(edges);
  await getLayoutedElements(ns, es, opts).then(({ nodes: layoutedNodes, edges: layoutedEdges }) => {
    nodes.set(layoutedNodes);
    edges.set(layoutedEdges);
  });
  await tick();
}

function customizer(objValue, srcValue) {
  if (_.isArray(objValue)) {
    return srcValue;
  }
  if (_.isObject(objValue)) {
    return _.mergeWith({}, objValue, srcValue, customizer);
  }
}

function deepDiff(obj1, obj2) {
  function difference(object, base) {
    function changes(object, base) {
      return _.transform(object, (result, value, key) => {
        if (!_.isEqual(value, base[key])) {
          result[key] =
            _.isObject(value) && _.isObject(base[key]) ? changes(value, base[key]) : value;
        }
      });
    }
    return changes(object, base);
  }

  const leftDiff = difference(obj1, obj2);
  const rightDiff = difference(obj2, obj1);

  return { leftDiff, rightDiff };
}

export class DependencyGraph {
  nodes: Writable<Node[]>;
  edges: Writable<Edge[]>;
  parent: any; // dataset

  constructor(nodes: [Node], edges: [Edge], parent: any) {
    this.nodes = writable<Node[]>(nodes ? nodes : []);
    this.edges = writable<Edge[]>(edges ? edges : []);
    this.parent = parent;
  }

  conform = async (dryRun = true, save = false, doLayout = true) => {
    let log = '';
    const nodes = get(this.nodes);
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const initial_data = nodesRegister.data[node.data.compute_type];
      const merged = _.mergeWith({}, initial_data.data, node.data, customizer);
      const { leftDiff, rightDiff } = deepDiff(node.data, merged);
      // log += 'data: ' + JSON.stringify(node.data, null, 2) + '\n';
      // log += 'initial: ' + JSON.stringify(initial_data.data, null, 2) + '\n';

      if (!_.isEmpty(rightDiff)) {
        log += node.id + ' differences when comparing document to merged:\n';
        log += rightDiff ? JSON.stringify(rightDiff, null, 2) : 'None';
        log += '\n';
        if (!dryRun) {
          node.data = merged;
          this.nodes.set(nodes);
        }
      }
      const edges = get(this.edges);
      const inputEdges = edges.filter((edge) => edge.target == node.id);
      inputEdges.forEach(async (edge) => {
        const source = edge.source;
        const vals = _.pickBy(node.data.input_ids, (v, k) => {
          return v == source;
        });
        if (!_.isEmpty(vals)) {
          const val = _.head(_.keys(vals));
          if (val && val != edge.targetHandle) {
            log += `Setting ${node.id} source edge targetHandle to ${val}\n`;
            if (!dryRun) edge.targetHandle = val;
          }
        }
        await tick();
      });
      if (!dryRun) this.edges.set(edges);

      log += '...............\n';
    }
    log += 'Laying out the graph';
    if (!dryRun && doLayout) {
      await onLayout('RIGHT', true, this.nodes, this.edges);
    }
    if (!dryRun && save) {
      await this.parent.updateDataset({ uid: this.parent.owner }, false);
    }
  };

  findByComputeType = (computeType: string): DGNode[] => {
    const nodes = get(this.nodes).filter((node) => node.data.compute_type === computeType);
    return nodes.map((node) => new DGNode(node, this));
  };

  find = (id: string): DGNode => {
    const node = get(this.nodes).find((node) => node.id === id);
    if (node) return new DGNode(node, this);
  };

  findImpl(id: string) {
    const node = get(this.nodes).find((node) => node.id === id);
    if (node) return nodesRegister.init(node.data.compute_type, node);
  }

  duplicateSelectedNodes = () => {
    const selectedNodes = get(this.nodes).filter((node) => node.selected);
    const oldToNewIdMap = new Map();
    const newNodes = selectedNodes.map((node) => {
      const newNode = deepCopy(node);
      const nodeNameParts = node.id.split('_');
      const nodeName = nodeNameParts.slice(0, -1).join('_');
      const newId = `${nodeName}_${Math.floor(Math.random() * 1000000)}`; // Generate a random number between 0 and 999999
      newNode.id = newId;
      newNode.position.x += 1000;
      newNode.selected = false;
      oldToNewIdMap.set(node.id, newNode.id);
      return newNode;
    });

    const newEdges = get(this.edges)
      .map((edge) => {
        const sourceIsSelected = oldToNewIdMap.has(edge.source);
        const targetIsSelected = oldToNewIdMap.has(edge.target);
        if (sourceIsSelected || targetIsSelected) {
          const newEdge = deepCopy(edge);
          newEdge.id = Math.random().toString(36).substring(7);
          if (sourceIsSelected) {
            newEdge.source = oldToNewIdMap.get(edge.source);
          }
          if (targetIsSelected) {
            newEdge.target = oldToNewIdMap.get(edge.target);
          }
          return newEdge;
        }
        return undefined;
      })
      .filter((edge) => edge !== undefined);
    this.nodes.update(($nodes) => [...$nodes, ...newNodes]);
    this.edges.update(($edges) => [...$edges, ...newEdges]);
  };

  listAssets = (dirRef = null) => {
    const auth = getAuth();
    const uid = auth.currentUser.uid;
    const storage = getStorage();
    const pathPrefix = `uploads/${uid}/${this.parent.slug}/`;
    if (!dirRef) dirRef = storageRef(storage, pathPrefix);
    const assets = [];
    const collectAssets = (dirRef) => {
      return listAll(dirRef).then((res) => {
        res.items.forEach((itemRef) => {
          assets.push(itemRef.fullPath);
        });
        const dirPromises = res.prefixes.map((prefixRef) => {
          return collectAssets(storageRef(storage, prefixRef.fullPath));
        });
        return Promise.all(dirPromises);
      });
    };
    return collectAssets(dirRef).then(() => {
      return assets;
    });
  };

  deleteAssets = async () => {
    const auth = getAuth();
    const storage = getStorage();
    const uid = auth.currentUser.uid;
    const pathPrefix = `uploads/${uid}/${this.parent.slug}/`;
    const dirRef = storageRef(storage, pathPrefix);

    this.listAssets(dirRef)
      .then((assetsList) => {
        console.log(`Deleting ${assetsList.length} assets`);
        const deletions = assetsList.map((assetPath) => {
          const itemRef = storageRef(storage, assetPath);
          return deleteObject(itemRef);
        });
        return Promise.all(deletions);
      })
      .catch((error) => {
        console.error('Error deleting assets:', error);
      });
    const q = query(collection(db, 'feedback'), where('slug', '==', this.parent.slug));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (d) => {
      await deleteDoc(doc(feedbackCollection, d.id));
    });
  };

  async copyAssets(sourceSlug: string, targetSlug: string) {
    const copyOperations = get(this.nodes).map(async (node) => {
      await this.find(node.id).copyAssets(sourceSlug, targetSlug);
    });
    await Promise.all(copyOperations);
    await tick();
    this.nodes.update((nodes) => [...nodes]);
  }

  deleteNode = (id: string) => {
    const node = this.find(id);
    node.deleteAssets();
    const connectedNodes = get(this.edges)
      .filter((edge) => edge.source === id || edge.target === id)
      .map((edge) => (edge.source === id ? edge.target : edge.source));
    connectedNodes.forEach((nodeId) => {
      const node = this.find(nodeId).node;
      const inputIds = node.data.input_ids;
      for (const key in inputIds) {
        if (_.isArray(inputIds[key])) {
          inputIds[key] = (inputIds[key] as Array<any>).filter((val) => val.split('|')[0] !== id);
        } else if (inputIds[key] === id) {
          inputIds[key] = '';
        }
      }
      node.data.input_ids = inputIds;
    });
    this.nodes.update(($nodes) => $nodes.filter((node) => node.id !== id));
    this.edges.update(($edges) =>
      $edges.filter((edge) => edge.source !== id && edge.target !== id)
    );
  };

  onConnect = (source: string, target: string, sourceHandle: string, targetHandle: string) => {
    const sourceNode = get(this.nodes).find((n) => n.id === source);
    const targetNode = get(this.nodes).find((n) => n.id === target);
    const ids = targetNode.data.input_ids;
    if (_.isArray(ids[targetHandle])) {
      ids[targetHandle].push(sourceHandle ? sourceNode.id + '|' + sourceHandle : sourceNode.id);
    } else ids[targetHandle] = sourceHandle ? sourceNode.id + '|' + sourceHandle : sourceNode.id;
    setTimeout(() => {
      this.nodes.update(($nodes) => $nodes);
      for (const node of get(this.nodes)) {
        node.data = { ...node.data };
      }
    }, 500);
  };
}
