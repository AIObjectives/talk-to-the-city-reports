The cluster_extraction node is used to extract clusters from a CSV file. It makes one call to OpenAI's `gpt-4-1106-preview` model with all the comments in the CSV file.

The v1 node hides the JSON part of the prompt, making it simpler to use for non-technical end users.
