import { secondsToHHMMSS, HHMMSSToSeconds } from '$lib/utils';
import { describe, it } from 'vitest';
import { expect } from 'vitest';

describe('Utils tests', () => {
  it('Test secondsToHHMMSS', async () => {
    expect(secondsToHHMMSS(0)).toEqual('00:00:00');
    expect(secondsToHHMMSS(1)).toEqual('00:00:01');
    expect(secondsToHHMMSS(60)).toEqual('00:01:00');
    expect(secondsToHHMMSS(3600)).toEqual('01:00:00');
  });
  it('Test secondsToHHMMSS with string', async () => {
    // @ts-ignore
    expect(secondsToHHMMSS('0')).toEqual('00:00:00');
    // @ts-ignore
    expect(secondsToHHMMSS('1')).toEqual('00:00:01');
    // @ts-ignore
    expect(secondsToHHMMSS('60')).toEqual('00:01:00');
    // @ts-ignore
    expect(secondsToHHMMSS('3600')).toEqual('01:00:00');
  });
  it('Test HHMMSSToSeconds', async () => {
    expect(HHMMSSToSeconds('00:00:00')).toEqual(0);
    expect(HHMMSSToSeconds('00:00:01')).toEqual(1);
    expect(HHMMSSToSeconds('00:01:00')).toEqual(60);
    expect(HHMMSSToSeconds('01:00:00')).toEqual(3600);
  });
});
