# tttc-turbo

This application creates reports based on participant surveys.

https://tttc-turbo.web.app/

## Nodes

To add pipeline computation nodes:

- create the compute function in `src/lib/compute/`
- create a UI component as required, in `src/components/` (or preferably: use an existing one)
- register the component and compute function in `src/lib/node_types.ts`
- add the node to `src/lib/templates.ts`



## Test Results
| Metric                | Count |
|-----------------------|------:|
| Total Test Suites     | 44 |
| Passed Test Suites    | 44 |
| Failed Test Suites    | 0 |
| Pending Test Suites   | 0 |
| Total Tests           | 78 |
| Passed Tests          | 78 |
| Failed Tests          | 0 |
| Pending Tests         | 0 |
| Todo Tests            | 0 |

### `[1]` [argument_extraction.test.ts](./src/test//argument_extraction.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *extract the given arguments* | **passed** | `134` |
| *should not extract the arguments if no csv* | **passed** | `0` |
| *should not extract the arguments if no open_ai_key and no GCS* | **passed** | `0` |
| *should extract the arguments if no open_ai_key and GCS* | **passed** | `0` |
| *should not extract the arguments if no prompt and no system prompt* | **passed** | `1` |
| *test GCS caching* | **passed** | `0` |

### `[2]` [cluster_extraction.test.ts](./src/test//cluster_extraction.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *extract the cluster* | **passed** | `137` |
| *should not extract the cluster if no csv* | **passed** | `0` |
| *should not extract the cluster if no open_ai_key* | **passed** | `0` |
| *should not extract the cluster if no prompt and no system prompt* | **passed** | `0` |
| *test GCS caching* | **passed** | `1` |

### `[3]` [count_tokens.test.ts](./src/test//count_tokens.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *should correctly count tokens in input data* | **passed** | `290` |
| *should not count tokens if input data length matches and node is not dirty* | **passed** | `0` |

### `[4]` [csv.test.ts](./src/test//csv.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *should process CSV data correctly from GCS* | **passed** | `6` |
| *should handle empty CSV data from GCS* | **passed** | `2` |
| *should handle rows with uneven columns from GCS* | **passed** | `3` |

### `[5]` [dataset.test.ts](./src/test//dataset.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *CSV JQ test* | **passed** | `320` |

### `[6]` [edit_csv.test.ts](./src/test//edit_csv.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *generates new columns* | **passed** | `2` |
| *deletes columns* | **passed** | `1` |
| *renames columns* | **passed** | `0` |
| *returns undefined if input is undefined* | **passed** | `0` |
| *handles multiple operations* | **passed** | `0` |
| *does not modify input if no operations are specified* | **passed** | `0` |
| *does not crash if input is empty* | **passed** | `1` |

### `[7]` [grid.test.ts](./src/test//grid.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *sets the output of the node to the input data* | **passed** | `1` |

### `[8]` [jq_v0.test.ts](./src/test//jq_v0.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *should process data correctly with JQ filter* | **passed** | `2` |
| *should handle invalid JQ filter* | **passed** | `2` |

### `[9]` [jq_v1.test.ts](./src/test//jq_v1.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *should process data correctly with JQ filter* | **passed** | `171` |
| *should handle invalid JQ filter* | **passed** | `3` |

### `[10]` [json.test.ts](./src/test//json.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *should process JSON data correctly from GCS* | **passed** | `1` |
| *should handle invalid JSON data from GCS* | **passed** | `1` |
| *should update dirty state correctly* | **passed** | `0` |

### `[11]` [jsonata.test.ts](./src/test//jsonata.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *evaluates JSONata expressions* | **passed** | `2` |
| *returns undefined if no expression is provided* | **passed** | `0` |
| *catches errors when evaluating expressions* | **passed** | `5` |

### `[12]` [limit_csv.test.ts](./src/test//limit_csv.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *should limit the number of rows correctly* | **passed** | `1` |
| *should limit the number of rows correctly, for an object* | **passed** | `1` |
| *should return all rows if limit is greater than number of rows* | **passed** | `0` |
| *should return an empty array if input is empty* | **passed** | `0` |
| *should not mutate the input node* | **passed** | `0` |

### `[13]` [markdown.test.ts](./src/test//markdown.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *should set markdown data if input is a string* | **passed** | `2` |
| *should not set markdown data if input is not a string* | **passed** | `0` |
| *should not set markdown data if input is undefined* | **passed** | `1` |
| *should not set markdown data if input is null* | **passed** | `0` |
| *should not set markdown data if input is an object* | **passed** | `0` |

### `[14]` [merge.test.ts](./src/test//merge.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *merges cluster_extraction and argument_extraction data* | **passed** | `2` |
| *does not merge if cluster_extraction data is missing* | **passed** | `0` |
| *does not merge if argument_extraction data is missing* | **passed** | `0` |
| *does not merge if cluster_extraction data has no topics* | **passed** | `0` |
| *sets node data output to the merged data and dirty to false after merge* | **passed** | `0` |

### `[15]` [merge_cluster_extraction.test.ts](./src/test//merge_cluster_extraction.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *merges cluster extraction data* | **passed** | `120` |
| *does not merge if cluster extractions are missing* | **passed** | `106` |
| *uses cached data if available and not dirty* | **passed** | `2` |
| *does not merge if no open_ai_key is provided* | **passed** | `0` |

### `[16]` [open_ai_key.test.ts](./src/test//open_ai_key.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *should set the key in cookies if the UI key is valid* | **passed** | `1` |
| *if ui key is set but invalid use local key* | **passed** | `1` |
| *should set the node text to "Invalid key" if the UI key is not valid and there is no local key* | **passed** | `0` |
| *should not mutate the node if the UI key and local key are both valid* | **passed** | `0` |

### `[17]` [participant_filter.test.ts](./src/test//participant_filter.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *filters participants based on the provided name* | **passed** | `1` |
| *removes subtopics with no claims after filtering* | **passed** | `0` |
| *removes topics with no subtopics after filtering* | **passed** | `1` |
| *returns undefined if input data does not contain topics* | **passed** | `0` |
| *does not filter claims if interview key is missing* | **passed** | `0` |

### `[18]` [register.test.ts](./src/test//register.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *test node registeration* | **passed** | `12` |

### `[19]` [report.test.ts](./src/test//report.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *should set the output of the node to the input data* | **passed** | `1` |
| *should handle empty input data* | **passed** | `0` |
| *should not mutate the input node* | **passed** | `0` |

### `[20]` [score_argument_relevance.test.ts](./src/test//score_argument_relevance.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *scores the relevance of arguments* | **passed** | `116` |
| *uses cached data if available and not dirty* | **passed** | `1` |
| *does not score if argument_extraction data is missing* | **passed** | `0` |
| *does not score if open_ai_key is missing* | **passed** | `1` |
| *does not score if prompts are missing* | **passed** | `0` |

### `[21]` [stringify.test.ts](./src/test//stringify.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *should correctly stringify input data* | **passed** | `1` |
| *should return input if it cannot be stringified* | **passed** | `1` |
| *should handle different types of input* | **passed** | `0` |
| *should not mutate the input node* | **passed** | `1` |

### `[22]` [translate.test.ts](./src/test//translate.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *translates the input data* | **passed** | `0` |
| *uses cached translations when available* | **passed** | `0` |
