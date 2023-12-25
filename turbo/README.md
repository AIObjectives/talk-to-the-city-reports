# tttc-turbo

This application creates reports based on participant surveys.

[https://tttc-turbo.web.app](https://tttc-turbo.web.app)

Repo link: [https://github.com/AIObjectives/talk-to-the-city-reports](https://github.com/AIObjectives/talk-to-the-city-reports)

Note: we are getting ready to open source this repo. Cleaning up in progress.

## Cloning

```bash
$ git clone https://github.com/AIObjectives/talk-to-the-city-reports
```

Or with your dev token:

```bash
$ git clone https://<my-github-dev-token>@github.com/AIObjectives/talk-to-the-city-reports
```

## Firebase

<details>
<summary>Setting up a firebase instance</summary>

## Setting up a firebase instance

Since the app uses Firebase, you'll need a dev / staging firebase instance for local development, and for deployment. To do so, you have two options:

- setting up your own instance.
- using AOI's dev instance.

Deploying and maintaining google cloud platform resources is fairly simple and straight forwards although requires the use of the `gcloud` and `gsutil` CLI applications. So before we get started make sure you have those correctly installed, and authenticated.

[https://cloud.google.com/sdk/docs/install](https://cloud.google.com/sdk/docs/install)

## Setting up your own instance

To set up your own instance:

- Head over to [https://console.firebase.google.com/](https://console.firebase.google.com/)
- Click "add project" and enter a project name
- Disable google analytics
- Click "create project" & continue
- Under "Get started by adding Firebase to your app" click on the web `</>` icon
- Add an app nickname (same as earlier)
- Click "firebase hosting" if you intend to deploy the app
- Click "register app"
- Create a `.env` file in the `turbo` directory, with the following content:

```bash
VITE_APP_API_KEY=""
VITE_APP_AUTH_DOMAIN=""
VITE_APP_PROJECT_ID=""
VITE_APP_STORAGE_BUCKET=""
VITE_APP_MESSAGING_SENDER_ID=""
VITE_APP_APP_ID=""
VITE_APP_MEASUREMENT_ID=""
```

- Copy & paste the values in those variables.
- Click next.
- `npm install -g firebase-tools`
- `firebase login`

### Setting up authentication

- In the project overview, click on "Authentication"
- Click on "set up sign-in method"
- Click 'Google'
- Click 'enable'
- Select a support email address
- Click 'save'

### Setting up firestore

- In the project overview, in the left side panel, click on "build"
- Click on "firestore database"
- Click "Create Database"
- Select your region / multi region
- Click 'next'
- Click 'Start in test mode'
- Click 'enable'

N.B Firestore rules are still being finalized. Please contact @lightningorb to find out more.

### Setting up Google Cloud Storage

- In the project overview, in the left side panel, click on "build"
- Click on 'storage'
- Click 'get started'
- Click 'start in test mode'
- Click next
- Click done

#### Setting up CORS on GSC

- Install and configure the gsutil application
- Save the following in a temporary `cors.json` file

```json
[
	{
		"origin": ["http://localhost:5173", "https://<optional_deployment_url>"],
		"method": ["GET", "HEAD", "DELETE"],
		"responseHeader": ["Content-Type"],
		"maxAgeSeconds": 3600
	}
]
```

- Install the `gsutil` application
- Run the following:

```bash
gsutil cors set cors.json gs://<project-name>.appspot.com
```

### Setting up the service account

Authenticated backend endpoints require the service account file:

- in the console for the project, click on project settings (the cog icon)
- click on "service accounts"
- click "generate private key"
- save the json private key to turbo/src/lib/service-account-pk.json

### Using AOI's dev instance

- Contact @brittneygallagher or @lightningorb for credentials files
- save the provided `.env` in `turbo/`
- save the provided `service-account-pk.json` in `turbo/src/lib/`
- `npm install -g firebase-tools`
- `firebase login`

### Deploying to firebase

Once you're done making your changes, you can deploy to firebase with:

```bash
$ firebase deploy
```

</details>

## Running

Once you have set up a Firebase instance:

Node version tested: `v18.0.0`

```bash
$ cd talk-to-the-city-reports/turbo
$ npm install --legacy-peer-deps # or --force
$ npm run dev
```

## Dev documentation

<details>
<summary>Adding a node</summary>

## Adding new nodes

To add pipeline computation nodes:

- create the compute function in `src/lib/compute/`
- look for a suitable UI component in `src/components/`
  - In the vast majority of cases, you should be able to simply use an existing UI component. If a UI component does not suit your needs, then feel free to create a new one.
- Bind the node's compute type with a component in `src/lib/node_types.ts`
- add the node to `src/lib/templates.ts`
- add node documentation to `src/lib/docs`

</details>

<details>
<summary>Node UI component hierarchy</summary>

## Node UI component hierarchy:

The primary UI components displayed to users are called "nodes" as they are part of a dependency graph.

The docs that appear when the user presses the `?` mark are stored in:

`src/lib/docs`

### Adding text inside nodes:

The UI nodes are stored in `./turbo/src/components/graph/nodes`.

[DGNode](./turbo/src/components/graph/nodes/DGNode.svelte) is the 'base' node, that all nodes reuse. [DefaultNode](./turbo/src/components/graph/nodes/DefaultNode.svelte) is an empty generic node, when nodes don't have a specialized UI. [DefaultNode](./turbo/src/components/graph/nodes/UploadFileNode.svelte) is the generic file upload, which [CSVNode](./turbo/src/components/graph/nodes/CSVNode.svelte) and [JSON](./turbo/src/components/graph/nodes/JSONNode.svelte) reuse.

This is the "Argument Extraction" and "Cluster Extraction" etc. nodes, essentially all nodes requiring prompts to interact with GPTs use the [PromptNode](./turbo/src/components/graph/nodes/PromptNode.svelte).

</details>

<details>
<summary>Internationalization</summary>

## Internationalization:

`src/lib/i18n/en.json`  
`src/lib/zh-TW.json`

Since we use internationalization, UI strings use:

```html
<script lang='ts>
    import { _ as __ } from 'svelte-i18n';
</script>


<p>{$__('this_is_a_string')}</p>
```

The localized strings is then added to their respective `src/lib/<lang>.json` files.

</details>

<details>
<summary>Tests & TDD</summary>

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
| Total Test Suites   |    48 |
| Passed Test Suites  |    48 |
| Failed Test Suites  |     0 |
| Pending Test Suites |     0 |
| Total Tests         |    84 |
| Passed Tests        |    84 |
| Failed Tests        |     0 |
| Pending Tests       |     0 |
| Todo Tests          |     0 |

### `[1]` [argument_extraction.test.ts](./src/test//argument_extraction.test.ts)

| Test                                                                 | Status     | Duration (ms) |
| -------------------------------------------------------------------- | ---------- | ------------: |
| _extract the given arguments_                                        | **passed** |          `40` |
| _should not extract the arguments if no csv_                         | **passed** |           `0` |
| _should not extract the arguments if no open_ai_key and no GCS_      | **passed** |           `0` |
| _should load from GCS if no open ai key_                             | **passed** |           `0` |
| _should not extract the arguments if no prompt and no system prompt_ | **passed** |           `0` |
| _test GCS caching_                                                   | **passed** |           `1` |

### `[2]` [cluster_extraction.test.ts](./src/test//cluster_extraction.test.ts)

| Test                                                               | Status     | Duration (ms) |
| ------------------------------------------------------------------ | ---------- | ------------: |
| _extract the cluster_                                              | **passed** |          `31` |
| _should not extract the cluster if no csv_                         | **passed** |           `0` |
| _should not extract the cluster if no open_ai_key_                 | **passed** |           `0` |
| _should not extract the cluster if no prompt and no system prompt_ | **passed** |           `0` |
| _test GCS caching_                                                 | **passed** |           `1` |

### `[3]` [count_tokens.test.ts](./src/test//count_tokens.test.ts)

| Test                                                                         | Status     | Duration (ms) |
| ---------------------------------------------------------------------------- | ---------- | ------------: |
| _should correctly count tokens in input data_                                | **passed** |         `276` |
| _should not count tokens if input data length matches and node is not dirty_ | **passed** |           `0` |

### `[4]` [csv.test.ts](./src/test//csv.test.ts)

| Test                                              | Status     | Duration (ms) |
| ------------------------------------------------- | ---------- | ------------: |
| _should process CSV data correctly from GCS_      | **passed** |          `12` |
| _should handle empty CSV data from GCS_           | **passed** |           `2` |
| _should handle rows with uneven columns from GCS_ | **passed** |           `2` |

### `[5]` [dataset.test.ts](./src/test//dataset.test.ts)

| Test                     | Status     | Duration (ms) |
| ------------------------ | ---------- | ------------: |
| _Full pipeline run test_ | **passed** |         `157` |

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
| _sets the output of the node to the input data_ | **passed** |           `2` |

### `[8]` [jq_v0.test.ts](./src/test//jq_v0.test.ts)

| Test                                           | Status     | Duration (ms) |
| ---------------------------------------------- | ---------- | ------------: |
| _should process data correctly with JQ filter_ | **passed** |           `2` |
| _should handle invalid JQ filter_              | **passed** |           `0` |

### `[9]` [jq_v1.test.ts](./src/test//jq_v1.test.ts)

| Test                                           | Status     | Duration (ms) |
| ---------------------------------------------- | ---------- | ------------: |
| _should process data correctly with JQ filter_ | **passed** |         `161` |
| _should handle invalid JQ filter_              | **passed** |           `2` |

### `[10]` [json.test.ts](./src/test//json.test.ts)

| Test                                          | Status     | Duration (ms) |
| --------------------------------------------- | ---------- | ------------: |
| _should process JSON data correctly from GCS_ | **passed** |           `2` |
| _should handle invalid JSON data from GCS_    | **passed** |           `1` |
| _should update dirty state correctly_         | **passed** |           `0` |

### `[11]` [jsonata.test.ts](./src/test//jsonata.test.ts)

| Test                                             | Status     | Duration (ms) |
| ------------------------------------------------ | ---------- | ------------: |
| _evaluates JSONata expressions_                  | **passed** |           `3` |
| _returns undefined if no expression is provided_ | **passed** |           `1` |
| _catches errors when evaluating expressions_     | **passed** |           `8` |

### `[12]` [limit_csv.test.ts](./src/test//limit_csv.test.ts)

| Test                                                             | Status     | Duration (ms) |
| ---------------------------------------------------------------- | ---------- | ------------: |
| _should limit the number of rows correctly_                      | **passed** |           `1` |
| _should limit the number of rows correctly, for an object_       | **passed** |           `0` |
| _should return all rows if limit is greater than number of rows_ | **passed** |           `0` |
| _should return an empty array if input is empty_                 | **passed** |           `0` |
| _should not mutate the input node_                               | **passed** |           `0` |

### `[13]` [markdown.test.ts](./src/test//markdown.test.ts)

| Test                                                               | Status     | Duration (ms) |
| ------------------------------------------------------------------ | ---------- | ------------: |
| _should set markdown data if input is a string_                    | **passed** |           `0` |
| _should combine multiple string inputs with separation_            | **passed** |           `1` |
| _should wrap non-string inputs within code block_                  | **passed** |           `0` |
| _should handle an empty input object_                              | **passed** |           `0` |
| _should preserve the order of inputs when combining_               | **passed** |           `0` |
| _should stringify and wrap arrays in code blocks_                  | **passed** |           `0` |
| _should throw an error if input data contains circular references_ | **passed** |           `1` |

### `[14]` [merge.test.ts](./src/test//merge.test.ts)

| Test                                                                      | Status     | Duration (ms) |
| ------------------------------------------------------------------------- | ---------- | ------------: |
| _merges cluster_extraction and argument_extraction data_                  | **passed** |           `2` |
| _does not merge if cluster_extraction data is missing_                    | **passed** |           `1` |
| _does not merge if argument_extraction data is missing_                   | **passed** |           `0` |
| _does not merge if cluster_extraction data has no topics_                 | **passed** |           `0` |
| _sets node data output to the merged data and dirty to false after merge_ | **passed** |           `0` |

### `[15]` [merge_cluster_extraction.test.ts](./src/test//merge_cluster_extraction.test.ts)

| Test                                                | Status     | Duration (ms) |
| --------------------------------------------------- | ---------- | ------------: |
| _merges cluster extraction data_                    | **passed** |         `144` |
| _does not merge if cluster extractions are missing_ | **passed** |         `109` |
| _uses cached data if available and not dirty_       | **passed** |           `0` |
| _does not merge if no open_ai_key is provided_      | **passed** |           `1` |

### `[16]` [open_ai_key.test.ts](./src/test//open_ai_key.test.ts)

| Test                                                                                             | Status     | Duration (ms) |
| ------------------------------------------------------------------------------------------------ | ---------- | ------------: |
| _should set the key in cookies if the UI key is valid_                                           | **passed** |           `1` |
| _if ui key is set but invalid use local key_                                                     | **passed** |           `0` |
| _should set the node text to "Invalid key" if the UI key is not valid and there is no local key_ | **passed** |           `1` |
| _should not mutate the node if the UI key and local key are both valid_                          | **passed** |           `0` |

### `[17]` [participant_filter.test.ts](./src/test//participant_filter.test.ts)

| Test                                                      | Status     | Duration (ms) |
| --------------------------------------------------------- | ---------- | ------------: |
| _filters participants based on the provided name_         | **passed** |           `2` |
| _removes subtopics with no claims after filtering_        | **passed** |           `0` |
| _removes topics with no subtopics after filtering_        | **passed** |           `0` |
| _returns undefined if input data does not contain topics_ | **passed** |           `0` |
| _does not filter claims if interview key is missing_      | **passed** |           `0` |

### `[18]` [register.test.ts](./src/test//register.test.ts)

| Test                      | Status     | Duration (ms) |
| ------------------------- | ---------- | ------------: |
| _test node registeration_ | **passed** |           `1` |
| _Load all nodes_          | **passed** |         `763` |

### `[19]` [report.test.ts](./src/test//report.test.ts)

| Test                                                  | Status     | Duration (ms) |
| ----------------------------------------------------- | ---------- | ------------: |
| _should set the output of the node to the input data_ | **passed** |           `1` |
| _should handle empty input data_                      | **passed** |           `0` |
| _should not mutate the input node_                    | **passed** |           `0` |

### `[20]` [score_argument_relevance.test.ts](./src/test//score_argument_relevance.test.ts)

| Test                                                    | Status     | Duration (ms) |
| ------------------------------------------------------- | ---------- | ------------: |
| _scores the relevance of arguments_                     | **passed** |         `109` |
| _uses cached data if available and not dirty_           | **passed** |           `1` |
| _does not score if argument_extraction data is missing_ | **passed** |           `0` |
| _does not score if open_ai_key is missing_              | **passed** |           `0` |
| _does not score if prompts are missing_                 | **passed** |           `0` |

### `[21]` [simple_pipeline.test.ts](./src/test//simple_pipeline.test.ts)

| Test                                         | Status     | Duration (ms) |
| -------------------------------------------- | ---------- | ------------: |
| _should process CSV data correctly from GCS_ | **passed** |           `9` |

### `[22]` [stringify.test.ts](./src/test//stringify.test.ts)

| Test                                              | Status     | Duration (ms) |
| ------------------------------------------------- | ---------- | ------------: |
| _should correctly stringify input data_           | **passed** |           `1` |
| _should return input if it cannot be stringified_ | **passed** |           `0` |
| _should handle different types of input_          | **passed** |           `0` |
| _should not mutate the input node_                | **passed** |           `1` |

### `[23]` [translate.test.ts](./src/test//translate.test.ts)

| Test                                      | Status     | Duration (ms) |
| ----------------------------------------- | ---------- | ------------: |
| _translates the input data_               | **passed** |           `0` |
| _uses cached translations when available_ | **passed** |           `0` |

### `[24]` [workerpool.test.ts](./src/test//workerpool.test.ts)

| Test                                            | Status     | Duration (ms) |
| ----------------------------------------------- | ---------- | ------------: |
| _should execute function in workerpool_         | **passed** |          `25` |
| _should execute delayed function in workerpool_ | **passed** |        `1003` |

</details>
