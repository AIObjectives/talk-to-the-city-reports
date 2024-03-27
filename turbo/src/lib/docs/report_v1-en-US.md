The report_v1 node simply makes the extraction data available to the rest of the user interface. Please note that the merged / translation data is cached to GCS, and this node is loaded first, to optimize loading speeds of the reports.

## Input attributes:

- csv

This input attribute takes the original CSV data used to generate the report.

- merge

The merged data, i.e containing the topics, subtopics and claims.

- translations

An object with locales as keys, and the translated merged data as values.

## Output attributes:

- csv

The original CSV data used to generate the report.

- merge

The merged data, i.e containing the topics, subtopics and claims.
