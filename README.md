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
| Metric                | Count |
|-----------------------|------:|
| Total Test Suites     | 48 |
| Passed Test Suites    | 48 |
| Failed Test Suites    | 0 |
| Pending Test Suites   | 0 |
| Total Tests           | 84 |
| Passed Tests          | 84 |
| Failed Tests          | 0 |
| Pending Tests         | 0 |
| Todo Tests            | 0 |

### `[1]` [argument_extraction.test.ts](./src/test//argument_extraction.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *extract the given arguments* | **passed** | `40` |
| *should not extract the arguments if no csv* | **passed** | `0` |
| *should not extract the arguments if no open_ai_key and no GCS* | **passed** | `0` |
| *should load from GCS if no open ai key* | **passed** | `0` |
| *should not extract the arguments if no prompt and no system prompt* | **passed** | `0` |
| *test GCS caching* | **passed** | `1` |

### `[2]` [cluster_extraction.test.ts](./src/test//cluster_extraction.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *extract the cluster* | **passed** | `31` |
| *should not extract the cluster if no csv* | **passed** | `0` |
| *should not extract the cluster if no open_ai_key* | **passed** | `0` |
| *should not extract the cluster if no prompt and no system prompt* | **passed** | `0` |
| *test GCS caching* | **passed** | `1` |

### `[3]` [count_tokens.test.ts](./src/test//count_tokens.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *should correctly count tokens in input data* | **passed** | `276` |
| *should not count tokens if input data length matches and node is not dirty* | **passed** | `0` |

### `[4]` [csv.test.ts](./src/test//csv.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *should process CSV data correctly from GCS* | **passed** | `12` |
| *should handle empty CSV data from GCS* | **passed** | `2` |
| *should handle rows with uneven columns from GCS* | **passed** | `2` |

### `[5]` [dataset.test.ts](./src/test//dataset.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *Full pipeline run test* | **passed** | `157` |

### `[6]` [edit_csv.test.ts](./src/test//edit_csv.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *generates new columns* | **passed** | `1` |
| *deletes columns* | **passed** | `0` |
| *renames columns* | **passed** | `0` |
| *returns undefined if input is undefined* | **passed** | `0` |
| *handles multiple operations* | **passed** | `1` |
| *does not modify input if no operations are specified* | **passed** | `0` |
| *does not crash if input is empty* | **passed** | `0` |

### `[7]` [grid.test.ts](./src/test//grid.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *sets the output of the node to the input data* | **passed** | `2` |

### `[8]` [jq_v0.test.ts](./src/test//jq_v0.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *should process data correctly with JQ filter* | **passed** | `2` |
| *should handle invalid JQ filter* | **passed** | `0` |

### `[9]` [jq_v1.test.ts](./src/test//jq_v1.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *should process data correctly with JQ filter* | **passed** | `161` |
| *should handle invalid JQ filter* | **passed** | `2` |

### `[10]` [json.test.ts](./src/test//json.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *should process JSON data correctly from GCS* | **passed** | `2` |
| *should handle invalid JSON data from GCS* | **passed** | `1` |
| *should update dirty state correctly* | **passed** | `0` |

### `[11]` [jsonata.test.ts](./src/test//jsonata.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *evaluates JSONata expressions* | **passed** | `3` |
| *returns undefined if no expression is provided* | **passed** | `1` |
| *catches errors when evaluating expressions* | **passed** | `8` |

### `[12]` [limit_csv.test.ts](./src/test//limit_csv.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *should limit the number of rows correctly* | **passed** | `1` |
| *should limit the number of rows correctly, for an object* | **passed** | `0` |
| *should return all rows if limit is greater than number of rows* | **passed** | `0` |
| *should return an empty array if input is empty* | **passed** | `0` |
| *should not mutate the input node* | **passed** | `0` |

### `[13]` [markdown.test.ts](./src/test//markdown.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *should set markdown data if input is a string* | **passed** | `0` |
| *should combine multiple string inputs with separation* | **passed** | `1` |
| *should wrap non-string inputs within code block* | **passed** | `0` |
| *should handle an empty input object* | **passed** | `0` |
| *should preserve the order of inputs when combining* | **passed** | `0` |
| *should stringify and wrap arrays in code blocks* | **passed** | `0` |
| *should throw an error if input data contains circular references* | **passed** | `1` |

### `[14]` [merge.test.ts](./src/test//merge.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *merges cluster_extraction and argument_extraction data* | **passed** | `2` |
| *does not merge if cluster_extraction data is missing* | **passed** | `1` |
| *does not merge if argument_extraction data is missing* | **passed** | `0` |
| *does not merge if cluster_extraction data has no topics* | **passed** | `0` |
| *sets node data output to the merged data and dirty to false after merge* | **passed** | `0` |

### `[15]` [merge_cluster_extraction.test.ts](./src/test//merge_cluster_extraction.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *merges cluster extraction data* | **passed** | `144` |
| *does not merge if cluster extractions are missing* | **passed** | `109` |
| *uses cached data if available and not dirty* | **passed** | `0` |
| *does not merge if no open_ai_key is provided* | **passed** | `1` |

### `[16]` [open_ai_key.test.ts](./src/test//open_ai_key.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *should set the key in cookies if the UI key is valid* | **passed** | `1` |
| *if ui key is set but invalid use local key* | **passed** | `0` |
| *should set the node text to "Invalid key" if the UI key is not valid and there is no local key* | **passed** | `1` |
| *should not mutate the node if the UI key and local key are both valid* | **passed** | `0` |

### `[17]` [participant_filter.test.ts](./src/test//participant_filter.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *filters participants based on the provided name* | **passed** | `2` |
| *removes subtopics with no claims after filtering* | **passed** | `0` |
| *removes topics with no subtopics after filtering* | **passed** | `0` |
| *returns undefined if input data does not contain topics* | **passed** | `0` |
| *does not filter claims if interview key is missing* | **passed** | `0` |

### `[18]` [register.test.ts](./src/test//register.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *test node registeration* | **passed** | `1` |
| *Load all nodes* | **passed** | `763` |

### `[19]` [report.test.ts](./src/test//report.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *should set the output of the node to the input data* | **passed** | `1` |
| *should handle empty input data* | **passed** | `0` |
| *should not mutate the input node* | **passed** | `0` |

### `[20]` [score_argument_relevance.test.ts](./src/test//score_argument_relevance.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *scores the relevance of arguments* | **passed** | `109` |
| *uses cached data if available and not dirty* | **passed** | `1` |
| *does not score if argument_extraction data is missing* | **passed** | `0` |
| *does not score if open_ai_key is missing* | **passed** | `0` |
| *does not score if prompts are missing* | **passed** | `0` |

### `[21]` [simple_pipeline.test.ts](./src/test//simple_pipeline.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *should process CSV data correctly from GCS* | **passed** | `9` |

### `[22]` [stringify.test.ts](./src/test//stringify.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *should correctly stringify input data* | **passed** | `1` |
| *should return input if it cannot be stringified* | **passed** | `0` |
| *should handle different types of input* | **passed** | `0` |
| *should not mutate the input node* | **passed** | `1` |

### `[23]` [translate.test.ts](./src/test//translate.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *translates the input data* | **passed** | `0` |
| *uses cached translations when available* | **passed** | `0` |

### `[24]` [workerpool.test.ts](./src/test//workerpool.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *should execute function in workerpool* | **passed** | `25` |
| *should execute delayed function in workerpool* | **passed** | `1003` |
