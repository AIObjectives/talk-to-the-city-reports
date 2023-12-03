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

 ✓ src/test/limit_csv.test.js  (4 tests) 3ms
 ✓ src/test/grid.test.ts  (1 test) 1ms
 ✓ src/test/jq.test.js  (2 tests) 5ms
 ✓ src/test/edit_csv.test.ts  (7 tests) 3ms
 ✓ src/test/open_ai_key.test.ts  (4 tests) 4ms
 ✓ src/test/jsonata.test.ts  (3 tests) 9ms
 ✓ src/test/csv.test.js  (3 tests) 4ms
 ✓ src/test/json.test.ts  (3 tests) 4ms
 ✓ src/test/cluster_extraction.test.ts  (5 tests) 124ms
 ✓ src/test/argument_extraction.test.ts  (6 tests) 127ms
 ✓ src/test/translate.test.ts  (2 tests) 3ms
 ✓ src/test/count_tokens.test.ts  (2 tests) 303ms

 Test Files  12 passed (12)
      Tests  42 passed (42)
   Start at  11:10:36
   Duration  914ms (transform 894ms, setup 0ms, collect 1.79s, tests 590ms, environment 1ms, prepare 1.04s)

 % Coverage report from v8
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |   53.26 |    72.37 |   21.68 |   53.26 |                   
 lib               |   42.01 |    64.16 |   15.92 |   42.01 |                   
  jq.js            |   37.86 |    63.09 |   15.13 |   37.86 | ...2157,2169-2200 
  mock_open_ai.ts  |     100 |      100 |     100 |     100 |                   
  prompts.ts       |     100 |      100 |     100 |     100 |                   
  utils.ts         |   12.79 |      100 |       0 |   12.79 | ...77,80-81,84-86 
 lib/compute       |   86.27 |    88.88 |      75 |   86.27 |                   
  ...extraction.ts |   98.48 |    86.36 |     100 |   98.48 | 101-102           
  ...extraction.ts |   97.45 |    89.47 |     100 |   97.45 | 36-38             
  count_tokens.ts  |   96.07 |       75 |     100 |   96.07 | 24-25             
  csv.ts           |    97.1 |       60 |     100 |    97.1 | 14-15             
  edit_csv.ts      |     100 |      100 |     100 |     100 |                   
  grid.ts          |   55.81 |      100 |       0 |   55.81 | 1-3,5-20          
  jq.ts            |   96.29 |       75 |     100 |   96.29 | 23-24             
  json.ts          |     100 |      100 |     100 |     100 |                   
  jsonata.ts       |     100 |      100 |     100 |     100 |                   
  limit_csv.ts     |     100 |      100 |     100 |     100 |                   
  open_ai_key.ts   |     100 |      100 |     100 |     100 |                   
  translate.ts     |   26.08 |      100 |       0 |   26.08 | 3-25,27-32,35-90  
 test/test/mocks   |     100 |      100 |     100 |     100 |                   
  js-cookie.ts     |     100 |      100 |     100 |     100 |                   
-------------------|---------|----------|---------|---------|-------------------
```
