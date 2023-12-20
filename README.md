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
