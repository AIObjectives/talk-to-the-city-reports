import MarkdownNode, { markdown_node_data } from '$lib/compute/markdown_v0';
import deepCopy from 'deep-copy';
import { describe, it, expect } from 'vitest';

describe('MarkdownNode class', () => {
  // Existing test in the prompt
  it('should set markdown data if input is a string', async () => {
    const node = new MarkdownNode(deepCopy(markdown_node_data));
    const inputData = { text: '## Title' };
    const result = await node.compute(
      inputData,
      'run',
      console.log,
      console.error,
      console.log,
      '/'
    );
    expect(result).toBe('## Title');
    expect(node.data.markdown).toBe('## Title');
    expect(node.data.dirty).toBe(false);
  });

  // Additional Tests Below

  it('should combine multiple string inputs with separation', async () => {
    const node = new MarkdownNode(deepCopy(markdown_node_data));
    const inputData = { text: 'Paragraph 1', additionalText: 'Paragraph 2' };
    await node.compute(inputData, 'run', console.log, console.error, console.log, '/');
    expect(node.data.markdown).toBe('Paragraph 1\n\nParagraph 2');
  });

  it('should wrap non-string inputs within code block', async () => {
    const node = new MarkdownNode(deepCopy(markdown_node_data));
    const inputData = { object: { key: 'value' } };
    const expectedCodeBlock = '```\n{\n  "key": "value"\n}\n```';
    await node.compute(inputData, 'run', console.log, console.error, console.log, '/');
    expect(node.data.markdown).toBe(expectedCodeBlock);
  });

  it('should handle an empty input object', async () => {
    const node = new MarkdownNode(deepCopy(markdown_node_data));
    const inputData = {};
    await node.compute(inputData, 'run', console.log, console.error, console.log, '/');
    expect(node.data.markdown).toBe('');
  });

  it('should preserve the order of inputs when combining', async () => {
    const node = new MarkdownNode(deepCopy(markdown_node_data));
    const inputData = { first: '# Heading', second: 'Some text.', third: '- List item' };
    const combinedContent = '# Heading\n\nSome text.\n\n- List item';
    await node.compute(inputData, 'run', console.log, console.error, console.log, '/');
    expect(node.data.markdown).toBe(combinedContent);
  });

  it('should stringify and wrap arrays in code blocks', async () => {
    const node = new MarkdownNode(deepCopy(markdown_node_data));
    const inputData = { list: ['item1', 'item2'] };
    const expectedCodeBlock = '```\n[\n  "item1",\n  "item2"\n]\n```';
    await node.compute(inputData, 'run', console.log, console.error, console.log, '/');
    expect(node.data.markdown).toBe(expectedCodeBlock);
  });

  it('should throw an error if input data contains circular references', async () => {
    const node = new MarkdownNode(deepCopy(markdown_node_data));
    const inputData = { selfRef: null };
    inputData.selfRef = inputData; // Making a circular reference

    let hasErrorOccurred = false;
    try {
      await node.compute(inputData, 'run', console.log, console.error, console.log, '/');
    } catch (error) {
      hasErrorOccurred = true;
      expect(error.message).toContain('Converting circular structure to JSON');
    }
    expect(hasErrorOccurred).toBe(true);
  });
});
