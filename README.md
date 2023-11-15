# Talk to the City (TttC)

<img width="400" alt="image" src="https://github.com/AIObjectives/talk-to-the-city-reports/assets/3934784/57cc6367-0808-40f0-980a-540530ff0866">
<img width="400" alt="image" src="https://github.com/AIObjectives/talk-to-the-city-reports/assets/3934784/aaf45844-5a19-41c8-8943-78866db9f666">

## Overview

TttC is an AI pipeline which takes a csv file of comments and generates html reports which:

- extract the key arguments made in the original comments
- arrange the arguments into clusters based on their semantic similarity
- generate labels and summaries for all the clusters
- provide interactive maps to explore the arguments in each cluster

TttC is able to ingest different types of data and produce reports in different languages.
For example:

- [Recursive Public](https://tttc.dev/recursive) is a report generated using data collected by the Pol.is tool. The input included votes and the maps let you filter arguments by level of consensus.
- [GenAI Taiwan](https://tttc.dev/genai) is a report which can be read either in English or Mandarin. The data came from a public consultation about generative AI conducted in Taiwan by the Collective Intelligence Project.

TttC is developed by the [AI Objectives Institute](http://aiobjectives.org), an non-profit research organization focused on AI alignment.

For more context, see also our blog post: [an open-source AI tool to scale deliberation](https://ai.objectives.institute/blog/talk-to-the-city-an-open-source-ai-tool-to-scale-deliberation).

## AI safety disclaimer

TttC is a research project aiming to explore the potential of generative AI to support public deliberation. LLMs are known to be biased and to produce unreliable results. We are actively working on ways to mitigate these issues but can not provide any guarantee at this stage. We do not recommend relying on the results of this pipeline alone to make impactful decisions without first verifying the results.

## How to generate reports

### Dependencies

This repository will allow you to generate TttC reports on your machine.

For this you will need:

- an OpenAI key
- a machine to run python and javascript
- your data in a csv file

We recommend to use python 3.10+ and install the dependencies as follows:

```
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python -c "import nltk; nltk.download('stopwords')"
```

You'll also need npm to installed the javascript dependencies:

```
cd next-app
npm install
```

You may also need to [install git lfs](https://docs.github.com/en/repositories/working-with-files/managing-large-files/installing-git-large-file-storage) to use the provided examples of csv files.

### Using a provided example

This repo comes with two examples of datasets and config files, including one called `example-polis` (using Polis data).

The easiest way to test that the pipeline is working fine on you machine is to run:

```
cd pipeline
export OPENAI_API_KEY = sk-...
python main.py configs/example-polis.json
```

This will use the data from `pipeline/inputs/example-polis.csv` and produce a report under `pipeline/outputs/example-polis/report`.

We also provide another example called `example-video` which may be helpful to test video-related features.

### Using your own data

You can copy your data in the pipeline input folder, after making sure that the necessary columns `comment-id` and `comment-body` are present.

```
cp ../my-data.csv pipeline/inputs/my-data.csv
```

You'll also need a config file to specify what you want to do.
The easiest way to get started is to copy the example config file and edit it:

```
cp pipeline/configs/example.json pipeline/configs/my-project.json
```

Among other things, you'll want to change the `input` field to point to your data file.

```
{
  "input": "my-data",
  ...
}
```

You can then run the pipeline as follows:

```
cd pipeline
export OPENAI_API_KEY=sk-...
python main.py configs/my-project.json
```

## Viewing the generated report

The generated report can be found under `pipeline/outputs/my-project/report` and opened locally using an http server run from the project's top level directory:

```
npm install -g http-server
http-server -p 8080
open http://localhost:8080/pipeline/outputs/my-project/report/
```

Replace "my-project" above with "example" to view the example report.

You can then deploy your report using any static hosting service (e.g. Vercel).

(!) Note that the html file is loading assets using relative paths. You can deploy your report anywhere (on any path/route) but you might need to include a trailing slash at the end of you urls to make sure that relative paths are resolved correctly.

## Supported columns in the csv

Below is the list of required and optional columns supported by the pipeline for the input csv file:

```
{
// REQUIRED
'comment-id': string // unique identifier for the comment
'comment-body': string // main content of the comment

// OPTIONAL
'agree'?: number // number of upvotes
'disagree?': number // number of downvotes
'video?': string // link to a video
'interview?': string // name of interviewee
'timestamp?': string // timestamp in the video
}
```

## List of config parameters

Below is the list of parameters supported in the config files:

```
{
// REQUIRED
input: string // name of the input file (without .csv extension)
question: string // the main question asked to participants

// OPTIONAL
name?: string // short name of your project
intro?: string // short introduction to your project (markdown)
model?: string // model to use (unless overridden), defaults to "gpt-3.5-turbo"
extraction?: {
  model? string // model name for extraction step (overrides the global model)
  prompt_file?: string // name of the prompt file (without .json extension)
  prompt?: string // full content the prompt for extraction step
  limit?: number // maximal number of rows to process (default to 1000)
  workers?: number // maximal number of parallel workers (default to 1)
},
clustering: {
  clusters?: number // number of clusters to generate (default to 8)
}
labelling: {
  model? string // model name for labelling step (overrides the global model)
  prompt_file?: string // name of the prompt file (without .json extension)
  prompt?: string // full content the prompt for labelling step
  sample_size?: number // number of arguments pulled per cluster to generate labels,
},
takeaways: {
  model? string // model name for takeaways step (overrides the global model)
  prompt_file?: string // name of the prompt file (without .json extension)
  prompt?: string // full content the prompt for takeaways step
  sample_size?: number // number of arguments pulled per cluster to generate labels,
},
translation: {
  model? string // model name for takeaways step (overrides the global model)
  prompt_file?: string // name of the prompt file (without .json extension)
  prompt?: string // full content the prompt for takeaways step
  languages?: string[] // list of languages to translated to (default to [])
  flags?: string[] // list of flags to use in the UI (default to [])
},
visualization: {
  replacements?: {replace: string, by: string}[] // list of text replacements to apply to the UI
}
```

## Generated outputs

After running the full pipeline successfully, you should find the following files:

```
outputs
└── my-project
    ├── args.csv // extracted arguments
    ├── clusters.csv // clusters of arguments
    ├── embeddings.pkl // embeddings
    ├── labels.csv // cluster labels
    ├── translations.json // translations (JSON)
    ├── status.json // status of the pipeline
    ├── result.json // all the generated data
    └── report // folder with html report and assets

```

Note that `result.json` contains a copy of all the generated data, including the contents of `args.csv`, `clusters.csv` and `labels.csv` and `translations.json`.
These files are only kep around for caching purposes, just in case you want to re-run the pipeline with slightly different parameters and don't need to recompute everything.

## Credits

Earlier versions of this pipeline were developed in collaboration with [@Klingefjord](https://github.com/Klingefjord) and [@lightningorb](https://github.com/lightningorb). The example of data input file was provided by the Recursive Public team (Chatham House, vTaiwan, OpenAI).

## License

GNU Affero General Public License v3.0
