# tttc-turbo

This application creates reports based on participant surveys.

[https://tttc-turbo.web.app](https://tttc-turbo.web.app)

Repo link: [https://github.com/AIObjectives/tttc-turbo](https://github.com/AIObjectives/tttc-turbo)

## Running locally

```bash
$ git clone https://github.com/AIObjectives/tttc-turbo.git
```

Or, if you don't want to get pestered with password prompts etc:

```bash
$ git clone https://<my-github-dev-token>@github.com/AIObjectives/tttc-turbo.git
```

### NPM / NodeJS

Node version tested: `v18.0.0`

```bash
$ cd tttc-turbo
$ npm install --legacy-peer-deps # or --force
$ npm run dev
```

## Adding text to node docs:

The primary UI components displayed to users are called "nodes" as they are part of a dependency graph.

The docs that appear when the user presses the `?` mark are stored in:

`src/lib/docs`

### Adding text outside inside nodes:

The UI nodes are stored in `src/components/graph/nodes`:

`src/components/graph/nodes/DGNode.svelte`

This is the 'base' node, that all nodes reuse.

`src/components/graph/nodes/UploadFileNode.svelte`

This is the generic file upload, which CVS and JSON reuse.

`src/components/graph/nodes/DefaultNode.svelte`

This is an empty generic node, when nodes don't have a specialized UI.

`src/components/graph/nodes/CSVNode.svelte`  
`src/components/graph/nodes/JSONNode.svelte`

These are the specialized CSV and JSON upload nodes.

`src/components/graph/nodes/PromptNode.svelte`

This is the "Argument Extraction" and "Cluster Extraction" node component. So they're not specialized, but rather use the same base prompt node, as do all prompt / LLM prompting nodes.

### Internationalization:

`src/lib/i18n/en.json`  
`src/lib/zh-TW.json`

Since we use internationalization, UI strings use:

```html
<script lang='ts>
    import { _ as __ } from 'svelte-i18n';
</script>


<p>{$__('this_is_a_string')}</p>
```

The localized strings is then added to their respective src/lib/<lang>.json files.

## Nodes

To add pipeline computation nodes:

- create the compute function in `src/lib/compute/`
- create a UI component as required, in `src/components/` (or preferably: use an existing one)
- register the component and compute function in `src/lib/node_types.ts`
- add the node to `src/lib/templates.ts`
- add node documentation to `src/lib/docs`

## Tests & TDD

The core functionalities of the nodes are tested. Thus it is recommended to run the tests, and keep them running (vitest uses a daemon with file watch) while you make changes.

```bash
$ npm run test-ui
```


## Test Results
<<<<<<< HEAD
| Metric                | Count |
|-----------------------|------:|
| Total Test Suites     | 46 |
| Passed Test Suites    | 46 |
| Failed Test Suites    | 0 |
| Pending Test Suites   | 0 |
| Total Tests           | 81 |
| Passed Tests          | 81 |
| Failed Tests          | 0 |
| Pending Tests         | 0 |
| Todo Tests            | 0 |
||||||| parent of 5cfa136 (Better error handling in report creation flow [#9])
| Metric                | Count |
|-----------------------|------:|
| Total Test Suites     | 46 |
| Passed Test Suites    | 46 |
| Failed Test Suites    | 0 |
| Pending Test Suites   | 0 |
| Total Tests           | 76 |
| Passed Tests          | 76 |
| Failed Tests          | 0 |
| Pending Tests         | 0 |
| Todo Tests            | 0 |
=======

| Metric              | Count |
| ------------------- | ----: |
| Total Test Suites   |    46 |
| Passed Test Suites  |    46 |
| Failed Test Suites  |     0 |
| Pending Test Suites |     0 |
| Total Tests         |    81 |
| Passed Tests        |    81 |
| Failed Tests        |     0 |
| Pending Tests       |     0 |
| Todo Tests          |     0 |
>>>>>>> 5cfa136 (Better error handling in report creation flow [#9])

### `[1]` [argument_extraction.test.ts](./src/test//argument_extraction.test.ts)
<<<<<<< HEAD
| Test | Status | Duration (ms) |
|---|---|---:|
| *extract the given arguments* | **passed** | `1126` |
| *should not extract the arguments if no csv* | **passed** | `0` |
| *should not extract the arguments if no open_ai_key and no GCS* | **passed** | `0` |
| *should load from GCS if no open ai key* | **passed** | `1` |
| *should not extract the arguments if no prompt and no system prompt* | **passed** | `0` |
| *test GCS caching* | **passed** | `0` |
||||||| parent of 5cfa136 (Better error handling in report creation flow [#9])
| Test | Status | Duration (ms) |
|---|---|---:|
| *extract the given arguments* | **passed** | `49` |
=======

| Test                                                                 | Status     | Duration (ms) |
| -------------------------------------------------------------------- | ---------- | ------------: |
| _extract the given arguments_                                        | **passed** |        `1126` |
| _should not extract the arguments if no csv_                         | **passed** |           `0` |
| _should not extract the arguments if no open_ai_key and no GCS_      | **passed** |           `0` |
| _should load from GCS if no open ai key_                             | **passed** |           `1` |
| _should not extract the arguments if no prompt and no system prompt_ | **passed** |           `0` |
| _test GCS caching_                                                   | **passed** |           `0` |
>>>>>>> 5cfa136 (Better error handling in report creation flow [#9])

### `[2]` [cluster_extraction.test.ts](./src/test//cluster_extraction.test.ts)
<<<<<<< HEAD
| Test | Status | Duration (ms) |
|---|---|---:|
| *extract the cluster* | **passed** | `69` |
| *should not extract the cluster if no csv* | **passed** | `0` |
| *should not extract the cluster if no open_ai_key* | **passed** | `0` |
| *should not extract the cluster if no prompt and no system prompt* | **passed** | `1` |
| *test GCS caching* | **passed** | `1` |
||||||| parent of 5cfa136 (Better error handling in report creation flow [#9])
| Test | Status | Duration (ms) |
|---|---|---:|
| *extract the cluster* | **passed** | `121` |
| *should not extract the cluster if no csv* | **passed** | `0` |
| *should not extract the cluster if no open_ai_key* | **passed** | `1` |
| *should not extract the cluster if no prompt and no system prompt* | **passed** | `0` |
| *test GCS caching* | **passed** | `0` |
=======

| Test                                                               | Status     | Duration (ms) |
| ------------------------------------------------------------------ | ---------- | ------------: |
| _extract the cluster_                                              | **passed** |          `69` |
| _should not extract the cluster if no csv_                         | **passed** |           `0` |
| _should not extract the cluster if no open_ai_key_                 | **passed** |           `0` |
| _should not extract the cluster if no prompt and no system prompt_ | **passed** |           `1` |
| _test GCS caching_                                                 | **passed** |           `1` |
>>>>>>> 5cfa136 (Better error handling in report creation flow [#9])

### `[3]` [count_tokens.test.ts](./src/test//count_tokens.test.ts)
<<<<<<< HEAD
| Test | Status | Duration (ms) |
|---|---|---:|
| *should correctly count tokens in input data* | **passed** | `314` |
| *should not count tokens if input data length matches and node is not dirty* | **passed** | `1` |
||||||| parent of 5cfa136 (Better error handling in report creation flow [#9])
| Test | Status | Duration (ms) |
|---|---|---:|
| *should correctly count tokens in input data* | **passed** | `326` |
| *should not count tokens if input data length matches and node is not dirty* | **passed** | `0` |
=======

| Test                                                                         | Status     | Duration (ms) |
| ---------------------------------------------------------------------------- | ---------- | ------------: |
| _should correctly count tokens in input data_                                | **passed** |         `314` |
| _should not count tokens if input data length matches and node is not dirty_ | **passed** |           `1` |
>>>>>>> 5cfa136 (Better error handling in report creation flow [#9])

### `[4]` [csv.test.ts](./src/test//csv.test.ts)
<<<<<<< HEAD
| Test | Status | Duration (ms) |
|---|---|---:|
| *should process CSV data correctly from GCS* | **passed** | `20` |
| *should handle empty CSV data from GCS* | **passed** | `28` |
| *should handle rows with uneven columns from GCS* | **passed** | `11` |
||||||| parent of 5cfa136 (Better error handling in report creation flow [#9])
| Test | Status | Duration (ms) |
|---|---|---:|
| *should process CSV data correctly from GCS* | **passed** | `11` |
| *should handle empty CSV data from GCS* | **passed** | `2` |
| *should handle rows with uneven columns from GCS* | **passed** | `2` |
=======

| Test                                              | Status     | Duration (ms) |
| ------------------------------------------------- | ---------- | ------------: |
| _should process CSV data correctly from GCS_      | **passed** |          `20` |
| _should handle empty CSV data from GCS_           | **passed** |          `28` |
| _should handle rows with uneven columns from GCS_ | **passed** |          `11` |
>>>>>>> 5cfa136 (Better error handling in report creation flow [#9])

### `[5]` [dataset.test.ts](./src/test//dataset.test.ts)
<<<<<<< HEAD
| Test | Status | Duration (ms) |
|---|---|---:|
| *Full pipeline run test* | **passed** | `0` |
||||||| parent of 5cfa136 (Better error handling in report creation flow [#9])
| Test | Status | Duration (ms) |
|---|---|---:|
| *Full pipeline run test* | **passed** | `1` |
=======

| Test                     | Status     | Duration (ms) |
| ------------------------ | ---------- | ------------: |
| _Full pipeline run test_ | **passed** |           `0` |
>>>>>>> 5cfa136 (Better error handling in report creation flow [#9])

### `[6]` [edit_csv.test.ts](./src/test//edit_csv.test.ts)
<<<<<<< HEAD
| Test | Status | Duration (ms) |
|---|---|---:|
| *generates new columns* | **passed** | `2` |
| *deletes columns* | **passed** | `0` |
| *renames columns* | **passed** | `0` |
| *returns undefined if input is undefined* | **passed** | `0` |
| *handles multiple operations* | **passed** | `0` |
| *does not modify input if no operations are specified* | **passed** | `1` |
| *does not crash if input is empty* | **passed** | `0` |
||||||| parent of 5cfa136 (Better error handling in report creation flow [#9])
| Test | Status | Duration (ms) |
|---|---|---:|
| *generates new columns* | **passed** | `1` |
| *deletes columns* | **passed** | `1` |
| *renames columns* | **passed** | `0` |
| *returns undefined if input is undefined* | **passed** | `0` |
| *handles multiple operations* | **passed** | `0` |
| *does not modify input if no operations are specified* | **passed** | `0` |
| *does not crash if input is empty* | **passed** | `0` |
=======

| Test                                                   | Status     | Duration (ms) |
| ------------------------------------------------------ | ---------- | ------------: |
| _generates new columns_                                | **passed** |           `2` |
| _deletes columns_                                      | **passed** |           `0` |
| _renames columns_                                      | **passed** |           `0` |
| _returns undefined if input is undefined_              | **passed** |           `0` |
| _handles multiple operations_                          | **passed** |           `0` |
| _does not modify input if no operations are specified_ | **passed** |           `1` |
| _does not crash if input is empty_                     | **passed** |           `0` |
>>>>>>> 5cfa136 (Better error handling in report creation flow [#9])

### `[7]` [grid.test.ts](./src/test//grid.test.ts)
<<<<<<< HEAD
| Test | Status | Duration (ms) |
|---|---|---:|
| *sets the output of the node to the input data* | **passed** | `1` |
||||||| parent of 5cfa136 (Better error handling in report creation flow [#9])
| Test | Status | Duration (ms) |
|---|---|---:|
| *sets the output of the node to the input data* | **passed** | `2` |
=======

| Test                                            | Status     | Duration (ms) |
| ----------------------------------------------- | ---------- | ------------: |
| _sets the output of the node to the input data_ | **passed** |           `1` |
>>>>>>> 5cfa136 (Better error handling in report creation flow [#9])

### `[8]` [jq_v0.test.ts](./src/test//jq_v0.test.ts)
<<<<<<< HEAD
| Test | Status | Duration (ms) |
|---|---|---:|
| *should process data correctly with JQ filter* | **passed** | `1` |
| *should handle invalid JQ filter* | **passed** | `1` |
||||||| parent of 5cfa136 (Better error handling in report creation flow [#9])
| Test | Status | Duration (ms) |
|---|---|---:|
| *should process data correctly with JQ filter* | **passed** | `2` |
| *should handle invalid JQ filter* | **passed** | `0` |
=======

| Test                                           | Status     | Duration (ms) |
| ---------------------------------------------- | ---------- | ------------: |
| _should process data correctly with JQ filter_ | **passed** |           `1` |
| _should handle invalid JQ filter_              | **passed** |           `1` |
>>>>>>> 5cfa136 (Better error handling in report creation flow [#9])

### `[9]` [jq_v1.test.ts](./src/test//jq_v1.test.ts)
<<<<<<< HEAD
| Test | Status | Duration (ms) |
|---|---|---:|
| *should process data correctly with JQ filter* | **passed** | `175` |
| *should handle invalid JQ filter* | **passed** | `3` |
||||||| parent of 5cfa136 (Better error handling in report creation flow [#9])
| Test | Status | Duration (ms) |
|---|---|---:|
| *should process data correctly with JQ filter* | **passed** | `192` |
| *should handle invalid JQ filter* | **passed** | `29` |
=======

| Test                                           | Status     | Duration (ms) |
| ---------------------------------------------- | ---------- | ------------: |
| _should process data correctly with JQ filter_ | **passed** |         `175` |
| _should handle invalid JQ filter_              | **passed** |           `3` |
>>>>>>> 5cfa136 (Better error handling in report creation flow [#9])

### `[10]` [json.test.ts](./src/test//json.test.ts)
<<<<<<< HEAD
| Test | Status | Duration (ms) |
|---|---|---:|
| *should process JSON data correctly from GCS* | **passed** | `2` |
| *should handle invalid JSON data from GCS* | **passed** | `0` |
| *should update dirty state correctly* | **passed** | `0` |
||||||| parent of 5cfa136 (Better error handling in report creation flow [#9])
| Test | Status | Duration (ms) |
|---|---|---:|
| *should process JSON data correctly from GCS* | **passed** | `1` |
| *should handle invalid JSON data from GCS* | **passed** | `1` |
| *should update dirty state correctly* | **passed** | `0` |
=======

| Test                                          | Status     | Duration (ms) |
| --------------------------------------------- | ---------- | ------------: |
| _should process JSON data correctly from GCS_ | **passed** |           `2` |
| _should handle invalid JSON data from GCS_    | **passed** |           `0` |
| _should update dirty state correctly_         | **passed** |           `0` |
>>>>>>> 5cfa136 (Better error handling in report creation flow [#9])

### `[11]` [jsonata.test.ts](./src/test//jsonata.test.ts)
<<<<<<< HEAD
| Test | Status | Duration (ms) |
|---|---|---:|
| *evaluates JSONata expressions* | **passed** | `1` |
| *returns undefined if no expression is provided* | **passed** | `1` |
| *catches errors when evaluating expressions* | **passed** | `7` |
||||||| parent of 5cfa136 (Better error handling in report creation flow [#9])
| Test | Status | Duration (ms) |
|---|---|---:|
| *evaluates JSONata expressions* | **passed** | `3` |
| *returns undefined if no expression is provided* | **passed** | `0` |
| *catches errors when evaluating expressions* | **passed** | `8` |
=======

| Test                                             | Status     | Duration (ms) |
| ------------------------------------------------ | ---------- | ------------: |
| _evaluates JSONata expressions_                  | **passed** |           `1` |
| _returns undefined if no expression is provided_ | **passed** |           `1` |
| _catches errors when evaluating expressions_     | **passed** |           `7` |
>>>>>>> 5cfa136 (Better error handling in report creation flow [#9])

### `[12]` [limit_csv.test.ts](./src/test//limit_csv.test.ts)
<<<<<<< HEAD
| Test | Status | Duration (ms) |
|---|---|---:|
| *should limit the number of rows correctly* | **passed** | `1` |
| *should limit the number of rows correctly, for an object* | **passed** | `1` |
| *should return all rows if limit is greater than number of rows* | **passed** | `0` |
| *should return an empty array if input is empty* | **passed** | `0` |
| *should not mutate the input node* | **passed** | `1` |
||||||| parent of 5cfa136 (Better error handling in report creation flow [#9])
| Test | Status | Duration (ms) |
|---|---|---:|
| *should limit the number of rows correctly* | **passed** | `2` |
| *should limit the number of rows correctly, for an object* | **passed** | `0` |
| *should return all rows if limit is greater than number of rows* | **passed** | `0` |
| *should return an empty array if input is empty* | **passed** | `0` |
| *should not mutate the input node* | **passed** | `0` |
=======

| Test                                                             | Status     | Duration (ms) |
| ---------------------------------------------------------------- | ---------- | ------------: |
| _should limit the number of rows correctly_                      | **passed** |           `1` |
| _should limit the number of rows correctly, for an object_       | **passed** |           `1` |
| _should return all rows if limit is greater than number of rows_ | **passed** |           `0` |
| _should return an empty array if input is empty_                 | **passed** |           `0` |
| _should not mutate the input node_                               | **passed** |           `1` |
>>>>>>> 5cfa136 (Better error handling in report creation flow [#9])

### `[13]` [markdown.test.ts](./src/test//markdown.test.ts)
<<<<<<< HEAD
| Test | Status | Duration (ms) |
|---|---|---:|
| *should set markdown data if input is a string* | **passed** | `1` |
| *should not set markdown data if input is not a string* | **passed** | `0` |
| *should not set markdown data if input is undefined* | **passed** | `1` |
| *should not set markdown data if input is null* | **passed** | `0` |
| *should not set markdown data if input is an object* | **passed** | `0` |
||||||| parent of 5cfa136 (Better error handling in report creation flow [#9])
| Test | Status | Duration (ms) |
|---|---|---:|
| *should set markdown data if input is a string* | **passed** | `2` |
| *should not set markdown data if input is not a string* | **passed** | `1` |
| *should not set markdown data if input is undefined* | **passed** | `0` |
| *should not set markdown data if input is null* | **passed** | `0` |
| *should not set markdown data if input is an object* | **passed** | `0` |
=======

| Test                                                    | Status     | Duration (ms) |
| ------------------------------------------------------- | ---------- | ------------: |
| _should set markdown data if input is a string_         | **passed** |           `1` |
| _should not set markdown data if input is not a string_ | **passed** |           `0` |
| _should not set markdown data if input is undefined_    | **passed** |           `1` |
| _should not set markdown data if input is null_         | **passed** |           `0` |
| _should not set markdown data if input is an object_    | **passed** |           `0` |
>>>>>>> 5cfa136 (Better error handling in report creation flow [#9])

### `[14]` [merge.test.ts](./src/test//merge.test.ts)
<<<<<<< HEAD
| Test | Status | Duration (ms) |
|---|---|---:|
| *merges cluster_extraction and argument_extraction data* | **passed** | `3` |
| *does not merge if cluster_extraction data is missing* | **passed** | `0` |
| *does not merge if argument_extraction data is missing* | **passed** | `0` |
| *does not merge if cluster_extraction data has no topics* | **passed** | `0` |
| *sets node data output to the merged data and dirty to false after merge* | **passed** | `1` |
||||||| parent of 5cfa136 (Better error handling in report creation flow [#9])
| Test | Status | Duration (ms) |
|---|---|---:|
| *merges cluster_extraction and argument_extraction data* | **passed** | `2` |
| *does not merge if cluster_extraction data is missing* | **passed** | `0` |
| *does not merge if argument_extraction data is missing* | **passed** | `0` |
| *does not merge if cluster_extraction data has no topics* | **passed** | `0` |
| *sets node data output to the merged data and dirty to false after merge* | **passed** | `0` |
=======

| Test                                                                      | Status     | Duration (ms) |
| ------------------------------------------------------------------------- | ---------- | ------------: |
| _merges cluster_extraction and argument_extraction data_                  | **passed** |           `3` |
| _does not merge if cluster_extraction data is missing_                    | **passed** |           `0` |
| _does not merge if argument_extraction data is missing_                   | **passed** |           `0` |
| _does not merge if cluster_extraction data has no topics_                 | **passed** |           `0` |
| _sets node data output to the merged data and dirty to false after merge_ | **passed** |           `1` |
>>>>>>> 5cfa136 (Better error handling in report creation flow [#9])

### `[15]` [merge_cluster_extraction.test.ts](./src/test//merge_cluster_extraction.test.ts)
<<<<<<< HEAD
| Test | Status | Duration (ms) |
|---|---|---:|
| *merges cluster extraction data* | **passed** | `136` |
| *does not merge if cluster extractions are missing* | **passed** | `112` |
| *uses cached data if available and not dirty* | **passed** | `0` |
| *does not merge if no open_ai_key is provided* | **passed** | `1` |
||||||| parent of 5cfa136 (Better error handling in report creation flow [#9])
| Test | Status | Duration (ms) |
|---|---|---:|
| *merges cluster extraction data* | **passed** | `125` |
| *does not merge if cluster extractions are missing* | **passed** | `103` |
| *uses cached data if available and not dirty* | **passed** | `1` |
| *does not merge if no open_ai_key is provided* | **passed** | `0` |
=======

| Test                                                | Status     | Duration (ms) |
| --------------------------------------------------- | ---------- | ------------: |
| _merges cluster extraction data_                    | **passed** |         `136` |
| _does not merge if cluster extractions are missing_ | **passed** |         `112` |
| _uses cached data if available and not dirty_       | **passed** |           `0` |
| _does not merge if no open_ai_key is provided_      | **passed** |           `1` |
>>>>>>> 5cfa136 (Better error handling in report creation flow [#9])

### `[16]` [open_ai_key.test.ts](./src/test//open_ai_key.test.ts)
<<<<<<< HEAD
| Test | Status | Duration (ms) |
|---|---|---:|
| *should set the key in cookies if the UI key is valid* | **passed** | `2` |
| *if ui key is set but invalid use local key* | **passed** | `0` |
| *should set the node text to "Invalid key" if the UI key is not valid and there is no local key* | **passed** | `0` |
| *should not mutate the node if the UI key and local key are both valid* | **passed** | `0` |
||||||| parent of 5cfa136 (Better error handling in report creation flow [#9])
| Test | Status | Duration (ms) |
|---|---|---:|
| *should set the key in cookies if the UI key is valid* | **passed** | `3` |
| *if ui key is set but invalid use local key* | **passed** | `0` |
| *should set the node text to "Invalid key" if the UI key is not valid and there is no local key* | **passed** | `0` |
| *should not mutate the node if the UI key and local key are both valid* | **passed** | `0` |
=======

| Test                                                                                             | Status     | Duration (ms) |
| ------------------------------------------------------------------------------------------------ | ---------- | ------------: |
| _should set the key in cookies if the UI key is valid_                                           | **passed** |           `2` |
| _if ui key is set but invalid use local key_                                                     | **passed** |           `0` |
| _should set the node text to "Invalid key" if the UI key is not valid and there is no local key_ | **passed** |           `0` |
| _should not mutate the node if the UI key and local key are both valid_                          | **passed** |           `0` |
>>>>>>> 5cfa136 (Better error handling in report creation flow [#9])

### `[17]` [participant_filter.test.ts](./src/test//participant_filter.test.ts)

| Test                                                      | Status     | Duration (ms) |
| --------------------------------------------------------- | ---------- | ------------: |
| _filters participants based on the provided name_         | **passed** |           `1` |
| _removes subtopics with no claims after filtering_        | **passed** |           `0` |
| _removes topics with no subtopics after filtering_        | **passed** |           `0` |
| _returns undefined if input data does not contain topics_ | **passed** |           `1` |
| _does not filter claims if interview key is missing_      | **passed** |           `0` |

### `[18]` [register.test.ts](./src/test//register.test.ts)
<<<<<<< HEAD
| Test | Status | Duration (ms) |
|---|---|---:|
| *test node registeration* | **passed** | `2` |
| *Load all nodes* | **passed** | `507` |
||||||| parent of 5cfa136 (Better error handling in report creation flow [#9])
| Test | Status | Duration (ms) |
|---|---|---:|
| *test node registeration* | **passed** | `1` |
| *Load all nodes* | **passed** | `510` |
=======

| Test                      | Status     | Duration (ms) |
| ------------------------- | ---------- | ------------: |
| _test node registeration_ | **passed** |           `2` |
| _Load all nodes_          | **passed** |         `507` |
>>>>>>> 5cfa136 (Better error handling in report creation flow [#9])

### `[19]` [report.test.ts](./src/test//report.test.ts)
<<<<<<< HEAD
| Test | Status | Duration (ms) |
|---|---|---:|
| *should set the output of the node to the input data* | **passed** | `2` |
| *should handle empty input data* | **passed** | `0` |
| *should not mutate the input node* | **passed** | `0` |
||||||| parent of 5cfa136 (Better error handling in report creation flow [#9])
| Test | Status | Duration (ms) |
|---|---|---:|
| *should set the output of the node to the input data* | **passed** | `1` |
| *should handle empty input data* | **passed** | `0` |
| *should not mutate the input node* | **passed** | `0` |
=======

| Test                                                  | Status     | Duration (ms) |
| ----------------------------------------------------- | ---------- | ------------: |
| _should set the output of the node to the input data_ | **passed** |           `2` |
| _should handle empty input data_                      | **passed** |           `0` |
| _should not mutate the input node_                    | **passed** |           `0` |
>>>>>>> 5cfa136 (Better error handling in report creation flow [#9])

### `[20]` [score_argument_relevance.test.ts](./src/test//score_argument_relevance.test.ts)
<<<<<<< HEAD
| Test | Status | Duration (ms) |
|---|---|---:|
| *scores the relevance of arguments* | **passed** | `119` |
| *uses cached data if available and not dirty* | **passed** | `0` |
| *does not score if argument_extraction data is missing* | **passed** | `0` |
| *does not score if open_ai_key is missing* | **passed** | `0` |
| *does not score if prompts are missing* | **passed** | `0` |
||||||| parent of 5cfa136 (Better error handling in report creation flow [#9])
| Test | Status | Duration (ms) |
|---|---|---:|
| *scores the relevance of arguments* | **passed** | `108` |
| *uses cached data if available and not dirty* | **passed** | `1` |
| *does not score if argument_extraction data is missing* | **passed** | `0` |
| *does not score if open_ai_key is missing* | **passed** | `1` |
| *does not score if prompts are missing* | **passed** | `0` |
=======

| Test                                                    | Status     | Duration (ms) |
| ------------------------------------------------------- | ---------- | ------------: |
| _scores the relevance of arguments_                     | **passed** |         `119` |
| _uses cached data if available and not dirty_           | **passed** |           `0` |
| _does not score if argument_extraction data is missing_ | **passed** |           `0` |
| _does not score if open_ai_key is missing_              | **passed** |           `0` |
| _does not score if prompts are missing_                 | **passed** |           `0` |
>>>>>>> 5cfa136 (Better error handling in report creation flow [#9])

### `[21]` [stringify.test.ts](./src/test//stringify.test.ts)
<<<<<<< HEAD
| Test | Status | Duration (ms) |
|---|---|---:|
| *should correctly stringify input data* | **passed** | `1` |
| *should return input if it cannot be stringified* | **passed** | `1` |
| *should handle different types of input* | **passed** | `0` |
| *should not mutate the input node* | **passed** | `0` |
||||||| parent of 5cfa136 (Better error handling in report creation flow [#9])
| Test | Status | Duration (ms) |
|---|---|---:|
| *should correctly stringify input data* | **passed** | `1` |
| *should return input if it cannot be stringified* | **passed** | `0` |
| *should handle different types of input* | **passed** | `0` |
| *should not mutate the input node* | **passed** | `0` |
=======

| Test                                              | Status     | Duration (ms) |
| ------------------------------------------------- | ---------- | ------------: |
| _should correctly stringify input data_           | **passed** |           `1` |
| _should return input if it cannot be stringified_ | **passed** |           `1` |
| _should handle different types of input_          | **passed** |           `0` |
| _should not mutate the input node_                | **passed** |           `0` |
>>>>>>> 5cfa136 (Better error handling in report creation flow [#9])

### `[22]` [translate.test.ts](./src/test//translate.test.ts)
<<<<<<< HEAD
| Test | Status | Duration (ms) |
|---|---|---:|
| *translates the input data* | **passed** | `0` |
| *uses cached translations when available* | **passed** | `0` |
||||||| parent of 5cfa136 (Better error handling in report creation flow [#9])
| Test | Status | Duration (ms) |
|---|---|---:|
| *translates the input data* | **passed** | `1` |
| *uses cached translations when available* | **passed** | `0` |
=======

| Test                                      | Status     | Duration (ms) |
| ----------------------------------------- | ---------- | ------------: |
| _translates the input data_               | **passed** |           `0` |
| _uses cached translations when available_ | **passed** |           `0` |
>>>>>>> 5cfa136 (Better error handling in report creation flow [#9])

### `[23]` [workerpool.test.ts](./src/test//workerpool.test.ts)
<<<<<<< HEAD
| Test | Status | Duration (ms) |
|---|---|---:|
| *should execute function in workerpool* | **passed** | `35` |
| *should execute delayed function in workerpool* | **passed** | `1006` |
||||||| parent of 5cfa136 (Better error handling in report creation flow [#9])
| Test | Status | Duration (ms) |
|---|---|---:|
| *should execute function in workerpool* | **passed** | `36` |
| *should execute delayed function in workerpool* | **passed** | `1004` |
=======

| Test                                            | Status     | Duration (ms) |
| ----------------------------------------------- | ---------- | ------------: |
| _should execute function in workerpool_         | **passed** |          `35` |
| _should execute delayed function in workerpool_ | **passed** |        `1006` |
>>>>>>> 5cfa136 (Better error handling in report creation flow [#9])
