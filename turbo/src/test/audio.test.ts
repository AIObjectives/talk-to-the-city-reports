import { describe, it, expect, vi, beforeEach } from 'vitest';
import AudioNode, { audio_node_data } from '$lib/compute/audio_v0';
import deepCopy from 'deep-copy';
import { readFileFromGCS } from '$lib/utils';

vi.mock('$lib/utils', () => ({
  readFileFromGCS: vi.fn()
}));

import File from './test/mocks/File';

globalThis.File = File;

describe('AudioNode class', () => {
  let node: AudioNode;
  let inputData: Record<string, any>;
  const mockBlob = new Blob(['audio content'], { type: 'audio/mpeg' });
  const mockFile = new File([mockBlob], 'test.mp3', { type: 'audio/mpeg' });
  beforeEach(() => {
    node = new AudioNode(deepCopy(audio_node_data));
    inputData = {};
    vi.clearAllMocks();
  });
  it('should return the cached output if not dirty and output exists', async () => {
    node.data.dirty = false;
    node.data.output = mockFile;
    const output = await node.compute(
      inputData,
      'run',
      vi.fn(),
      vi.fn(),
      vi.fn(),
      'test_slug',
      vi.fn()
    );
    expect(output).toBe(mockFile);
  });
  it('should read audio from GCS and update size and mime_type if download is true', async () => {
    node.data.gcs_path = 'gs://bucket/path/test.mp3';
    node.data.download = true;
    vi.mocked(readFileFromGCS).mockResolvedValue(mockBlob);
    const output = await node.compute(
      inputData,
      'run',
      vi.fn(),
      vi.fn(),
      vi.fn(),
      'test_slug',
      vi.fn()
    );
    expect(readFileFromGCS).toHaveBeenCalled();
    expect(node.data.size).toBe(mockBlob.size);
    expect(node.data.mime_type).toBe(mockBlob.type);
    expect(output).toBeInstanceOf(File);
    expect(output).toHaveProperty('name', 'test.mp3');
    expect(output).toHaveProperty('type', 'audio/mpeg');
  });
  it('should create an empty audio file if download is false', async () => {
    node.data.gcs_path = 'gs://bucket/path/test.mp3';
    node.data.download = false;
    node.data.size = 9000;
    node.data.mime_type = 'audio/mpeg';
    node.data.filename = 'test.mp3';
    const output = await node.compute(
      inputData,
      'run',
      vi.fn(),
      vi.fn(),
      vi.fn(),
      'test_slug',
      vi.fn()
    );
    expect(readFileFromGCS).not.toHaveBeenCalled();
    expect(output).toBeInstanceOf(File);
    expect(output).toHaveProperty('name', 'test.mp3');
    expect(output).toHaveProperty('type', 'audio/mpeg');
    expect(output.size).toBe(9000);
  });
  it('should set dirty to false after compute', async () => {
    node.data.gcs_path = 'gs://bucket/path/test.mp3';
    node.data.download = true;
    vi.mocked(readFileFromGCS).mockResolvedValue(mockBlob);
    await node.compute(inputData, 'run', vi.fn(), vi.fn(), vi.fn(), 'test_slug', vi.fn());
    expect(node.data.dirty).toBe(false);
  });
  it('should return undefined if gcs_path is not set', async () => {
    node.data.gcs_path = '';
    const output = await node.compute(
      inputData,
      'run',
      vi.fn(),
      vi.fn(),
      vi.fn(),
      'test_slug',
      vi.fn()
    );
    expect(output).toBeNull();
  });
});
