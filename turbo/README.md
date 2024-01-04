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
- Copy `.env.example` to `.env` in the `turbo` directory
- Copy & paste the values of the variables.
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
| Metric                | Count |
|-----------------------|------:|
| Total Test Suites     | 56 |
| Passed Test Suites    | 56 |
| Failed Test Suites    | 0 |
| Pending Test Suites   | 0 |
| Total Tests           | 102 |
| Passed Tests          | 102 |
| Failed Tests          | 0 |
| Pending Tests         | 0 |
| Todo Tests            | 0 |

### `[1]` [argument_extraction.test.ts](./src/test//argument_extraction.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *extract the given arguments* | **passed** | `90` |
| *should not extract the arguments if no csv* | **passed** | `0` |
| *should not extract the arguments if no open_ai_key and no GCS* | **passed** | `1` |
| *should load from GCS if no open ai key* | **passed** | `0` |
| *should not extract the arguments if no prompt and no system prompt* | **passed** | `0` |
| *test GCS caching* | **passed** | `1` |

### `[2]` [chat.test.ts](./src/test//chat.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *compute should set output to messages and dirty to false* | **passed** | `3` |
| *chat should add assistant response to messages* | **passed** | `528` |
| *chat should use initial_messages if only one message is present* | **passed** | `225` |

### `[3]` [cluster_extraction.test.ts](./src/test//cluster_extraction.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *extract the cluster* | **passed** | `57` |
| *should not extract the cluster if no csv* | **passed** | `1` |
| *should not extract the cluster if no open_ai_key* | **passed** | `0` |
| *should not extract the cluster if no prompt and no system prompt* | **passed** | `1` |
| *test GCS caching* | **passed** | `0` |

### `[4]` [count_tokens.test.ts](./src/test//count_tokens.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *should correctly count tokens in input data* | **passed** | `551` |
| *should not count tokens if input data length matches and node is not dirty* | **passed** | `377` |
| *should count tokens if the input data is a string* | **passed** | `390` |

### `[5]` [csv.test.ts](./src/test//csv.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *should process CSV data correctly from GCS* | **passed** | `67` |
| *should handle empty CSV data from GCS* | **passed** | `13` |
| *should handle rows with uneven columns from GCS* | **passed** | `7` |

### `[6]` [dataset.test.ts](./src/test//dataset.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *Find by compute type* | **passed** | `2` |
| *Simple pipeline run test* | **passed** | `1` |
| *Markdown to chat test* | **passed** | `257` |
| *Full pipeline run test* | **passed** | `1503` |

### `[7]` [edit_csv.test.ts](./src/test//edit_csv.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *generates new columns* | **passed** | `2` |
| *deletes columns* | **passed** | `1` |
| *renames columns* | **passed** | `0` |
| *returns undefined if input is undefined* | **passed** | `0` |
| *handles multiple operations* | **passed** | `0` |
| *does not modify input if no operations are specified* | **passed** | `0` |
| *does not crash if input is empty* | **passed** | `0` |

### `[8]` [grid.test.ts](./src/test//grid.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *sets the output of the node to the input data* | **passed** | `2` |

### `[9]` [jq_v0.test.ts](./src/test//jq_v0.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *should process data correctly with JQ filter* | **passed** | `4` |
| *should handle invalid JQ filter* | **passed** | `1` |

### `[10]` [jq_v1.test.ts](./src/test//jq_v1.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *should process data correctly with JQ filter* | **passed** | `1242` |
| *should handle invalid JQ filter* | **passed** | `4` |

### `[11]` [json.test.ts](./src/test//json.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *should process JSON data correctly from GCS* | **passed** | `23` |
| *should handle invalid JSON data from GCS* | **passed** | `0` |
| *should update dirty state correctly* | **passed** | `1` |

### `[12]` [jsonata.test.ts](./src/test//jsonata.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *evaluates JSONata expressions* | **passed** | `3` |
| *returns undefined if no expression is provided* | **passed** | `1` |
| *catches errors when evaluating expressions* | **passed** | `10` |

### `[13]` [limit_csv.test.ts](./src/test//limit_csv.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *should limit the number of rows correctly* | **passed** | `2` |
| *should limit the number of rows correctly, for an object* | **passed** | `1` |
| *should return all rows if limit is greater than number of rows* | **passed** | `0` |
| *should return an empty array if input is empty* | **passed** | `0` |
| *should not mutate the input node* | **passed** | `0` |

### `[14]` [markdown.test.ts](./src/test//markdown.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *should set markdown data if input is a string* | **passed** | `2` |
| *should combine multiple string inputs with separation* | **passed** | `1` |
| *should wrap non-string inputs within code block* | **passed** | `0` |
| *should handle an empty input object* | **passed** | `0` |
| *should preserve the order of inputs when combining* | **passed** | `1` |
| *should stringify and wrap arrays in code blocks* | **passed** | `0` |
| *should throw an error if input data contains circular references* | **passed** | `1` |

### `[15]` [merge.test.ts](./src/test//merge.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *merges cluster_extraction and argument_extraction data* | **passed** | `4` |
| *does not merge if cluster_extraction data is missing* | **passed** | `1` |
| *does not merge if argument_extraction data is missing* | **passed** | `0` |
| *does not merge if cluster_extraction data has no topics* | **passed** | `0` |
| *sets node data output to the merged data and dirty to false after merge* | **passed** | `1` |

### `[16]` [merge_cluster_extraction.test.ts](./src/test//merge_cluster_extraction.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *merges cluster extraction data* | **passed** | `158` |
| *does not merge if cluster extractions are missing* | **passed** | `104` |
| *uses cached data if available and not dirty* | **passed** | `1` |
| *does not merge if no open_ai_key is provided* | **passed** | `0` |

### `[17]` [open_ai_key.test.ts](./src/test//open_ai_key.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *should set the key in cookies if the UI key is valid* | **passed** | `2` |
| *if ui key is set but invalid use local key* | **passed** | `0` |
| *should set the node text to "Invalid key" if the UI key is not valid and there is no local key* | **passed** | `0` |
| *should not mutate the node if the UI key and local key are both valid* | **passed** | `1` |

### `[18]` [participant_filter.test.ts](./src/test//participant_filter.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *filters participants based on the provided name* | **passed** | `2` |
| *removes subtopics with no claims after filtering* | **passed** | `0` |
| *removes topics with no subtopics after filtering* | **passed** | `1` |
| *returns undefined if input data does not contain topics* | **passed** | `0` |
| *does not filter claims if interview key is missing* | **passed** | `0` |

### `[19]` [pyodide.test.ts](./src/test//pyodide.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *should execute python script and return outputData* | **passed** | `3432` |
| *should be able to pass input to outputData* | **passed** | `2` |
| *test passing in complex data from jsonapi* | **passed** | `2627` |

### `[20]` [python.integration.test.ts](./src/test//python.integration.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *should execute python script and return outputData* | **passed** | `1458` |
| *should be able to pass input to outputData* | **passed** | `311` |
| *should be able to make get requests to jsonapi* | **passed** | `826` |

### `[21]` [python.test.ts](./src/test//python.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *should execute python script and return output* | **passed** | `3` |
| *should handle fetch errors gracefully* | **passed** | `1` |
| *should handle invalid JSON response* | **passed** | `1` |
| *should handle non-string JSON response* | **passed** | `0` |
| *should update node data output with the response* | **passed** | `0` |

### `[22]` [register.test.ts](./src/test//register.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *test node registeration* | **passed** | `2` |
| *Load all nodes* | **passed** | `1268` |

### `[23]` [report.test.ts](./src/test//report.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *should set the output of the node to the input data* | **passed** | `2` |
| *should handle empty input data* | **passed** | `1` |
| *should not mutate the input node* | **passed** | `0` |

### `[24]` [score_argument_relevance.test.ts](./src/test//score_argument_relevance.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *scores the relevance of arguments* | **passed** | `103` |
| *uses cached data if available and not dirty* | **passed** | `1` |
| *does not score if argument_extraction data is missing* | **passed** | `0` |
| *does not score if open_ai_key is missing* | **passed** | `0` |
| *does not score if prompts are missing* | **passed** | `0` |

### `[25]` [simple_pipeline.test.ts](./src/test//simple_pipeline.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *should process CSV data correctly from GCS* | **passed** | `13` |

### `[26]` [stringify.test.ts](./src/test//stringify.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *should correctly stringify input data* | **passed** | `2` |
| *should return input if it cannot be stringified* | **passed** | `0` |
| *should handle different types of input* | **passed** | `0` |
| *should not mutate the input node* | **passed** | `1` |

### `[27]` [translate.test.ts](./src/test//translate.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *translates the input data* | **passed** | `17` |
| *uses cached translations when available* | **passed** | `0` |

### `[28]` [workerpool.test.ts](./src/test//workerpool.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *should execute function in workerpool* | **passed** | `61` |
| *should execute delayed function in workerpool* | **passed** | `1002` |
