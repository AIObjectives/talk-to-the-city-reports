import { describe, it, beforeAll, afterAll } from 'vitest';
import { expect } from 'vitest';
import workerpool from 'workerpool';

// https://github.com/josdejong/workerpool

describe('Workerpool', () => {
  let pool: any;
  const add = (a, b) => a + b;
  const delayedAdd = (a, b, delay) =>
    new Promise((resolve) => setTimeout(() => resolve(a + b), delay));

  beforeAll(() => {
    pool = workerpool.pool();
  });

  it('should execute function in workerpool', async () => {
    const result = await pool.exec(add, [3, 4]);
    expect(result).toBe(7);
  });

  it('should execute delayed function in workerpool', async () => {
    const result = await pool.exec(delayedAdd, [3, 4, 1000]);
    expect(result).toBe(7);
  });

  afterAll(() => {
    pool.terminate();
  });
});
