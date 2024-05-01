[![tests](https://github.com/AIObjectives/talk-to-the-city-reports/actions/workflows/tests.yaml/badge.svg)](https://github.com/AIObjectives/talk-to-the-city-reports/actions/workflows/tests.yaml)
![GitHub Contributors](https://img.shields.io/github/contributors/AIObjectives/talk-to-the-city-reports)
![GitHub Last Commit](https://img.shields.io/github/last-commit/AIObjectives/talk-to-the-city-reports)

[![License](https://img.shields.io/badge/License-GPL3-blue)](#license)
![](https://img.shields.io/github/repo-size/AIObjectives/talk-to-the-city-reports)

![Svelte](https://img.shields.io/badge/dynamic/json?color=ff3e00&label=Svelte&query=%24.devDependencies.svelte&url=https%3A%2F%2Fraw.githubusercontent.com%2FAIObjectives%2Ftalk-to-the-city-reports%2Fmain%2Fturbo%2Fpackage.json)
![Typescript](https://img.shields.io/badge/dynamic/json?label=Typescript&query=%24.devDependencies.typescript&url=https%3A%2F%2Fraw.githubusercontent.com%2FAIObjectives%2Ftalk-to-the-city-reports%2Fmain%2Fturbo%2Fpackage.json)
[![Made with Node.js](https://img.shields.io/badge/Node.js->=18-blue?logo=node.js&logoColor=white)](https://nodejs.org 'Go to Node.js homepage')

![Vitest Passing](https://img.shields.io/badge/dynamic/json?color=blueviolet&label=Vitest+Passing&query=%24.vitestPass&url=https%3A%2F%2Fraw.githubusercontent.com%2FAIObjectives%2Ftalk-to-the-city-reports%2Fmain%2Fturbo%2Fpackage.json)
![Vitest Failing](https://img.shields.io/badge/dynamic/json?color=blueviolet&label=Vitest+Failing&query=%24.vitestFail&url=https%3A%2F%2Fraw.githubusercontent.com%2FAIObjectives%2Ftalk-to-the-city-reports%2Fmain%2Fturbo%2Fpackage.json)
![GitHub Issues](https://img.shields.io/github/issues/AIObjectives/talk-to-the-city-reports)
![GitHub Pull Requests](https://img.shields.io/github/issues-pr/AIObjectives/talk-to-the-city-reports)

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

On a technology front, tttc uses a dependency-graph based data and computational model based on nodes that are connected by directional edges. The nodes + edges form a pipeline where some nodes provide data, whilst others provide computation steps. Computation simply involves a topological sort (since edges are directed) where the output of nodes are passed into the input of their downstream nodes. On each step the "compute" function for each node is simply invoked with the upstream input data, and so on until all nodes have been computed.

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
- click on `Manage service account permissions`
- look for the email address that matches the project id
  - click actions
  - click create key
- save the json private key to turbo/src/lib/service-account-pk.json
- add the environment variable to your shell: `export GOOGLE_APPLICATION_CREDENTIALS="src/lib/service-account-pk.json"`

### Post fresh install steps

#### DB 'dataset' index

After launching the app, for the first time check your dev console, as it will contain a link for creating an index for datasets.

#### Templates

Talk to the City turbo uses pipeline templates, so end users do not have to construct their own graphs.

You can manage templates via http://localhost:5173/templates or https://tttc-turbo.web.app/templates.

#### Admin UID

The `.env` file contains a `VITE_ADMIN` variable that should be filled in with your user id, which can be acquired from the Firestore database.

### Using AOI's dev instance

- Contact @brittneygallagher or @lightningorb for credentials files
- save the provided `.env` in `turbo/`
- optional steps for deployment:
  - save the provided `service-account-pk.json` in `turbo/src/lib/`
  - `npm install -g firebase-tools`
  - `firebase login`

Disclaimer: by using a shared dev instance, you are aware that the data you shared by nature, and therefore no privacy can be made for the data you choose to upload to the platform. For better privacy, consider setting up your own instance.

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

| Metric              | Count |
| ------------------- | ----: |
| Total Test Suites   |   106 |
| Passed Test Suites  |   106 |
| Failed Test Suites  |     0 |
| Pending Test Suites |     0 |
| Total Tests         |   215 |
| Passed Tests        |   215 |
| Failed Tests        |     0 |
| Pending Tests       |     0 |
| Todo Tests          |     0 |

### `[1]` [InfoPanelClaim.test.ts](./src/test//InfoPanelClaim.test.ts)

| Test                                   | Status     | Duration (ms) |
| -------------------------------------- | ---------- | ------------: |
| _testing vimeo claim_                  | **passed** |
| _testing yt claim_                     | **passed** |
| _testing yt link has si_               | **passed** |
| _testing yt link has timestamp_        | **passed** |
| _testing yt link has si and timestamp_ | **passed** |
| _testing no video_                     | **passed** |
| _testing no claim throws error_        | **passed** |

### `[2]` [add_csv_v0.test.ts](./src/test//add_csv_v0.test.ts)

| Test                                                                | Status     | Duration (ms) |
| ------------------------------------------------------------------- | ---------- | ------------: |
| _should concatenate multiple CSV inputs into a single output array_ | **passed** |
| _should handle empty input arrays_                                  | **passed** |
| _should handle a single input array_                                | **passed** |
| _should set dirty to false after compute_                           | **passed** |
| _should return an empty array if no inputs are provided_            | **passed** |
| _should not mutate the input data_                                  | **passed** |

### `[3]` [argument_extraction_v0.test.ts](./src/test//argument_extraction_v0.test.ts)

| Test                                                                 | Status     | Duration (ms) |
| -------------------------------------------------------------------- | ---------- | ------------: |
| _extract the given arguments_                                        | **passed** |
| _should not extract the arguments if no csv_                         | **passed** |
| _should not extract the arguments if no open_ai_key and no GCS_      | **passed** |
| _should load from GCS if no open ai key_                             | **passed** |
| _should not extract the arguments if no prompt and no system prompt_ | **passed** |
| _test GCS caching_                                                   | **passed** |

### `[4]` [argument_extraction_v1.test.ts](./src/test//argument_extraction_v1.test.ts)

| Test                                                                 | Status     | Duration (ms) |
| -------------------------------------------------------------------- | ---------- | ------------: |
| _extract the given arguments_                                        | **passed** |
| _extract the given arguments with missing rows in CSV_               | **passed** |
| _should not extract the arguments if no csv_                         | **passed** |
| _should not extract the arguments if no open_ai_key and no GCS_      | **passed** |
| _should load from GCS if no open ai key_                             | **passed** |
| _should not extract the arguments if no prompt and no system prompt_ | **passed** |
| _test GCS caching_                                                   | **passed** |

### `[5]` [audio.test.ts](./src/test//audio.test.ts)

| Test                                                                           | Status     | Duration (ms) |
| ------------------------------------------------------------------------------ | ---------- | ------------: |
| _should return the cached output if not dirty and output exists_               | **passed** |
| _should read audio from GCS and update size and mime_type if download is true_ | **passed** |
| _should create an empty audio file if download is false_                       | **passed** |
| _should set dirty to false after compute_                                      | **passed** |
| _should return undefined if gcs_path is not set_                               | **passed** |

### `[6]` [chat_v0.test.ts](./src/test//chat_v0.test.ts)

| Test                                                       | Status     | Duration (ms) |
| ---------------------------------------------------------- | ---------- | ------------: |
| _compute should set output to messages and dirty to false_ | **passed** |

### `[7]` [cluster_extraction_v0.test.ts](./src/test//cluster_extraction_v0.test.ts)

| Test                                                               | Status     | Duration (ms) |
| ------------------------------------------------------------------ | ---------- | ------------: |
| _extract the cluster_                                              | **passed** |
| _should not extract the cluster if no csv_                         | **passed** |
| _should not extract the cluster if no open_ai_key_                 | **passed** |
| _should not extract the cluster if no prompt and no system prompt_ | **passed** |
| _test GCS caching_                                                 | **passed** |

### `[8]` [cluster_extraction_v1.test.ts](./src/test//cluster_extraction_v1.test.ts)

| Test                                                               | Status     | Duration (ms) |
| ------------------------------------------------------------------ | ---------- | ------------: |
| _extract the cluster_                                              | **passed** |
| _should not extract the cluster if no csv_                         | **passed** |
| _should not extract the cluster if no open_ai_key_                 | **passed** |
| _should not extract the cluster if no prompt and no system prompt_ | **passed** |
| _test GCS caching_                                                 | **passed** |

### `[9]` [comment_expander_v0.test.ts](./src/test//comment_expander_v0.test.ts)

| Test                                                                           | Status     | Duration (ms) |
| ------------------------------------------------------------------------------ | ---------- | ------------: |
| _should concatenate comments until reaching 100 words, then start a new chunk_ | **passed** |
| _should start a new chunk when the interview field changes_                    | **passed** |
| _should handle an empty input array_                                           | **passed** |
| _should not lose the last comment if it does not exceed 100 words_             | **passed** |
| _should correctly handle comments with exactly 100 words_                      | **passed** |

### `[10]` [count_tokens.test.ts](./src/test//count_tokens.test.ts)

| Test                                                                         | Status     | Duration (ms) |
| ---------------------------------------------------------------------------- | ---------- | ------------: |
| _should correctly count tokens in input data_                                | **passed** |
| _should not count tokens if input data length matches and node is not dirty_ | **passed** |
| _should count tokens if the input data is a string_                          | **passed** |

### `[11]` [csv.test.ts](./src/test//csv.test.ts)

| Test                                              | Status     | Duration (ms) |
| ------------------------------------------------- | ---------- | ------------: |
| _should process CSV data correctly from GCS_      | **passed** |
| _should handle empty CSV data from GCS_           | **passed** |
| _should handle rows with uneven columns from GCS_ | **passed** |

### `[12]` [dataset.test.ts](./src/test//dataset.test.ts)

| Test                       | Status     | Duration (ms) |
| -------------------------- | ---------- | ------------: |
| _Find by compute type_     | **passed** |
| _Simple pipeline run test_ | **passed** |
| _Full pipeline run test_   | **passed** |

### `[13]` [edit_csv.test.ts](./src/test//edit_csv.test.ts)

| Test                                                   | Status     | Duration (ms) |
| ------------------------------------------------------ | ---------- | ------------: |
| _generates new columns_                                | **passed** |
| _deletes columns_                                      | **passed** |
| _renames columns_                                      | **passed** |
| _returns undefined if input is undefined_              | **passed** |
| _handles multiple operations_                          | **passed** |
| _does not modify input if no operations are specified_ | **passed** |
| _does not crash if input is empty_                     | **passed** |

### `[14]` [filter_csv_v0.test.ts](./src/test//filter_csv_v0.test.ts)

| Test                                                           | Status     | Duration (ms) |
| -------------------------------------------------------------- | ---------- | ------------: |
| _should filter CSV data inclusively based on provided filters_ | **passed** |
| _should filter CSV data exclusively based on provided filters_ | **passed** |
| _should return all data if no filters are set_                 | **passed** |
| _should handle multiple filters correctly_                     | **passed** |
| _should set dirty to false after compute_                      | **passed** |
| _should not mutate the input data_                             | **passed** |

### `[15]` [gpt_embeddings_v0.test.ts](./src/test//gpt_embeddings_v0.test.ts)

| Test                                                                             | Status     | Duration (ms) |
| -------------------------------------------------------------------------------- | ---------- | ------------: |
| _should compute embeddings for input data_                                       | **passed** |
| _should not compute embeddings if no open_ai_key is provided_                    | **passed** |
| _should load embeddings from GCS if data length matches and save_to_gcs is true_ | **passed** |
| _should handle no data input_                                                    | **passed** |

### `[16]` [gpt_v0.test.ts](./src/test//gpt_v0.test.ts)

| Test                    | Status     | Duration (ms) |
| ----------------------- | ---------- | ------------: |
| _general prompt_        | **passed** |
| _json prompt_           | **passed** |
| _json prompt with text_ | **passed** |

### `[17]` [grid.test.ts](./src/test//grid.test.ts)

| Test                                            | Status     | Duration (ms) |
| ----------------------------------------------- | ---------- | ------------: |
| _sets the output of the node to the input data_ | **passed** |

### `[18]` [jq_v0.test.ts](./src/test//jq_v0.test.ts)

| Test                                           | Status     | Duration (ms) |
| ---------------------------------------------- | ---------- | ------------: |
| _should process data correctly with JQ filter_ | **passed** |
| _should handle invalid JQ filter_              | **passed** |

### `[19]` [jq_v1.test.ts](./src/test//jq_v1.test.ts)

| Test                                                        | Status     | Duration (ms) |
| ----------------------------------------------------------- | ---------- | ------------: |
| _should process data correctly with JQ filter_              | **passed** |
| _should handle invalid JQ filter_                           | **passed** |
| _should return an empty array when no matches found_        | **passed** |
| _should process data correctly with a complex JQ filter_    | **passed** |
| _should return undefined if the input is null or undefined_ | **passed** |

### `[20]` [json.test.ts](./src/test//json.test.ts)

| Test                                          | Status     | Duration (ms) |
| --------------------------------------------- | ---------- | ------------: |
| _should process JSON data correctly from GCS_ | **passed** |
| _should handle invalid JSON data from GCS_    | **passed** |
| _should update dirty state correctly_         | **passed** |

### `[21]` [jsonata.test.ts](./src/test//jsonata.test.ts)

| Test                                             | Status     | Duration (ms) |
| ------------------------------------------------ | ---------- | ------------: |
| _evaluates JSONata expressions_                  | **passed** |
| _returns undefined if no expression is provided_ | **passed** |
| _catches errors when evaluating expressions_     | **passed** |

### `[22]` [limit_csv.test.ts](./src/test//limit_csv.test.ts)

| Test                                                             | Status     | Duration (ms) |
| ---------------------------------------------------------------- | ---------- | ------------: |
| _should let all data pass through if number is left blank_       | **passed** |
| _should limit the number of rows correctly, for an object_       | **passed** |
| _should return all rows if limit is greater than number of rows_ | **passed** |
| _should return an empty array if input is empty_                 | **passed** |
| _should not mutate the input node_                               | **passed** |

### `[23]` [markdown.test.ts](./src/test//markdown.test.ts)

| Test                                                               | Status     | Duration (ms) |
| ------------------------------------------------------------------ | ---------- | ------------: |
| _should set markdown data if input is a string_                    | **passed** |
| _should combine multiple string inputs with separation_            | **passed** |
| _should wrap non-string inputs within code block_                  | **passed** |
| _should handle an empty input object_                              | **passed** |
| _should preserve the order of inputs when combining_               | **passed** |
| _should stringify and wrap arrays in code blocks_                  | **passed** |
| _should throw an error if input data contains circular references_ | **passed** |

### `[24]` [merge.test.ts](./src/test//merge.test.ts)

| Test                                                                      | Status     | Duration (ms) |
| ------------------------------------------------------------------------- | ---------- | ------------: |
| _merges cluster_extraction and argument_extraction data_                  | **passed** |
| _does not merge if cluster_extraction data is missing_                    | **passed** |
| _does not merge if argument_extraction data is missing_                   | **passed** |
| _does not merge if cluster_extraction data has no topics_                 | **passed** |
| _sets node data output to the merged data and dirty to false after merge_ | **passed** |

### `[25]` [merge_cluster_extraction.test.ts](./src/test//merge_cluster_extraction.test.ts)

| Test                                                | Status     | Duration (ms) |
| --------------------------------------------------- | ---------- | ------------: |
| _merges cluster extraction data_                    | **passed** |
| _does not merge if cluster extractions are missing_ | **passed** |
| _uses cached data if available and not dirty_       | **passed** |
| _does not merge if no open_ai_key is provided_      | **passed** |

### `[26]` [merge_cluster_extraction_v1.test.ts](./src/test//merge_cluster_extraction_v1.test.ts)

| Test                                                    | Status     | Duration (ms) |
| ------------------------------------------------------- | ---------- | ------------: |
| _should merge cluster extractions into a single output_ | **passed** |
| _should handle empty input data_                        | **passed** |
| _should not process if no open_ai_key is provided_      | **passed** |

### `[27]` [multi_audio_v0.test.ts](./src/test//multi_audio_v0.test.ts)

| Test                                                                           | Status     | Duration (ms) |
| ------------------------------------------------------------------------------ | ---------- | ------------: |
| _should return the cached output if not dirty and output exists_               | **passed** |
| _should read audio from GCS and update size and mime_type if download is true_ | **passed** |
| _should create empty audio files if download is false_                         | **passed** |

### `[28]` [multi_cluster_extraction_v0.test.ts](./src/test//multi_cluster_extraction_v0.test.ts)

| Test                                                  | Status     | Duration (ms) |
| ----------------------------------------------------- | ---------- | ------------: |
| _should split CSV into chunks and process each chunk_ | **passed** |
| _should handle empty CSV input_                       | **passed** |
| _should not process if no open_ai_key is provided_    | **passed** |

### `[29]` [multi_gpt_v0.test.ts](./src/test//multi_gpt_v0.test.ts)

| Test                                               | Status     | Duration (ms) |
| -------------------------------------------------- | ---------- | ------------: |
| _should process multiple prompts_                  | **passed** |
| _should process multiple differing prompts_        | **passed** |
| _should join outputs if join_output is true_       | **passed** |
| _should not process if no open_ai_key is provided_ | **passed** |

### `[30]` [multi_whisper_v0.test.ts](./src/test//multi_whisper_v0.test.ts)

| Test                                                                  | Status     | Duration (ms) |
| --------------------------------------------------------------------- | ---------- | ------------: |
| _should process multiple audio files_                                 | **passed** |
| _should handle empty audio input_                                     | **passed** |
| _should update node_info with results from WhisperNode computations_  | **passed** |
| _should remove entries from node_info that are not in the audio list_ | **passed** |
| _should mark node_info entry as dirty if WhisperNode output is null_  | **passed** |

### `[31]` [open_ai_key.test.ts](./src/test//open_ai_key.test.ts)

| Test                                                                                             | Status     | Duration (ms) |
| ------------------------------------------------------------------------------------------------ | ---------- | ------------: |
| _should set the key in cookies if the UI key is valid_                                           | **passed** |
| _if ui key is set but invalid use local key_                                                     | **passed** |
| _should set the node text to "Invalid key" if the UI key is not valid and there is no local key_ | **passed** |
| _should not mutate the node if the UI key and local key are both valid_                          | **passed** |

### `[32]` [participant_filter.test.ts](./src/test//participant_filter.test.ts)

| Test                                                      | Status     | Duration (ms) |
| --------------------------------------------------------- | ---------- | ------------: |
| _filters participants based on the provided name_         | **passed** |
| _removes subtopics with no claims after filtering_        | **passed** |
| _removes topics with no subtopics after filtering_        | **passed** |
| _returns undefined if input data does not contain topics_ | **passed** |
| _does not filter claims if interview key is missing_      | **passed** |

### `[33]` [pinecone_key_v0.test.ts](./src/test//pinecone_key_v0.test.ts)

| Test                                                                          | Status     | Duration (ms) |
| ----------------------------------------------------------------------------- | ---------- | ------------: |
| _should set the key in cookies if the UI key is provided_                     | **passed** |
| _should use the local key from cookies if available_                          | **passed** |
| _should return an empty string if no key is provided or available in cookies_ | **passed** |

### `[34]` [pinecone_v0.test.ts](./src/test//pinecone_v0.test.ts)

| Test                                                                   | Status     | Duration (ms) |
| ---------------------------------------------------------------------- | ---------- | ------------: |
| _should initialize Pinecone with the provided API key_                 | **passed** |
| _should create a new index if it does not exist and upsert embeddings_ | **passed** |
| _should list Pinecone indexes_                                         | **passed** |
| _should provide tools for querying Pinecone index_                     | **passed** |

### `[35]` [pyodide.test.ts](./src/test//pyodide.test.ts)

| Test                                                 | Status     | Duration (ms) |
| ---------------------------------------------------- | ---------- | ------------: |
| _should execute python script and return outputData_ | **passed** |
| _should be able to pass input to outputData_         | **passed** |
| _test passing in complex data from jsonapi_          | **passed** |

### `[36]` [python.integration.test.ts](./src/test//python.integration.test.ts)

| Test                                                 | Status     | Duration (ms) |
| ---------------------------------------------------- | ---------- | ------------: |
| _should execute python script and return outputData_ | **passed** |
| _should be able to pass input to outputData_         | **passed** |
| _should be able to make get requests to jsonapi_     | **passed** |

### `[37]` [python.test.ts](./src/test//python.test.ts)

| Test                                               | Status     | Duration (ms) |
| -------------------------------------------------- | ---------- | ------------: |
| _should execute python script and return output_   | **passed** |
| _should handle fetch errors gracefully_            | **passed** |
| _should handle invalid JSON response_              | **passed** |
| _should handle non-string JSON response_           | **passed** |
| _should update node data output with the response_ | **passed** |

### `[38]` [register.test.ts](./src/test//register.test.ts)

| Test                      | Status     | Duration (ms) |
| ------------------------- | ---------- | ------------: |
| _test node registeration_ | **passed** |
| _Load all nodes_          | **passed** |

### `[39]` [report.test.ts](./src/test//report.test.ts)

| Test                                                  | Status     | Duration (ms) |
| ----------------------------------------------------- | ---------- | ------------: |
| _should set the output of the node to the input data_ | **passed** |
| _should handle empty input data_                      | **passed** |
| _should not mutate the input node_                    | **passed** |

### `[40]` [report_v1.test.ts](./src/test//report_v1.test.ts)

| Test                                                                     | Status     | Duration (ms) |
| ------------------------------------------------------------------------ | ---------- | ------------: |
| _sets the output of the node to the input data_                          | **passed** |
| _handles translation_                                                    | **passed** |
| _uploads data to GCS on run_                                             | **passed** |
| _reads data from GCS on load if gcs_path is set and input data is empty_ | **passed** |
| _clears gcs_path if readFileFromGCS throws an error_                     | **passed** |
| _sets message if merge and csv data are present_                         | **passed** |
| _sets message to empty string if merge or csv data are missing_          | **passed** |
| _does not mutate the input node_                                         | **passed** |

### `[41]` [score_argument_relevance.test.ts](./src/test//score_argument_relevance.test.ts)

| Test                                                    | Status     | Duration (ms) |
| ------------------------------------------------------- | ---------- | ------------: |
| _scores the relevance of arguments_                     | **passed** |
| _uses cached data if available and not dirty_           | **passed** |
| _does not score if argument_extraction data is missing_ | **passed** |
| _does not score if open_ai_key is missing_              | **passed** |
| _does not score if prompts are missing_                 | **passed** |

### `[42]` [secret_v0.test.ts](./src/test//secret_v0.test.ts)

| Test                                                                          | Status     | Duration (ms) |
| ----------------------------------------------------------------------------- | ---------- | ------------: |
| _should set the key in cookies if the UI key is provided_                     | **passed** |
| _should use the local key from cookies if available_                          | **passed** |
| _should return an empty string if no key is provided or available in cookies_ | **passed** |

### `[43]` [simple_pipeline.test.ts](./src/test//simple_pipeline.test.ts)

| Test                                         | Status     | Duration (ms) |
| -------------------------------------------- | ---------- | ------------: |
| _should process CSV data correctly from GCS_ | **passed** |

### `[44]` [stringify.test.ts](./src/test//stringify.test.ts)

| Test                                              | Status     | Duration (ms) |
| ------------------------------------------------- | ---------- | ------------: |
| _should correctly stringify input data_           | **passed** |
| _should return input if it cannot be stringified_ | **passed** |
| _should handle different types of input_          | **passed** |
| _should not mutate the input node_                | **passed** |

### `[45]` [summarize_v0.test.ts](./src/test//summarize_v0.test.ts)

| Test                                                    | Status     | Duration (ms) |
| ------------------------------------------------------- | ---------- | ------------: |
| _should generate summaries for topics and subtopics_    | **passed** |
| _should load summaries from GCS if data length matches_ | **passed** |

### `[46]` [test.test.ts](./src/test//test.test.ts)

| Test                                   | Status     | Duration (ms) |
| -------------------------------------- | ---------- | ------------: |
| _integer node_                         | **passed** |
| _adder node_                           | **passed** |
| _dataset run adder_                    | **passed** |
| _dataset run multi input multi output_ | **passed** |

### `[47]` [text_to_csv_v0.test.ts](./src/test//text_to_csv_v0.test.ts)

| Test                                                               | Status     | Duration (ms) |
| ------------------------------------------------------------------ | ---------- | ------------: |
| _should convert a single text input to CSV format_                 | **passed** |
| _should convert multiple text inputs to CSV format_                | **passed** |
| _should handle empty text input_                                   | **passed** |
| _should split text into chunks if it exceeds the number of tokens_ | **passed** |

### `[48]` [translate_v0.test.ts](./src/test//translate_v0.test.ts)

| Test                                                  | Status     | Duration (ms) |
| ----------------------------------------------------- | ---------- | ------------: |
| _translates the input data_                           | **passed** |
| _loads translations from GCS if data has not changed_ | **passed** |
| _does not translate if required inputs are missing_   | **passed** |

### `[49]` [unique_v0.test.ts](./src/test//unique_v0.test.ts)

| Test                                                          | Status     | Duration (ms) |
| ------------------------------------------------------------- | ---------- | ------------: |
| _should return unique values based on the specified property_ | **passed** |
| _should return an empty array if input is empty_              | **passed** |
| _should return undefined if no property is specified_         | **passed** |
| _should set dirty to false after compute_                     | **passed** |
| _should not mutate the input data_                            | **passed** |

### `[50]` [utils.test.ts](./src/test//utils.test.ts)

| Test                               | Status     | Duration (ms) |
| ---------------------------------- | ---------- | ------------: |
| _Test secondsToHHMMSS_             | **passed** |
| _Test secondsToHHMMSS with string_ | **passed** |
| _Test HHMMSSToSeconds_             | **passed** |

### `[51]` [whisper_v0.test.ts](./src/test//whisper_v0.test.ts)

| Test                                                                                                     | Status     | Duration (ms) |
| -------------------------------------------------------------------------------------------------------- | ---------- | ------------: |
| _should load from cache if data is not dirty and gcs_path is set_                                        | **passed** |
| _should load from GCS if data is not dirty, gcs_path is set, and output is empty and audio size matches_ | **passed** |
| _should transcribe audio and upload to GCS if data is dirty_                                             | **passed** |
| _should return undefined and set message if open_ai_key is missing_                                      | **passed** |
| _should convert transcription to internal format if response_format is custom_                           | **passed** |

### `[52]` [whisper_v1.test.ts](./src/test//whisper_v1.test.ts)

| Test                                                                                                     | Status     | Duration (ms) |
| -------------------------------------------------------------------------------------------------------- | ---------- | ------------: |
| _should load from cache if data is not dirty and gcs_path is set_                                        | **passed** |
| _should load from GCS if data is not dirty, gcs_path is set, and output is empty and audio size matches_ | **passed** |
| _should transcribe audio and upload to GCS if data is dirty_                                             | **passed** |
| _should return undefined and set message if open_ai_key is missing_                                      | **passed** |
| _should convert transcription to internal format if response_format is custom_                           | **passed** |

### `[53]` [workerpool.test.ts](./src/test//workerpool.test.ts)

| Test                                            | Status     | Duration (ms) |
| ----------------------------------------------- | ---------- | ------------: |
| _should execute function in workerpool_         | **passed** |
| _should execute delayed function in workerpool_ | **passed** |
