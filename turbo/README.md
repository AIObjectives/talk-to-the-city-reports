[![tests](https://github.com/AIObjectives/talk-to-the-city-reports/actions/workflows/tests.yaml/badge.svg)](https://github.com/AIObjectives/talk-to-the-city-reports/actions/workflows/tests.yaml)

[![License](https://img.shields.io/badge/License-GPL3-blue)](#license)

![Svelte](https://img.shields.io/badge/dynamic/json?color=ff3e00&label=Svelte&query=%24.devDependencies.svelte&url=https%3A%2F%2Fraw.githubusercontent.com%2FAIObjectives%2Ftalk-to-the-city-reports%2Fmain%2Fturbo%2Fpackage.json)
![Typescript](https://img.shields.io/badge/dynamic/json?label=Typescript&query=%24.devDependencies.typescript&url=https%3A%2F%2Fraw.githubusercontent.com%2FAIObjectives%2Ftalk-to-the-city-reports%2Fmain%2Fturbo%2Fpackage.json)
[![Made with Node.js](https://img.shields.io/badge/Node.js->=18-blue?logo=node.js&logoColor=white)](https://nodejs.org "Go to Node.js homepage")

![Vitest Passing](https://img.shields.io/badge/dynamic/json?color=blueviolet&label=Vitest+Passing&query=%24.vitestPass&url=https%3A%2F%2Fraw.githubusercontent.com%2FAIObjectives%2Ftalk-to-the-city-reports%2Fmain%2Fturbo%2Fpackage.json)
![Vitest Failing](https://img.shields.io/badge/dynamic/json?color=blueviolet&label=Vitest+Failing&query=%24.vitestFail&url=https%3A%2F%2Fraw.githubusercontent.com%2FAIObjectives%2Ftalk-to-the-city-reports%2Fmain%2Fturbo%2Fpackage.json)

![Typescript Coverage](https://img.shields.io/badge/dynamic/json?color=blueviolet&label=Typescript+Coverage&query=%24.tsCoverage&url=https%3A%2F%2Fraw.githubusercontent.com%2FAIObjectives%2Ftalk-to-the-city-reports%2Fmain%2Fturbo%2Fpackage.json)


# Talk to the City

Talk to the City is an application that:

- ingests unstructured natural language, e.g:
    - citizen surveys / public deliberations
    - newsgroups
    - forums
    - discussion archives
- uses LLMs to extract and classify:
    - atomic claims
    - topics and subtopics
- generates interactive reports

## Demo

### Heal Michigan

The [Heal Michigan report](https://tttc-turbo.web.app/report/heal-michigan) is a video-based survey and an in-depth look into the challenges and daily lives of the Michigan community.

### Taiwan same-sex marriage

The [Taiwan same-sex marriage report](https://tttc-turbo.web.app/report/taiwan-zh) is a very large survey of the Taiwanese population, covering their views on same-sex marriage in Taiwan.

### Mina protocol

The [Mina protocol report](https://tttc-turbo.web.app/report/mina-protocol) features the results of a user-survey carried out by [Mina Zero Knowledge Protocol](https://minaprotocol.com/) on their users.

Repo link: [https://github.com/AIObjectives/talk-to-the-city-reports](https://github.com/AIObjectives/talk-to-the-city-reports)

## Computational Graph

On a technology front, tttc uses a dependency-graph based data and computational model. This allows technical and non-technical users to create AI/ML apps in just a few clicks. You can read more here on [the unintended effects of graph-based ML applications
](https://tttc-turbo.web.app/docs/ai-pipe-guide/unintended-effects).

This is achieved by having dependency graph "nodes" that are connected by directional edges. The nodes + edges form a pipeline where some nodes provide data, whilst others provide computation steps. Computation simply involves a topological sort (since edges are directed) where the output of nodes are passed into the input of their downstream nodes. On each step the "compute" function for each node is simply invoked with the upstream input data, and so on until all nodes have been computed.

Computation has two modes: "run" when the pipeline creator actively runs the pipeline, and "load" which is called when the resulting report page is loaded by a viewer.

## Reusability with the MVC pattern

The graph is also used for the UI. Pipelines have two rendering mode: graph and standard. The graph view uses [Svelteflow](https://svelteflow.dev/) whilst the standard view performs a topological sort and renders the nodes in a single column.

Nodes use the MVC pattern. The [compute functions](./src/lib/compute) hold the Model and the Controller. The [graph UI components](./src/components/graph/nodes) hold the View.

Since the MC and V are decoupled, we can use different combinations of MC <-> V to yield many combinations of compute + UI entities whilst minimizing code and maximizing reusability.

## Documentation

Our [AI Pipeline Engineering Guide #1](https://tttc-turbo.web.app/docs/ai-pipe-guide) takes the reader step by step over the process of creating a report pipeline.

Our [user docs](https://tttc-turbo.web.app/docs) provides a very high level overview of the application for non-technical users.

## Cloning

```bash
$ git clone https://github.com/AIObjectives/talk-to-the-city-reports
```

## Firebase

The application can be hosted anywhere, although the persistence layer is currently coupled with Firestore and Google Cloud Storage.

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

### Multi-site deployments

Firebase allows easily deploying to multiple sites that use the same project resources.

To specify a different site:

- modify `.hosting.site` in `turbo/firebase.json`
- run `firebase deploy --only hosting:<alt-site-name>`

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
<summary>Adding new node types</summary>

## Adding new node types

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
| Total Test Suites     | 62 |
| Passed Test Suites    | 62 |
| Failed Test Suites    | 0 |
| Pending Test Suites   | 0 |
| Total Tests           | 115 |
| Passed Tests          | 115 |
| Failed Tests          | 0 |
| Pending Tests         | 0 |
| Todo Tests            | 0 |

### `[1]` [argument_extraction.test.ts](./src/test//argument_extraction.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *extract the given arguments* | **passed** |
| *should not extract the arguments if no csv* | **passed** |
| *should not extract the arguments if no open_ai_key and no GCS* | **passed** |
| *should load from GCS if no open ai key* | **passed** |
| *should not extract the arguments if no prompt and no system prompt* | **passed** |
| *test GCS caching* | **passed** |

### `[2]` [audio.test.ts](./src/test//audio.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *should return the cached output if not dirty and output exists* | **passed** |
| *should read audio from GCS and update size and mime_type if download is true* | **passed** |
| *should create an empty audio file if download is false* | **passed** |
| *should set dirty to false after compute* | **passed** |
| *should return undefined if gcs_path is not set* | **passed** |

### `[3]` [chat.test.ts](./src/test//chat.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *compute should set output to messages and dirty to false* | **passed** |
| *chat should add assistant response to messages* | **passed** |
| *chat should use initial_messages if only one message is present* | **passed** |

### `[4]` [cluster_extraction.test.ts](./src/test//cluster_extraction.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *extract the cluster* | **passed** |
| *should not extract the cluster if no csv* | **passed** |
| *should not extract the cluster if no open_ai_key* | **passed** |
| *should not extract the cluster if no prompt and no system prompt* | **passed** |
| *test GCS caching* | **passed** |

### `[5]` [count_tokens.test.ts](./src/test//count_tokens.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *should correctly count tokens in input data* | **passed** |
| *should not count tokens if input data length matches and node is not dirty* | **passed** |
| *should count tokens if the input data is a string* | **passed** |
| *should display 0 tokens in the message if tokens are added, then removed and run again* | **passed** |

### `[6]` [csv.test.ts](./src/test//csv.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *should process CSV data correctly from GCS* | **passed** |
| *should handle empty CSV data from GCS* | **passed** |
| *should handle rows with uneven columns from GCS* | **passed** |

### `[7]` [dataset.test.ts](./src/test//dataset.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *Find by compute type* | **passed** |
| *Simple pipeline run test* | **passed** |
| *Markdown to chat test* | **passed** |
| *Full pipeline run test* | **passed** |

### `[8]` [edit_csv.test.ts](./src/test//edit_csv.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *generates new columns* | **passed** |
| *deletes columns* | **passed** |
| *renames columns* | **passed** |
| *returns undefined if input is undefined* | **passed** |
| *handles multiple operations* | **passed** |
| *does not modify input if no operations are specified* | **passed** |
| *does not crash if input is empty* | **passed** |

### `[9]` [grid.test.ts](./src/test//grid.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *sets the output of the node to the input data* | **passed** |

### `[10]` [jq_v0.test.ts](./src/test//jq_v0.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *should process data correctly with JQ filter* | **passed** |
| *should handle invalid JQ filter* | **passed** |

### `[11]` [jq_v1.test.ts](./src/test//jq_v1.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *should process data correctly with JQ filter* | **passed** |
| *should handle invalid JQ filter* | **passed** |

### `[12]` [json.test.ts](./src/test//json.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *should process JSON data correctly from GCS* | **passed** |
| *should handle invalid JSON data from GCS* | **passed** |
| *should update dirty state correctly* | **passed** |

### `[13]` [jsonata.test.ts](./src/test//jsonata.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *evaluates JSONata expressions* | **passed** |
| *returns undefined if no expression is provided* | **passed** |
| *catches errors when evaluating expressions* | **passed** |

### `[14]` [limit_csv.test.ts](./src/test//limit_csv.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *should limit the number of rows correctly* | **passed** |
| *should let all data pass through if number is left blank* | **passed** |
| *should limit the number of rows correctly, for an object* | **passed** |
| *should return all rows if limit is greater than number of rows* | **passed** |
| *should return an empty array if input is empty* | **passed** |
| *should not mutate the input node* | **passed** |

### `[15]` [markdown.test.ts](./src/test//markdown.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *should set markdown data if input is a string* | **passed** |
| *should combine multiple string inputs with separation* | **passed** |
| *should wrap non-string inputs within code block* | **passed** |
| *should handle an empty input object* | **passed** |
| *should preserve the order of inputs when combining* | **passed** |
| *should stringify and wrap arrays in code blocks* | **passed** |
| *should throw an error if input data contains circular references* | **passed** |

### `[16]` [merge.test.ts](./src/test//merge.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *merges cluster_extraction and argument_extraction data* | **passed** |
| *does not merge if cluster_extraction data is missing* | **passed** |
| *does not merge if argument_extraction data is missing* | **passed** |
| *does not merge if cluster_extraction data has no topics* | **passed** |
| *sets node data output to the merged data and dirty to false after merge* | **passed** |

### `[17]` [merge_cluster_extraction.test.ts](./src/test//merge_cluster_extraction.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *merges cluster extraction data* | **passed** |
| *does not merge if cluster extractions are missing* | **passed** |
| *uses cached data if available and not dirty* | **passed** |
| *does not merge if no open_ai_key is provided* | **passed** |

### `[18]` [open_ai_key.test.ts](./src/test//open_ai_key.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *should set the key in cookies if the UI key is valid* | **passed** |
| *if ui key is set but invalid use local key* | **passed** |
| *should set the node text to "Invalid key" if the UI key is not valid and there is no local key* | **passed** |
| *should not mutate the node if the UI key and local key are both valid* | **passed** |

### `[19]` [participant_filter.test.ts](./src/test//participant_filter.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *filters participants based on the provided name* | **passed** |
| *removes subtopics with no claims after filtering* | **passed** |
| *removes topics with no subtopics after filtering* | **passed** |
| *returns undefined if input data does not contain topics* | **passed** |
| *does not filter claims if interview key is missing* | **passed** |

### `[20]` [pyodide.test.ts](./src/test//pyodide.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *should execute python script and return outputData* | **passed** |
| *should be able to pass input to outputData* | **passed** |
| *test passing in complex data from jsonapi* | **passed** |

### `[21]` [python.integration.test.ts](./src/test//python.integration.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *should execute python script and return outputData* | **passed** |
| *should be able to pass input to outputData* | **passed** |
| *should be able to make get requests to jsonapi* | **passed** |

### `[22]` [python.test.ts](./src/test//python.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *should execute python script and return output* | **passed** |
| *should handle fetch errors gracefully* | **passed** |
| *should handle invalid JSON response* | **passed** |
| *should handle non-string JSON response* | **passed** |
| *should update node data output with the response* | **passed** |

### `[23]` [register.test.ts](./src/test//register.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *test node registeration* | **passed** |
| *Load all nodes* | **passed** |

### `[24]` [report.test.ts](./src/test//report.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *should set the output of the node to the input data* | **passed** |
| *should handle empty input data* | **passed** |
| *should not mutate the input node* | **passed** |

### `[25]` [report_v1.test.ts](./src/test//report_v1.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *should set the output of the node to the input data* | **passed** |

### `[26]` [score_argument_relevance.test.ts](./src/test//score_argument_relevance.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *scores the relevance of arguments* | **passed** |
| *uses cached data if available and not dirty* | **passed** |
| *does not score if argument_extraction data is missing* | **passed** |
| *does not score if open_ai_key is missing* | **passed** |
| *does not score if prompts are missing* | **passed** |

### `[27]` [simple_pipeline.test.ts](./src/test//simple_pipeline.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *should process CSV data correctly from GCS* | **passed** |

### `[28]` [stringify.test.ts](./src/test//stringify.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *should correctly stringify input data* | **passed** |
| *should return input if it cannot be stringified* | **passed** |
| *should handle different types of input* | **passed** |
| *should not mutate the input node* | **passed** |

### `[29]` [translate.test.ts](./src/test//translate.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *translates the input data* | **passed** |
| *uses cached translations when available* | **passed** |

### `[30]` [whisper.test.ts](./src/test//whisper.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *should load from cache if data is not dirty and gcs_path is set* | **passed** |
| *should load from GCS if data is not dirty, gcs_path is set, and output is empty and audio size matches* | **passed** |
| *should transcribe audio and upload to GCS if data is dirty* | **passed** |
| *should return undefined and set message if open_ai_key is missing* | **passed** |
| *should convert transcription to internal format if response_format is custom* | **passed** |

### `[31]` [workerpool.test.ts](./src/test//workerpool.test.ts)
| Test | Status | Duration (ms) |
|---|---|---:|
| *should execute function in workerpool* | **passed** |
| *should execute delayed function in workerpool* | **passed** |
