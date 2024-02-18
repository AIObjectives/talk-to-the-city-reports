import { Dataset } from '$lib/dataset';
import { describe, it, expect, vi, test } from 'vitest';
import IntegerNode, { integer_node_data } from '$lib/compute/integer_v0';
import AdderNode, { adder_node_data } from '$lib/compute/adder_v0';
import TestNode, { test_node_data } from '$lib/compute/test_v0';
import deepCopy from 'deep-copy';

describe('TestNode class', () => {
  it('integer node', async () => {
    const node = new IntegerNode(deepCopy(integer_node_data));
    node.data.value = 5;
    const result = await node.compute({}, 'run', vi.fn(), vi.fn(), vi.fn(), 'test_slug', vi.fn());
    expect(result).toEqual(5);
  });
  it('adder node', async () => {
    const node = new AdderNode(deepCopy(adder_node_data));
    const result = await node.compute(
      { a: 1, b: 2 },
      'run',
      vi.fn(),
      vi.fn(),
      vi.fn(),
      'test_slug',
      vi.fn()
    );
    expect(result).toEqual(3);
  });
  it('dataset run adder', async () => {
    const node_0 = new IntegerNode(deepCopy(integer_node_data));
    node_0.id = '0';
    node_0.data.value = 1;
    const node_1 = new IntegerNode(deepCopy(integer_node_data));
    node_1.id = '1';
    node_1.data.value = 2;
    const adder = new AdderNode(deepCopy(adder_node_data));
    adder.id = 'adder';
    adder.data.input_ids.a = '0';
    adder.data.input_ids.b = '1';
    const nodes = [node_0, node_1, adder];
    const edges = [
      { source: '0', target: 'adder' },
      { source: '1', target: 'adder' }
    ];
    const graph = { nodes, edges };
    const ds = new Dataset('title', '/test', 'owner', 'template', 'description', graph, 'id');
    await ds.processNodes('run');
    const res = ds.graph.findImpl('adder');
    expect(res.data.output).toEqual(3);
  });
  it('dataset run multi input multi output', async () => {
    const node_0 = new IntegerNode(deepCopy(integer_node_data));
    node_0.id = '0';
    node_0.data.value = 1;
    const node_1 = new IntegerNode(deepCopy(integer_node_data));
    node_1.id = '1';
    node_1.data.value = 2;
    const test = new TestNode(deepCopy(test_node_data));
    test.id = 'test';
    test.data.input_ids.a = '0';
    test.data.input_ids.b = '1';
    const adder = new AdderNode(deepCopy(adder_node_data));
    adder.id = 'adder';
    adder.data.input_ids.a = 'test|c';
    adder.data.input_ids.b = 'test|d';
    const nodes = [node_0, node_1, test, adder];
    const edges = [
      { source: '0', target: 'test' },
      { source: '1', target: 'test' },
      { source: 'test', target: 'adder', sourceHandle: 'c', targetHandle: 'a' },
      { source: 'test', target: 'adder', sourceHandle: 'd', targetHandle: 'b' }
    ];
    const graph = { nodes, edges };
    const ds = new Dataset('title', '/test', 'owner', 'template', 'description', graph, 'id');
    await ds.processNodes('run');
    const res = ds.graph.findImpl('test');
    expect(res.data.output).toEqual({ c: 3, d: -1 });
    const res2 = ds.graph.findImpl('adder');
    expect(res2.data.output).toEqual(2);
  });
});
