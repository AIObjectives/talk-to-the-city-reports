# argument_extraction node documentation

The argument_extraction node is used to extract arguments from a CSV file. It makes one call per comment to OpenAI's `gpt-4-1106-preview` with the topics and subtopics, in an attempt to extract claims that fit into those topics / subtopics.
