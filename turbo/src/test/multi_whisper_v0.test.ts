import { describe, it, expect, vi, beforeEach } from 'vitest';
import MultiWhisperNode, { multi_whisper_node_data } from '$lib/compute/multi_whisper_v0';
import deepCopy from 'deep-copy';
import { getDataset } from './test/mocks/dataset';
import File from './test/mocks/File';
import WhisperNode from '$lib/compute/whisper_v1';

globalThis.File = File;

describe('MultiWhisperNode class', () => {
  let node: MultiWhisperNode;
  let inputData: Record<string, any>;
  let mockAudioFiles: File[];
  let open_ai_key: string;
  const dataset = getDataset();

  beforeEach(() => {
    node = new MultiWhisperNode(deepCopy(multi_whisper_node_data));
    open_ai_key = 'test_open_ai_key';
    mockAudioFiles = [
      new File(['audio content 1'], 'test1.mp3', { type: 'audio/mpeg' }),
      new File(['audio content 2'], 'test2.mp3', { type: 'audio/mpeg' })
    ];
    inputData = {
      audio: mockAudioFiles,
      open_ai_key: open_ai_key
    };
    vi.clearAllMocks();
  });

  it('should process multiple audio files', async () => {
    const output = await node.compute(
      inputData,
      'run',
      vi.fn(),
      vi.fn(),
      vi.fn(),
      'test_slug',
      vi.fn(),
      dataset
    );

    expect(output).toBeInstanceOf(Array);
    expect(output.length).toBe(mockAudioFiles.length);
    expect(Object.keys(node.data.node_info).length).toBe(mockAudioFiles.length);
    for (const filename of mockAudioFiles.map((file) => file.name)) {
      expect(node.data.cache[filename]).toBeDefined();
    }
  });

  it('should handle empty audio input', async () => {
    inputData.audio = [];
    const output = await node.compute(
      inputData,
      'run',
      vi.fn(),
      vi.fn(),
      vi.fn(),
      'test_slug',
      vi.fn(),
      dataset
    );

    expect(output).toEqual([]);
  });

  it('should update node_info with results from WhisperNode computations', async () => {
    await node.compute(inputData, 'run', vi.fn(), vi.fn(), vi.fn(), 'test_slug', vi.fn(), dataset);

    for (const filename of mockAudioFiles.map((file) => file.name)) {
      expect(node.data.node_info[filename]).toHaveProperty('response_format');
      expect(node.data.node_info[filename]).toHaveProperty('gcs_path');
      expect(node.data.node_info[filename]).toHaveProperty('language');
      expect(node.data.node_info[filename]).toHaveProperty('audio_size');
      expect(node.data.node_info[filename]).toHaveProperty('prompt');
      expect(node.data.node_info[filename]).toHaveProperty('model');
      expect(node.data.cache[filename]).toBeDefined();
      expect(node.data.node_info[filename]).toHaveProperty('temperature');
      expect(node.data.node_info[filename]).toHaveProperty('output_internal_format');
      expect(node.data.node_info[filename]).toHaveProperty('interview');
      expect(node.data.node_info[filename]).toHaveProperty('video');
    }
  });

  it('should remove entries from node_info that are not in the audio list', async () => {
    // Add an extra entry to node_info that is not in the audio list
    node.data.node_info['extra.mp3'] = { dirty: true };

    await node.compute(inputData, 'run', vi.fn(), vi.fn(), vi.fn(), 'test_slug', vi.fn(), dataset);

    expect(node.data.node_info).not.toHaveProperty('extra.mp3');
  });

  it('should mark node_info entry as dirty if WhisperNode output is null', async () => {
    // Mock WhisperNode to return null output
    vi.spyOn(WhisperNode.prototype, 'compute').mockResolvedValueOnce(null);

    await node.compute(inputData, 'run', vi.fn(), vi.fn(), vi.fn(), 'test_slug', vi.fn(), dataset);

    for (const filename of mockAudioFiles.map((file) => file.name)) {
      expect(node.data.node_info[filename].dirty).toBe(true);
    }
  });
});
