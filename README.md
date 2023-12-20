[![tests & build python API client & live website test](https://github.com/AIObjectives/tttc-turbo/actions/workflows/tests.yaml/badge.svg)](https://github.com/AIObjectives/tttc-turbo/actions/workflows/tests.yaml)

# tttc-turbo

This application creates reports based on participant surveys.

[https://tttc-turbo.web.app](https://tttc-turbo.web.app)

Repo link: [https://github.com/AIObjectives/tttc-turbo](https://github.com/AIObjectives/tttc-turbo)

Note: we are getting ready to open source this repo. Cleaning up in progress.

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

### Adding text inside nodes:

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

## Adding new nodes

To add pipeline computation nodes:

- create the compute function in `src/lib/compute/`
- create a UI component as required, in `src/components/` (or preferably: use an existing one)
- register the component and compute function in `src/lib/node_types.ts`
- add the node to `src/lib/templates.ts`
- add node documentation to `src/lib/docs`

## Tests & TDD

The core functionalities of the nodes are tested. Thus it is strongly recommended to run the tests, and keep them running (vitest uses a daemon with file watch) while you make changes.

```bash
$ npm run test-ui
```

### Testing the live website

```
brew install xorg-server
pip install chromedriver-autoinstaller selenium pyvirtualdisplay
DISPLAY=:99 python src/test/test_selenium.py
```

## Test Results

| Metric              | Count |
| ------------------- | ----: |
| Total Test Suites   |    46 |
| Passed Test Suites  |    46 |
| Failed Test Suites  |     0 |
| Pending Test Suites |     0 |
| Total Tests         |    83 |
| Passed Tests        |    83 |
| Failed Tests        |     0 |
| Pending Tests       |     0 |
| Todo Tests          |     0 |

### `[1]` [argument_extraction.test.ts](./src/test//argument_extraction.test.ts)

| Test                                                                 | Status     | Duration (ms) |
| -------------------------------------------------------------------- | ---------- | ------------: |
| _extract the given arguments_                                        | **passed** |        `1096` |
| _should not extract the arguments if no csv_                         | **passed** |           `0` |
| _should not extract the arguments if no open_ai_key and no GCS_      | **passed** |           `0` |
| _should load from GCS if no open ai key_                             | **passed** |           `0` |
| _should not extract the arguments if no prompt and no system prompt_ | **passed** |           `1` |
| _test GCS caching_                                                   | **passed** |           `0` |

### `[2]` [cluster_extraction.test.ts](./src/test//cluster_extraction.test.ts)

| Test                                                               | Status     | Duration (ms) |
| ------------------------------------------------------------------ | ---------- | ------------: |
| _extract the cluster_                                              | **passed** |          `33` |
| _should not extract the cluster if no csv_                         | **passed** |           `0` |
| _should not extract the cluster if no open_ai_key_                 | **passed** |           `0` |
| _should not extract the cluster if no prompt and no system prompt_ | **passed** |           `0` |
| _test GCS caching_                                                 | **passed** |           `0` |

### `[3]` [count_tokens.test.ts](./src/test//count_tokens.test.ts)

| Test                                                                         | Status     | Duration (ms) |
| ---------------------------------------------------------------------------- | ---------- | ------------: |
| _should correctly count tokens in input data_                                | **passed** |         `220` |
| _should not count tokens if input data length matches and node is not dirty_ | **passed** |           `0` |

### `[4]` [csv.test.ts](./src/test//csv.test.ts)

| Test                                              | Status     | Duration (ms) |
| ------------------------------------------------- | ---------- | ------------: |
| _should process CSV data correctly from GCS_      | **passed** |           `9` |
| _should handle empty CSV data from GCS_           | **passed** |           `7` |
| _should handle rows with uneven columns from GCS_ | **passed** |           `2` |

### `[5]` [dataset.test.ts](./src/test//dataset.test.ts)

| Test                     | Status     | Duration (ms) |
| ------------------------ | ---------- | ------------: |
| _Full pipeline run test_ | **passed** |         `155` |

### `[6]` [edit_csv.test.ts](./src/test//edit_csv.test.ts)

| Test                                                   | Status     | Duration (ms) |
| ------------------------------------------------------ | ---------- | ------------: |
| _generates new columns_                                | **passed** |           `1` |
| _deletes columns_                                      | **passed** |           `0` |
| _renames columns_                                      | **passed** |           `0` |
| _returns undefined if input is undefined_              | **passed** |           `0` |
| _handles multiple operations_                          | **passed** |           `1` |
| _does not modify input if no operations are specified_ | **passed** |           `0` |
| _does not crash if input is empty_                     | **passed** |           `0` |

### `[7]` [grid.test.ts](./src/test//grid.test.ts)

| Test                                            | Status     | Duration (ms) |
| ----------------------------------------------- | ---------- | ------------: |
| _sets the output of the node to the input data_ | **passed** |           `1` |

### `[8]` [jq_v0.test.ts](./src/test//jq_v0.test.ts)

| Test                                           | Status     | Duration (ms) |
| ---------------------------------------------- | ---------- | ------------: |
| _should process data correctly with JQ filter_ | **passed** |           `1` |
| _should handle invalid JQ filter_              | **passed** |           `1` |

### `[9]` [jq_v1.test.ts](./src/test//jq_v1.test.ts)

| Test                                           | Status     | Duration (ms) |
| ---------------------------------------------- | ---------- | ------------: |
| _should process data correctly with JQ filter_ | **passed** |         `152` |
| _should handle invalid JQ filter_              | **passed** |           `2` |

### `[10]` [json.test.ts](./src/test//json.test.ts)

| Test                                          | Status     | Duration (ms) |
| --------------------------------------------- | ---------- | ------------: |
| _should process JSON data correctly from GCS_ | **passed** |           `1` |
| _should handle invalid JSON data from GCS_    | **passed** |           `0` |
| _should update dirty state correctly_         | **passed** |           `0` |

### `[11]` [jsonata.test.ts](./src/test//jsonata.test.ts)

| Test                                             | Status     | Duration (ms) |
| ------------------------------------------------ | ---------- | ------------: |
| _evaluates JSONata expressions_                  | **passed** |           `2` |
| _returns undefined if no expression is provided_ | **passed** |           `0` |
| _catches errors when evaluating expressions_     | **passed** |           `6` |

### `[12]` [limit_csv.test.ts](./src/test//limit_csv.test.ts)

| Test                                                             | Status     | Duration (ms) |
| ---------------------------------------------------------------- | ---------- | ------------: |
| _should limit the number of rows correctly_                      | **passed** |           `0` |
| _should limit the number of rows correctly, for an object_       | **passed** |           `1` |
| _should return all rows if limit is greater than number of rows_ | **passed** |           `0` |
| _should return an empty array if input is empty_                 | **passed** |           `0` |
| _should not mutate the input node_                               | **passed** |           `0` |

### `[13]` [markdown.test.ts](./src/test//markdown.test.ts)

| Test                                                               | Status     | Duration (ms) |
| ------------------------------------------------------------------ | ---------- | ------------: |
| _should set markdown data if input is a string_                    | **passed** |           `1` |
| _should combine multiple string inputs with separation_            | **passed** |           `0` |
| _should wrap non-string inputs within code block_                  | **passed** |           `0` |
| _should handle an empty input object_                              | **passed** |           `1` |
| _should preserve the order of inputs when combining_               | **passed** |           `0` |
| _should stringify and wrap arrays in code blocks_                  | **passed** |           `0` |
| _should throw an error if input data contains circular references_ | **passed** |           `1` |

### `[14]` [merge.test.ts](./src/test//merge.test.ts)

| Test                                                                      | Status     | Duration (ms) |
| ------------------------------------------------------------------------- | ---------- | ------------: |
| _merges cluster_extraction and argument_extraction data_                  | **passed** |           `2` |
| _does not merge if cluster_extraction data is missing_                    | **passed** |           `0` |
| _does not merge if argument_extraction data is missing_                   | **passed** |           `0` |
| _does not merge if cluster_extraction data has no topics_                 | **passed** |           `0` |
| _sets node data output to the merged data and dirty to false after merge_ | **passed** |           `1` |

### `[15]` [merge_cluster_extraction.test.ts](./src/test//merge_cluster_extraction.test.ts)

| Test                                                | Status     | Duration (ms) |
| --------------------------------------------------- | ---------- | ------------: |
| _merges cluster extraction data_                    | **passed** |         `123` |
| _does not merge if cluster extractions are missing_ | **passed** |         `103` |
| _uses cached data if available and not dirty_       | **passed** |           `0` |
| _does not merge if no open_ai_key is provided_      | **passed** |           `0` |

### `[16]` [open_ai_key.test.ts](./src/test//open_ai_key.test.ts)

| Test                                                                                             | Status     | Duration (ms) |
| ------------------------------------------------------------------------------------------------ | ---------- | ------------: |
| _should set the key in cookies if the UI key is valid_                                           | **passed** |           `1` |
| _if ui key is set but invalid use local key_                                                     | **passed** |           `0` |
| _should set the node text to "Invalid key" if the UI key is not valid and there is no local key_ | **passed** |           `0` |
| _should not mutate the node if the UI key and local key are both valid_                          | **passed** |           `1` |

### `[17]` [participant_filter.test.ts](./src/test//participant_filter.test.ts)

| Test                                                      | Status     | Duration (ms) |
| --------------------------------------------------------- | ---------- | ------------: |
| _filters participants based on the provided name_         | **passed** |           `1` |
| _removes subtopics with no claims after filtering_        | **passed** |           `0` |
| _removes topics with no subtopics after filtering_        | **passed** |           `0` |
| _returns undefined if input data does not contain topics_ | **passed** |           `0` |
| _does not filter claims if interview key is missing_      | **passed** |           `1` |

### `[18]` [register.test.ts](./src/test//register.test.ts)

| Test                      | Status     | Duration (ms) |
| ------------------------- | ---------- | ------------: |
| _test node registeration_ | **passed** |           `1` |
| _Load all nodes_          | **passed** |         `536` |

### `[19]` [report.test.ts](./src/test//report.test.ts)

| Test                                                  | Status     | Duration (ms) |
| ----------------------------------------------------- | ---------- | ------------: |
| _should set the output of the node to the input data_ | **passed** |           `1` |
| _should handle empty input data_                      | **passed** |           `0` |
| _should not mutate the input node_                    | **passed** |           `0` |

### `[20]` [score_argument_relevance.test.ts](./src/test//score_argument_relevance.test.ts)

| Test                                                    | Status     | Duration (ms) |
| ------------------------------------------------------- | ---------- | ------------: |
| _scores the relevance of arguments_                     | **passed** |         `110` |
| _uses cached data if available and not dirty_           | **passed** |           `0` |
| _does not score if argument_extraction data is missing_ | **passed** |           `0` |
| _does not score if open_ai_key is missing_              | **passed** |           `0` |
| _does not score if prompts are missing_                 | **passed** |           `0` |

### `[21]` [stringify.test.ts](./src/test//stringify.test.ts)

| Test                                              | Status     | Duration (ms) |
| ------------------------------------------------- | ---------- | ------------: |
| _should correctly stringify input data_           | **passed** |           `0` |
| _should return input if it cannot be stringified_ | **passed** |           `0` |
| _should handle different types of input_          | **passed** |           `0` |
| _should not mutate the input node_                | **passed** |           `0` |

### `[22]` [translate.test.ts](./src/test//translate.test.ts)

| Test                                      | Status     | Duration (ms) |
| ----------------------------------------- | ---------- | ------------: |
| _translates the input data_               | **passed** |           `0` |
| _uses cached translations when available_ | **passed** |           `0` |

### `[23]` [workerpool.test.ts](./src/test//workerpool.test.ts)

| Test                                            | Status     | Duration (ms) |
| ----------------------------------------------- | ---------- | ------------: |
| _should execute function in workerpool_         | **passed** |          `27` |
| _should execute delayed function in workerpool_ | **passed** |        `1002` |
