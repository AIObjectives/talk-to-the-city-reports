import { describe, it, vi, expect, beforeEach } from 'vitest';
import TranslateNode, { translate_node_data } from '$lib/compute/translate_v0';
import deepCopy from 'deep-copy';
import { getDataset } from './test/mocks/dataset';

describe('TranslateNode class', () => {
  let node;
  let inputData;
  let dataset;

  beforeEach(() => {
    vi.mock('$lib/utils', () => ({
      readFileFromGCS: vi.fn(() =>
        Promise.resolve(
          JSON.stringify({
            'en-US': { key: 'value' },
            'fr-FR': { key: 'translated response' }
          })
        )
      ),
      uploadJSONToGCS: vi.fn(() => Promise.resolve()),
      quickChecksum: vi.fn(() => 123)
    }));

    node = new TranslateNode(deepCopy(translate_node_data));
    inputData = {
      open_ai_key: 'test_key',
      data: { key: 'value' }
    };
    dataset = getDataset();
  });

  it('translates the input data', async () => {
    node.data.target_languages = ['fr-FR'];
    node.data.language_selector = 'fr-FR';
    node.data.keys = ['$.key'];
    node.data.gcs_path = 'gs://test_bucket/test_path';

    const result = await node.compute(
      inputData,
      'run',
      vi.fn(),
      vi.fn(),
      vi.fn(),
      'test_slug',
      vi.fn(),
      dataset
    );

    const { translation, translations } = result;
    expect(translation).toEqual({ key: 'translated response' });
    expect(translations).toEqual({
      'en-US': { key: 'value' },
      'fr-FR': { key: 'translated response' }
    });
  });

  it('loads translations from GCS if data has not changed', async () => {
    node.data.target_languages = ['fr-FR'];
    node.data.language_selector = 'fr-FR';
    node.data.keys = ['$.key'];
    node.data.gcs_path = 'gs://test_bucket/test_path';
    node.data.length = 123; // Same as the checksum returned by quickChecksum

    const modes = ['run', 'load'];

    for (const mode of modes) {
      const result = await node.compute(
        inputData,
        mode,
        vi.fn(),
        vi.fn(),
        vi.fn(),
        'test_slug',
        vi.fn(),
        dataset
      );

      const { translation, translations } = result;
      expect(translation).toEqual({ key: 'translated response' });
      expect(translations).toEqual({
        'en-US': { key: 'value' },
        'fr-FR': { key: 'translated response' }
      });
    }
  });

  it('does not translate if required inputs are missing', async () => {
    node.data.target_languages = [];
    node.data.keys = [];

    const result = await node.compute(
      inputData,
      'run',
      vi.fn(),
      vi.fn(),
      vi.fn(),
      'test_slug',
      vi.fn(),
      dataset
    );

    expect(result).toBeUndefined();
  });
});
