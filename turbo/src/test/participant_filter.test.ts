import ParticipantFilterNode, {
  participant_filter_node_data
} from '$lib/compute/participant_filter_v0';
import deepCopy from 'deep-copy';
import { describe, it } from 'vitest';
import { expect } from 'vitest';

describe('ParticipantFilterNode class', () => {
  it('filters participants based on the provided name', async () => {
    const node = new ParticipantFilterNode(deepCopy(participant_filter_node_data));
    node.data.text = 'Alice';
    const inputData = {
      json: {
        topics: [
          {
            subtopics: [
              {
                claims: [{ interview: 'Interview with Alice' }, { interview: 'Interview with Bob' }]
              }
            ]
          }
        ]
      }
    };
    const output = await node.compute(
      inputData,
      'run',
      console.log,
      console.error,
      console.log,
      'test_slug',
      null
    );
    expect(output).toEqual({
      topics: [
        {
          subtopics: [
            {
              claims: [{ interview: 'Interview with Alice' }]
            }
          ]
        }
      ]
    });
  });

  it('removes subtopics with no claims after filtering', async () => {
    const node = new ParticipantFilterNode(deepCopy(participant_filter_node_data));
    node.data.text = 'Charlie';
    const inputData = {
      json: {
        topics: [
          {
            subtopics: [
              {
                claims: [{ interview: 'Interview with Alice' }, { interview: 'Interview with Bob' }]
              }
            ]
          }
        ]
      }
    };
    const output = await node.compute(
      inputData,
      'run',
      console.log,
      console.error,
      console.log,
      'test_slug',
      null
    );
    expect(output).toEqual({ topics: [] });
  });

  it('removes topics with no subtopics after filtering', async () => {
    const node = new ParticipantFilterNode(deepCopy(participant_filter_node_data));
    node.data.text = 'Charlie';
    const inputData = {
      json: {
        topics: [
          {
            subtopics: [
              {
                claims: [{ interview: 'Interview with Alice' }, { interview: 'Interview with Bob' }]
              },
              {
                claims: [{ interview: 'Interview with Charlie' }]
              }
            ]
          },
          {
            subtopics: [
              {
                claims: [{ interview: 'Interview with Alice' }, { interview: 'Interview with Bob' }]
              }
            ]
          }
        ]
      }
    };
    const output = await node.compute(
      inputData,
      'run',
      console.log,
      console.error,
      console.log,
      'test_slug',
      null
    );
    expect(output).toEqual({
      topics: [
        {
          subtopics: [
            {
              claims: [{ interview: 'Interview with Charlie' }]
            }
          ]
        }
      ]
    });
  });

  it('returns undefined if input data does not contain topics', async () => {
    const node = new ParticipantFilterNode(deepCopy(participant_filter_node_data));
    node.data.text = 'Alice';
    const inputData = { json: {} };
    const output = await node.compute(
      inputData,
      'run',
      console.log,
      console.error,
      console.log,
      'test_slug',
      null
    );
    expect(output).toBeUndefined();
  });

  it('does not filter claims if interview key is missing', async () => {
    const node = new ParticipantFilterNode(deepCopy(participant_filter_node_data));
    node.data.text = 'Alice';
    const inputData = {
      json: {
        topics: [
          {
            subtopics: [
              {
                claims: [
                  { text: 'Some claim without interview' },
                  { interview: 'Interview with Alice' }
                ]
              }
            ]
          }
        ]
      }
    };
    const output = await node.compute(
      inputData,
      'run',
      console.log,
      console.error,
      console.log,
      'test_slug',
      null
    );
    expect(output).toEqual({
      topics: [
        {
          subtopics: [
            {
              claims: [
                { text: 'Some claim without interview' },
                { interview: 'Interview with Alice' }
              ]
            }
          ]
        }
      ]
    });
  });
});
