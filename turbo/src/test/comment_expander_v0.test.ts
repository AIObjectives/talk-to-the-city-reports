import { describe, it, expect } from 'vitest';
import CommentExpanderNode, { comment_expander_node_data } from '$lib/compute/comment_expander_v0';
import deepCopy from 'deep-copy';

describe('CommentExpanderNode class', () => {
  it('should concatenate comments until reaching 100 words, then start a new chunk', async () => {
    const node = new CommentExpanderNode(deepCopy(comment_expander_node_data));
    const inputData = {
      input: [
        {
          'comment-body': 'Hello world',
          interview: 'Interview 1',
          'comment-id': '1',
          video: 'Video 1',
          timestamp: '00:00:01'
        },
        {
          'comment-body': 'Another comment',
          interview: 'Interview 1',
          'comment-id': '2',
          video: 'Video 1',
          timestamp: '00:00:02'
        },
        {
          'comment-body':
            'Yet another comment with many many words to exceed the limit of one hundred words in total which should trigger the creation of a new chunk',
          interview: 'Interview 1',
          'comment-id': '3',
          video: 'Video 1',
          timestamp: '00:00:03'
        },
        {
          'comment-body':
            'some more text at this point it really is only padding this with some very important information that can easily be classified into topics and subtopics',
          interview: 'Interview 1',
          'comment-id': '4',
          video: 'Video 1',
          timestamp: '00:00:03'
        },
        {
          'comment-body':
            'and always some more going on one would not really realise how long 100 words are until they have to type them for a unit test',
          interview: 'Interview 1',
          'comment-id': '5',
          video: 'Video 1',
          timestamp: '00:00:03'
        },
        {
          'comment-body':
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
          interview: 'Interview 1',
          'comment-id': '6',
          video: 'Video 1',
          timestamp: '00:00:03'
        }
      ]
    };
    const result = await node.compute(
      inputData,
      'run',
      console.log,
      console.error,
      console.log,
      'test_slug',
      null
    );
    expect(result).toEqual([
      {
        video: 'Video 1',
        'comment-id': '1',
        interview: 'Interview 1',
        timestamp: '00:00:01',
        'comment-body':
          'Hello world Another comment Yet another comment with many many words to exceed the limit of one hundred words in total which should trigger the creation of a new chunk some more text at this point it really is only padding this with some very important information that can easily be classified into topics and subtopics and always some more going on one would not really realise how long 100 words are until they have to type them for a unit test'
      },
      {
        video: 'Video 1',
        'comment-id': '6',
        interview: 'Interview 1',
        timestamp: '00:00:03',
        'comment-body':
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum'
      }
    ]);
  });

  it('should start a new chunk when the interview field changes', async () => {
    const node = new CommentExpanderNode(deepCopy(comment_expander_node_data));
    const inputData = {
      input: [
        {
          'comment-body': 'First comment',
          interview: 'Interview 1',
          'comment-id': '1',
          video: 'Video 1',
          timestamp: '00:00:01'
        },
        {
          'comment-body': 'Second comment',
          interview: 'Interview 2',
          'comment-id': '2',
          video: 'Video 1',
          timestamp: '00:00:02'
        }
      ]
    };
    const result = await node.compute(
      inputData,
      'run',
      console.log,
      console.error,
      console.log,
      'test_slug',
      null
    );
    expect(result).toEqual([
      {
        'comment-body': 'First comment',
        interview: 'Interview 1',
        'comment-id': '1',
        video: 'Video 1',
        timestamp: '00:00:01'
      },
      {
        'comment-body': 'Second comment',
        interview: 'Interview 2',
        'comment-id': '2',
        video: 'Video 1',
        timestamp: '00:00:02'
      }
    ]);
  });

  it('should handle an empty input array', async () => {
    const node = new CommentExpanderNode(deepCopy(comment_expander_node_data));
    const inputData = { input: [] };
    const result = await node.compute(
      inputData,
      'run',
      console.log,
      console.error,
      console.log,
      'test_slug',
      null
    );
    expect(result).toEqual([]);
  });

  it('should not lose the last comment if it does not exceed 100 words', async () => {
    const node = new CommentExpanderNode(deepCopy(comment_expander_node_data));
    const inputData = {
      input: [
        {
          'comment-body': 'First comment',
          interview: 'Interview 1',
          'comment-id': '1',
          video: 'Video 1',
          timestamp: '00:00:01'
        },
        {
          'comment-body': 'Second comment',
          interview: 'Interview 1',
          'comment-id': '2',
          video: 'Video 1',
          timestamp: '00:00:02'
        }
      ]
    };
    const result = await node.compute(
      inputData,
      'run',
      console.log,
      console.error,
      console.log,
      'test_slug',
      null
    );
    expect(result).toEqual([
      {
        'comment-body': 'First comment Second comment',
        interview: 'Interview 1',
        'comment-id': '1',
        video: 'Video 1',
        timestamp: '00:00:01'
      }
    ]);
  });

  it('should correctly handle comments with exactly 100 words', async () => {
    const node = new CommentExpanderNode(deepCopy(comment_expander_node_data));
    const hundredWordComment = new Array(100).fill('word').join(' ');
    const inputData = {
      input: [
        {
          'comment-body': hundredWordComment,
          interview: 'Interview 1',
          'comment-id': '1',
          video: 'Video 1',
          timestamp: '00:00:01'
        },
        {
          'comment-body': 'Additional comment',
          interview: 'Interview 1',
          'comment-id': '2',
          video: 'Video 1',
          timestamp: '00:00:02'
        }
      ]
    };
    const result = await node.compute(
      inputData,
      'run',
      console.log,
      console.error,
      console.log,
      'test_slug',
      null
    );
    expect(result).toEqual([
      {
        'comment-body': hundredWordComment,
        interview: 'Interview 1',
        'comment-id': '1',
        video: 'Video 1',
        timestamp: '00:00:01'
      },
      {
        'comment-body': 'Additional comment',
        interview: 'Interview 1',
        'comment-id': '2',
        video: 'Video 1',
        timestamp: '00:00:02'
      }
    ]);
  });
});
