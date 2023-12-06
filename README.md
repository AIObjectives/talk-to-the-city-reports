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

 ✓ src/test/jq_v0.test.ts  (2 tests) 5ms
 ✓ src/test/participant_filter.test.ts  (5 tests) 5ms
 ✓ src/test/edit_csv.test.ts  (7 tests) 5ms
 ✓ src/test/jsonata.test.ts  (3 tests) 10ms
 ✓ src/test/csv.test.ts  (3 tests) 5ms
 ✓ src/test/score_argument_relevance.test.ts  (5 tests) 111ms
 ✓ src/test/cluster_extraction.test.ts  (5 tests) 131ms
 ✓ src/test/argument_extraction.test.ts  (6 tests) 132ms
 ✓ src/test/merge_cluster_extraction.test.ts  (4 tests) 223ms
 ✓ src/test/count_tokens.test.ts  (2 tests) 316ms
 ✓ src/test/merge.test.ts  (5 tests) 4ms
 ✓ src/test/limit_csv.test.ts  (5 tests) 7ms
 ✓ src/test/jq_v1.test.ts  (2 tests) 328ms
 ✓ src/test/json.test.ts  (3 tests) 7ms
 ✓ src/test/register.test.ts  (1 test) 6ms
 ✓ src/test/report.test.ts  (3 tests) 7ms
 ✓ src/test/markdown.test.ts  (5 tests) 3ms
 ✓ src/test/stringify.test.ts  (4 tests) 4ms
 ✓ src/test/open_ai_key.test.ts  (4 tests) 7ms
 ✓ src/test/grid.test.ts  (1 test) 1ms
 ✓ src/test/translate.test.ts  (2 tests) 1ms

 Test Files  21 passed (21)
      Tests  77 passed (77)
   Start at  11:39:30
   Duration  1.17s (transform 1.18s, setup 1ms, collect 2.96s, tests 1.32s, environment 4ms, prepare 1.79s)

 % Coverage report from v8
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |   65.06 |    78.07 |   36.51 |   65.06 |                   
 lib               |   43.43 |    64.77 |   16.52 |   43.43 |                   
  jq.js            |   37.86 |    63.09 |   15.13 |   37.86 | ...2157,2169-2200 
  mock_open_ai.ts  |     100 |      100 |     100 |     100 |                   
  ...categories.ts |     100 |      100 |     100 |     100 |                   
  node_register.ts |   78.94 |      100 |      50 |   78.94 | 9-10,13-14        
  prompts.ts       |     100 |      100 |     100 |     100 |                   
  utils.ts         |   12.79 |      100 |       0 |   12.79 | ...77,80-81,84-86 
 lib/compute       |   95.06 |    89.74 |   98.59 |   95.06 |                   
  ...extraction.ts |   98.72 |     87.5 |     100 |   98.72 | 117-118           
  ...extraction.ts |   97.85 |       90 |     100 |   97.85 | 38-40             
  count_tokens.ts  |   97.33 |    83.33 |     100 |   97.33 | 46-47             
  csv.ts           |   98.14 |    77.77 |     100 |   98.14 | 41-42             
  edit_csv.ts      |     100 |      100 |     100 |     100 |                   
  grid.ts          |   97.01 |       60 |     100 |   97.01 | 35-36             
  jq_v0.ts         |   97.36 |    83.33 |     100 |   97.36 | 38-39             
  jq_v1.ts         |     100 |      100 |     100 |     100 |                   
  json.ts          |   97.14 |    71.42 |     100 |   97.14 | 30-31             
  jsonata.ts       |     100 |      100 |     100 |     100 |                   
  limit_csv.ts     |   96.92 |    83.33 |     100 |   96.92 | 35-36             
  markdown.ts      |     100 |      100 |     100 |     100 |                   
  merge.ts         |     100 |    94.44 |     100 |     100 | 55                
  ...extraction.ts |   97.97 |    83.33 |     100 |   97.97 | 41-43             
  open_ai_key.ts   |     100 |      100 |     100 |     100 |                   
  ...ant_filter.ts |     100 |      100 |     100 |     100 |                   
  report.ts        |     100 |      100 |     100 |     100 |                   
  ..._relevance.ts |     100 |    94.73 |     100 |     100 | 99                
  stringify.ts     |   96.77 |       75 |     100 |   96.77 | 32-33             
  translate.ts     |   42.97 |      100 |   66.66 |   42.97 | 27-95             
 test/test/mocks   |     100 |      100 |     100 |     100 |                   
  js-cookie.ts     |     100 |      100 |     100 |     100 |                   
-------------------|---------|----------|---------|---------|-------------------
```
