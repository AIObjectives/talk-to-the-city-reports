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

 ✓ src/test/translate.test.ts  (2 tests) 1ms
 ✓ src/test/limit_csv.test.js  (4 tests) 2ms
 ✓ src/test/grid.test.ts  (1 test) 1ms
 ✓ src/test/open_ai_key.test.ts  (4 tests) 3ms
 ✓ src/test/edit_csv.test.ts  (7 tests) 4ms
 ✓ src/test/jsonata.test.ts  (3 tests) 9ms
 ✓ src/test/csv.test.js  (3 tests) 4ms
 ✓ src/test/cluster_extraction.test.ts  (5 tests) 127ms
 ✓ src/test/argument_extraction.test.ts  (6 tests) 128ms

 Test Files  9 passed (9)
      Tests  35 passed (35)
   Start at  02:34:51
   Duration  600ms (transform 607ms, setup 1ms, collect 1.02s, tests 279ms, environment 1ms, prepare 793ms)

 % Coverage report from v8
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |   79.56 |    91.13 |   64.28 |   79.56 |                   
 lib               |   71.37 |      100 |    37.5 |   71.37 |                   
  mock_open_ai.ts  |     100 |      100 |     100 |     100 |                   
  prompts.ts       |     100 |      100 |     100 |     100 |                   
  utils.ts         |   12.79 |      100 |       0 |   12.79 | ...77,80-81,84-86 
 lib/compute       |   82.31 |    90.14 |   70.58 |   82.31 |                   
  ...extraction.ts |   98.49 |    86.36 |     100 |   98.49 | 101-102           
  ...extraction.ts |   97.47 |    89.47 |     100 |   97.47 | 36-38             
  csv.ts           |    97.1 |       60 |     100 |    97.1 | 14-15             
  edit_csv.ts      |     100 |      100 |     100 |     100 |                   
  grid.ts          |   42.85 |      100 |       0 |   42.85 | 1-3,5-33          
  jsonata.ts       |     100 |      100 |     100 |     100 |                   
  limit_csv.ts     |     100 |      100 |     100 |     100 |                   
  open_ai_key.ts   |     100 |      100 |     100 |     100 |                   
  translate.ts     |   26.08 |      100 |       0 |   26.08 | 3-25,27-32,35-90  
 test/test/mocks   |     100 |      100 |     100 |     100 |                   
  js-cookie.ts     |     100 |      100 |     100 |     100 |                   
-------------------|---------|----------|---------|---------|-------------------
```
