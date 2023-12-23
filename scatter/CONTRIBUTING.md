## Disclaimer

We strongly encourage the open-source community to submit pull-requests
to improve this projects, but please note that we have limited resources
and may not find the time to review large and complex pull-requests.

Please reach out directly to the AI Objective Institute before starting any major work.

## Making existing steps more robust

LLMs are slow to run and often produce ill-formed outputs.
To address this, the current code is (sometimes) taking care of:

- parallelizing some jobs (e.g. extraction)
- retrying some jobs when they produce invalid JSON
- using heuristics or LLMs to try to fix invalid JSON
- retrying jobs when they return the wrong number of outputs
- reducing batch sizes before retrying failed jobs
- ...

However, the pipeline will still fail in some cases and we would appreciate
any help in improving existing safeguards or adding new ones.

## Simplifying the pipeline framework

The pipeline is currently automating a few things:

- it only runs steps that have not been run before
- it re-run steps when relevant parameters have changed
- it tells the users in advance which steps will be run
- you can force it to re-run all steps with '-f'
- you can re-run all steps from a given one with '-o stepname'

This framework, however, was implemented quite quickly and the code
(found in `pipeline\utils`) may be difficult to understand.

We would appreciate any help in either simplifying it or replacing it with
an alternative open-source framework.

## Adding steps to the pipeline

To add a new step to the pipeline, you'll need to:

- add your code in a new file under `pipeline/steps`
- add one line in `main.py`
- add an entry to `pipeline/specs.json` to define:
  - the name of the step
  - the list of steps and parameters it depends on
  - the output file that it generates
  - the optional parameters and their default values
- render the output somehow in `next-app/components/Report`
- include it in the list of steps in `next-app/components/Appendix`

## Adding more data columns and UI features

To start supporting more columns in the csv, you'll need to:

- include them in the `aggregation` job to have the data available in the report and compute and statistics that may be relevant
- make changes to the UI to display the new data

For example, if your dataset include demographic information (e.g. age, gender, location) you may want to add a new section to the report to display the distribution of these variables. We'll be happy to start supporting a relatively large number of columns to capture and display as much information as possible in the reports, within reason.

## Supporting other LLMs (e.g. Claude or Llama2)

We're open to adding more options to the LLM jobs to facilitate the use of alternative LLMs. 
Since we're using LangChain, we'd recommend to use LangChain bridges for this.  

Using open-source LLMs such as Llama2 will typically require using smarter parsers to transform 
the outputs into the desired format or structure. To this effect, an additional option called "parser" 
could be added to all relevant LLM jobs of the pipeline. This could point to a appropriate python files 
(loaded dynamically) in a `pipeline/parsers` subfolder. We're also open to alternative suggestions. 

## What other features can I add?

If you are producing a TttC report for a project related to digital democracy
and if you feel that a specific feature is missing, there is a good chance that
other people will want the same feature.

For quick and simple features, we encourage you to submit a pull-request.
For anything substantial, please reach out to the AO Objective Institute to discuss your ideas.
