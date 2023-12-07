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

 ✓ src/test/participant_filter.test.ts  (5 tests) 3ms
 ✓ src/test/markdown.test.ts  (5 tests) 5ms
 ✓ src/test/limit_csv.test.ts  (5 tests) 3ms
 ✓ src/test/csv.test.ts  (3 tests) 8ms
 ✓ src/test/cluster_extraction.test.ts  (5 tests) 125ms
 ✓ src/test/score_argument_relevance.test.ts  (5 tests) 108ms
 ✓ src/test/argument_extraction.test.ts  (6 tests) 125ms
 ✓ src/test/merge_cluster_extraction.test.ts  (4 tests) 225ms
 ✓ src/test/count_tokens.test.ts  (2 tests) 249ms
 ✓ src/test/merge.test.ts  (5 tests) 4ms
 ✓ src/test/jsonata.test.ts  (3 tests) 9ms
 ✓ src/test/jq_v1.test.ts  (2 tests) 275ms
 ✓ src/test/grid.test.ts  (1 test) 2ms
 ✓ src/test/jq_v0.test.ts  (2 tests) 5ms
 ✓ src/test/report.test.ts  (3 tests) 2ms
 ✓ src/test/register.test.ts  (1 test) 3ms
 ✓ src/test/json.test.ts  (3 tests) 4ms
 ✓ src/test/stringify.test.ts  (4 tests) 3ms
 ✓ src/test/open_ai_key.test.ts  (4 tests) 2ms
 ✓ src/test/edit_csv.test.ts  (7 tests) 3ms
 ✓ src/test/translate.test.ts  (2 tests) 4ms
 ✓ src/test/dataset.test.ts  (1 test) 400ms

 Test Files  22 passed (22)
      Tests  78 passed (78)
   Start at  10:48:39
   Duration  2.89s (transform 2.41s, setup 0ms, collect 4.74s, tests 1.57s, environment 17ms, prepare 1.70s)

 % Coverage report from v8
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |   71.63 |    79.31 |   36.87 |   71.63 |                   
 components        |     100 |      100 |     100 |     100 |                   
  Grid.svelte      |     100 |      100 |     100 |     100 |                   
  ...Nested.svelte |     100 |      100 |     100 |     100 |                   
 ...ts/graph/nodes |     100 |      100 |     100 |     100 |                   
  CSVNode.svelte   |     100 |      100 |     100 |     100 |                   
  DGNode.svelte    |     100 |      100 |     100 |     100 |                   
  ...SVNode.svelte |     100 |      100 |     100 |     100 |                   
  GridNode.svelte  |     100 |      100 |     100 |     100 |                   
  JSONNode.svelte  |     100 |      100 |     100 |     100 |                   
  ...wnNode.svelte |     100 |      100 |     100 |     100 |                   
  ...utNode.svelte |     100 |      100 |     100 |     100 |                   
  ...ptNode.svelte |     100 |      100 |     100 |     100 |                   
  ...utNode.svelte |     100 |      100 |     100 |     100 |                   
  ...teNode.svelte |     100 |      100 |     100 |     100 |                   
  ...leNode.svelte |     100 |      100 |     100 |     100 |                   
 components/toast  |   60.86 |      100 |      50 |   60.86 |                   
  theme.ts         |   60.86 |      100 |      50 |   60.86 | 27-35,38-46       
 lib               |    46.8 |     68.5 |   18.91 |    46.8 |                   
  dataset.ts       |   41.98 |    88.88 |   21.42 |   41.98 | ...10-226,229-261 
  firebase.js      |     100 |      100 |       0 |     100 |                   
  graph.ts         |    53.7 |      100 |   42.85 |    53.7 | ...32,35-41,44-53 
  jq.js            |   37.86 |    63.09 |   15.13 |   37.86 | ...2157,2169-2200 
  mock_open_ai.ts  |     100 |      100 |     100 |     100 |                   
  node.ts          |    37.5 |      100 |      40 |    37.5 | 17-23,26-37,40-55 
  ...categories.ts |     100 |      100 |     100 |     100 |                   
  node_register.ts |   89.47 |      100 |      75 |   89.47 | 13-14             
  node_types.ts    |     100 |      100 |     100 |     100 |                   
  prompts.ts       |     100 |      100 |     100 |     100 |                   
  store.ts         |     100 |      100 |     100 |     100 |                   
  utils.ts         |      50 |      100 |   33.33 |      50 | ...43,80-81,84-86 
 lib/compute       |   94.97 |    89.55 |   97.26 |   94.97 |                   
  ...extraction.ts |   98.71 |     87.5 |     100 |   98.71 | 116-117           
  ...extraction.ts |   97.85 |       90 |     100 |   97.85 | 38-40             
  count_tokens.ts  |   97.33 |    83.33 |     100 |   97.33 | 46-47             
  csv.ts           |   96.18 |    78.57 |   85.71 |   96.18 | 42-43,75-77       
  edit_csv.ts      |     100 |      100 |     100 |     100 |                   
  grid.ts          |   97.01 |       60 |     100 |   97.01 | 35-36             
  jq_v0.ts         |   97.36 |    83.33 |     100 |   97.36 | 38-39             
  jq_v1.ts         |     100 |      100 |     100 |     100 |                   
  json.ts          |   97.14 |    71.42 |     100 |   97.14 | 30-31             
  jsonata.ts       |     100 |      100 |     100 |     100 |                   
  limit_csv.ts     |   96.92 |    83.33 |     100 |   96.92 | 35-36             
  markdown.ts      |     100 |      100 |     100 |     100 |                   
  merge.ts         |     100 |    94.11 |     100 |     100 | 59                
  ...extraction.ts |   97.97 |    83.33 |     100 |   97.97 | 41-43             
  open_ai_key.ts   |     100 |      100 |     100 |     100 |                   
  ...ant_filter.ts |     100 |      100 |     100 |     100 |                   
  report.ts        |     100 |      100 |     100 |     100 |                   
  ..._relevance.ts |     100 |    94.73 |     100 |     100 | 99                
  stringify.ts     |   96.77 |       75 |     100 |   96.77 | 32-33             
  translate.ts     |   42.97 |      100 |   66.66 |   42.97 | 27-95             
 lib/docs          |     100 |      100 |     100 |     100 |                   
  ...extraction.ts |     100 |      100 |     100 |     100 |                   
  ...extraction.ts |     100 |      100 |     100 |     100 |                   
  csv.ts           |     100 |      100 |     100 |     100 |                   
  edit_csv.ts      |     100 |      100 |     100 |     100 |                   
  grid.ts          |     100 |      100 |     100 |     100 |                   
  jq.ts            |     100 |      100 |     100 |     100 |                   
  json.ts          |     100 |      100 |     100 |     100 |                   
  jsonata.ts       |     100 |      100 |     100 |     100 |                   
  limit_csv.ts     |     100 |      100 |     100 |     100 |                   
  markdown.ts      |     100 |      100 |     100 |     100 |                   
  ...extraction.ts |     100 |      100 |     100 |     100 |                   
  open_ai_key.ts   |     100 |      100 |     100 |     100 |                   
  ...ant_filter.ts |     100 |      100 |     100 |     100 |                   
  stringify.ts     |     100 |      100 |     100 |     100 |                   
  translate.ts     |     100 |      100 |     100 |     100 |                   
 lib/icons         |     100 |      100 |     100 |     100 |                   
  ...ection.svelte |     100 |      100 |     100 |     100 |                   
  ...Circle.svelte |     100 |      100 |     100 |     100 |                   
  ...utline.svelte |     100 |      100 |     100 |     100 |                   
 test/test/mocks   |     100 |      100 |     100 |     100 |                   
  js-cookie.ts     |     100 |      100 |     100 |     100 |                   
-------------------|---------|----------|---------|---------|-------------------
```
