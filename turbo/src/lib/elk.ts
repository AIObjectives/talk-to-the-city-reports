import ELK from 'elkjs/lib/elk.bundled.js';
import { Position, type Node, type Edge } from '@xyflow/svelte';

const elk = new ELK();

export const elkOptions = {
  'elk.algorithm': 'layered',
  'elk.layered.spacing.nodeNodeBetweenLayers': '200',
  'elk.spacing.nodeNode': '200'
};

export function getLayoutedElements(nodes: Node[], edges: Edge[], options = {}) {
  const isHorizontal = options?.['elk.direction'] === 'RIGHT';
  const graph = {
    id: 'root',
    layoutOptions: options,
    children: nodes.map((node) => ({
      ...node,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      width: node.width || 500,
      height: node.height || 800
    })),
    edges: edges
  };

  return elk
    .layout(graph)
    .then((layoutedGraph) => ({
      nodes: layoutedGraph.children.map((node) => ({
        ...node,
        position: { x: node.x, y: node.y }
      })),

      edges: layoutedGraph.edges
    }))
    .catch(console.error);
}
