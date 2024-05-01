import { describe, it, expect, vi, beforeEach } from 'vitest';
import WhisperNode, { whisper_node_data } from '$lib/compute/whisper_v1';
import deepCopy from 'deep-copy';
import { readFileFromGCS, uploadJSONToGCS } from '$lib/utils';
import MockOpenAI from '$lib/mock_open_ai';
import File from './test/mocks/File';
import sample from '$lib/mock_data/speech_to_text/sample.json';

globalThis.File = File;

vi.mock('$lib/utils', async () => {
  const actual = await vi.importActual('$lib/utils');
  return {
    ...actual,
    readFileFromGCS: vi.fn(),
    uploadJSONToGCS: vi.fn()
  };
});

describe('WhisperNode class', () => {
  let node;
  let inputData;
  let mockAudioFile;
  let open_ai_key;

  beforeEach(() => {
    node = new WhisperNode(deepCopy(whisper_node_data));
    node.data.response_format = 'verbose_json';
    open_ai_key = 'test_open_ai_key';
    mockAudioFile = new File(['audio content'], 'test.mp3', { type: 'audio/mpeg' });
    inputData = {
      audio: mockAudioFile,
      open_ai_key: open_ai_key
    };
    vi.clearAllMocks();
  });

  it('should load from cache if data is not dirty and gcs_path is set', async () => {
    node.data.dirty = false;
    node.data.gcs_path = 'gs://bucket/path/test.json';
    node.data.output = sample;
    const output = await node.compute(
      inputData,
      'run',
      vi.fn(),
      vi.fn(),
      vi.fn(),
      'test_slug',
      vi.fn()
    );
    expect(output).toEqual(sample);
  });

  it('should load from GCS if data is not dirty, gcs_path is set, and output is empty and audio size matches', async () => {
    node.data.dirty = false;
    node.data.gcs_path = 'gs://bucket/path/test.json';
    node.data.output = null;
    node.data.audio_size = mockAudioFile.size;
    vi.mocked(readFileFromGCS).mockResolvedValue(JSON.stringify(sample));
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
    expect(output).toEqual(sample);
  });

  it('should transcribe audio and upload to GCS if data is dirty', async () => {
    node.data.dirty = true;
    node.data.gcs_path = 'gs://bucket/path/test.json';
    vi.mocked(uploadJSONToGCS).mockResolvedValue(undefined);
    MockOpenAI.prototype.audio = {
      transcriptions: {
        create: vi.fn().mockResolvedValue(sample)
      }
    };
    const output = await node.compute(
      inputData,
      'run',
      vi.fn(),
      vi.fn(),
      vi.fn(),
      'test_slug',
      vi.fn()
    );
    expect(uploadJSONToGCS).toHaveBeenCalled();
    expect(output).toEqual(sample);
    expect(node.data.dirty).toBe(false);
  });

  it('should return undefined and set message if open_ai_key is missing', async () => {
    delete inputData.open_ai_key;
    const output = await node.compute(
      inputData,
      'run',
      vi.fn(),
      vi.fn(),
      vi.fn(),
      'test_slug',
      vi.fn()
    );
    expect(output).toBeUndefined();
    expect(node.data.message).toContain('missing_input_data');
  });

  it('should convert transcription to internal format if response_format is custom', async () => {
    node.data.dirty = true;
    node.data.response_format = 'custom';
    node.data.interview = 'bob';
    node.data.video = 'https://vimeo.com/855112091';
    vi.mocked(uploadJSONToGCS).mockResolvedValue(undefined);
    MockOpenAI.prototype.audio = {
      transcriptions: {
        create: vi.fn().mockResolvedValue(sample)
      }
    };
    const output = await node.compute(
      inputData,
      'run',
      vi.fn(),
      vi.fn(),
      vi.fn(),
      'test_slug',
      vi.fn()
    );
    expect(output).toEqual([
      {
        'comment-id': 'whisper_0',
        'comment-body': 'This is an audio sample.',
        timestamp: '00:00:00',
        interview: 'bob',
        video: 'https://vimeo.com/855112091'
      }
    ]);
  });
});
