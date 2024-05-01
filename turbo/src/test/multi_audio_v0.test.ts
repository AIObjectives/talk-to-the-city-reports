import { describe, it, expect, vi, beforeEach } from 'vitest';
import MultiAudioNode, { audio_node_data } from '$lib/compute/multi_audio_v0';
import deepCopy from 'deep-copy';
import { readFileFromGCS } from '$lib/utils';
import File from './test/mocks/File';
import { getDataset } from './test/mocks/dataset';

globalThis.File = File;

vi.mock('$lib/utils', async () => {
  const actual = await vi.importActual('$lib/utils');
  return {
    ...actual,
    readFileFromGCS: vi.fn()
  };
});

describe('MultiAudioNode class', () => {
  let node;
  let inputData;
  let mockAudioFiles;
  let dataset;

  beforeEach(() => {
    node = new MultiAudioNode(deepCopy(audio_node_data));
    dataset = getDataset();
    mockAudioFiles = [
      {
        size: 1000,
        mime_type: 'audio/mpeg',
        filename: 'test1.mp3',
        gcs_path: 'gs://bucket/path/test1.mp3'
      },
      {
        size: 2000,
        mime_type: 'audio/mpeg',
        filename: 'test2.mp3',
        gcs_path: 'gs://bucket/path/test2.mp3'
      }
    ];
    node.data.files = mockAudioFiles;
    inputData = {};
    vi.clearAllMocks();
  });

  it('should return the cached output if not dirty and output exists', async () => {
    node.data.dirty = false;
    node.data.output = mockAudioFiles.map(
      (file) => new File(['audio content'], file.filename, { type: file.mime_type })
    );
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
    expect(output).toEqual(node.data.output);
  });

  it('should read audio from GCS and update size and mime_type if download is true', async () => {
    node.data.download = true;
    const mockBlobs = mockAudioFiles.map(
      (file) => new Blob(['audio content'], { type: file.mime_type })
    );
    vi.mocked(readFileFromGCS).mockImplementation((node, download, gcs_path) => {
      const index = mockAudioFiles.findIndex((file) => file.gcs_path === gcs_path);
      return Promise.resolve(mockBlobs[index]);
    });

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

    expect(readFileFromGCS).toHaveBeenCalledTimes(mockAudioFiles.length);
    expect(output).toHaveLength(mockAudioFiles.length);
    output.forEach((file, index) => {
      expect(file).toBeInstanceOf(File);
      expect(file).toHaveProperty('name', mockAudioFiles[index].filename);
      expect(file).toHaveProperty('type', mockAudioFiles[index].mime_type);
    });
  });

  it('should create empty audio files if download is false', async () => {
    node.data.download = false;
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

    expect(readFileFromGCS).not.toHaveBeenCalled();
    expect(output).toHaveLength(mockAudioFiles.length);
    output.forEach((file, index) => {
      expect(file).toBeInstanceOf(File);
      expect(file).toHaveProperty('name', mockAudioFiles[index].filename);
      expect(file).toHaveProperty('type', mockAudioFiles[index].mime_type);
      expect(file.size).toBe(mockAudioFiles[index].size);
    });
  });
});
