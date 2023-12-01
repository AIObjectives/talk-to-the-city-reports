# tttc-turbo

This application creates reports based on participant surveys.

https://tttc-turbo.web.app/

## Nodes

To add pipeline computation nodes:

- create the compute function in `src/lib/compute/`
- create a UI component as required, in `src/components/` (or preferably: use an existing one)
- register the component and compute function in `src/lib/node_types.ts`
- add the node to `src/lib/templates.ts`

## Test coverage report

```
> tttc-turbo@0.0.1 test-update-readme
> vitest --coverage --run --no-color --silent


 RUN  v0.34.6 /Users/orb/dev/tttc-turbo
      Coverage enabled with v8

 ✓ src/test/limit_csv.test.js  (4 tests) 2ms
 ✓ src/test/translate.test.ts  (2 tests) 1ms
 ✓ src/test/edit_csv.test.ts  (7 tests) 3ms
 ✓ src/test/grid.test.ts  (4 tests) 4ms
 ✓ src/test/csv.test.js  (7 tests) 5ms
 ✓ src/test/open_ai_key.test.ts  (4 tests) 4ms
 ✓ src/test/jsonata.test.ts  (3 tests) 7ms
 ✓ src/test/cluster_extraction.test.ts  (5 tests) 130ms
 ✓ src/test/argument_extraction.test.ts  (6 tests) 131ms

 Test Files  9 passed (9)
      Tests  42 passed (42)
   Start at  06:46:23
   Duration  520ms (transform 518ms, setup 0ms, collect 867ms, tests 287ms, environment 1ms, prepare 714ms)

 % Coverage report from v8
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |   89.66 |     93.9 |   86.36 |   89.66 |                   
 lib               |     100 |      100 |     100 |     100 |                   
  mock_open_ai.ts  |     100 |      100 |     100 |     100 |                   
  prompts.ts       |     100 |      100 |     100 |     100 |                   
 lib/compute       |   86.84 |    93.24 |   81.25 |   86.84 |                   
  ...extraction.ts |   98.49 |    86.36 |     100 |   98.49 | 101-102           
  ...extraction.ts |   97.47 |    89.47 |     100 |   97.47 | 36-38             
  csv.ts           |     100 |      100 |     100 |     100 |                   
  edit_csv.ts      |     100 |      100 |     100 |     100 |                   
  grid.ts          |     100 |      100 |     100 |     100 |                   
  jsonata.ts       |     100 |      100 |     100 |     100 |                   
  limit_csv.ts     |     100 |      100 |     100 |     100 |                   
  open_ai_key.ts   |     100 |      100 |     100 |     100 |                   
  translate.ts     |   26.08 |      100 |       0 |   26.08 | 3-25,27-32,35-90  
 test/test/mocks   |     100 |      100 |     100 |     100 |                   
  js-cookie.ts     |     100 |      100 |     100 |     100 |                   
-------------------|---------|----------|---------|---------|-------------------
```
