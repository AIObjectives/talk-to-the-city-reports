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

 ✓ src/test/jq_v0.test.js  (2 tests) 3ms
 ✓ src/test/open_ai_key.test.ts  (4 tests) 4ms
 ✓ src/test/edit_csv.test.ts  (7 tests) 3ms
 ✓ src/test/limit_csv.test.js  (5 tests) 3ms
 ✓ src/test/jsonata.test.ts  (3 tests) 10ms
 ✓ src/test/json.test.ts  (3 tests) 4ms
 ✓ src/test/csv.test.js  (3 tests) 5ms
 ✓ src/test/argument_extraction.test.ts  (6 tests) 124ms
 ✓ src/test/cluster_extraction.test.ts  (5 tests) 123ms
 ✓ src/test/grid.test.ts  (1 test) 2ms
 ✓ src/test/translate.test.ts  (2 tests) 1ms
 ✓ src/test/count_tokens.test.ts  (2 tests) 239ms
 ✓ src/test/jq_v1.test.js  (2 tests) 277ms

 Test Files  13 passed (13)
      Tests  45 passed (45)
   Start at  06:58:47
   Duration  770ms (transform 815ms, setup 0ms, collect 1.84s, tests 798ms, environment 1ms, prepare 1.04s)

 % Coverage report from v8
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |   55.01 |     72.3 |      22 |   55.01 |                   
 lib               |   43.03 |    64.16 |   15.92 |   43.03 |                   
  jq.js            |   37.86 |    63.09 |   15.13 |   37.86 | ...2157,2169-2200 
  mock_open_ai.ts  |     100 |      100 |     100 |     100 |                   
  ...categories.ts |     100 |      100 |     100 |     100 |                   
  prompts.ts       |     100 |      100 |     100 |     100 |                   
  utils.ts         |   12.79 |      100 |       0 |   12.79 | ...77,80-81,84-86 
 lib/compute       |   87.31 |    88.09 |   76.19 |   87.31 |                   
  ...extraction.ts |   98.52 |    86.36 |     100 |   98.52 | 103-104           
  ...extraction.ts |   97.52 |    89.47 |     100 |   97.52 | 37-39             
  count_tokens.ts  |   96.29 |       75 |     100 |   96.29 | 25-26             
  csv.ts           |   97.26 |       60 |     100 |   97.26 | 16-17             
  edit_csv.ts      |     100 |      100 |     100 |     100 |                   
  grid.ts          |   58.33 |      100 |       0 |   58.33 | 3-5,7-23          
  jq_v0.ts         |   96.49 |       75 |     100 |   96.49 | 24-25             
  jq_v1.ts         |     100 |      100 |     100 |     100 |                   
  json.ts          |     100 |      100 |     100 |     100 |                   
  jsonata.ts       |     100 |      100 |     100 |     100 |                   
  limit_csv.ts     |   95.65 |       75 |     100 |   95.65 | 20-21             
  open_ai_key.ts   |     100 |      100 |     100 |     100 |                   
  translate.ts     |   27.96 |      100 |       0 |   27.96 | 4-26,28-33,36-91  
 test/test/mocks   |     100 |      100 |     100 |     100 |                   
  js-cookie.ts     |     100 |      100 |     100 |     100 |                   
-------------------|---------|----------|---------|---------|-------------------
```
