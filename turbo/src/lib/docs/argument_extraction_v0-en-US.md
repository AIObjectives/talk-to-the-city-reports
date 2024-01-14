The argument_extraction node is used to extract arguments from a CSV file. It makes one call per comment to OpenAI's `gpt-4-1106-preview` with the topics and subtopics, in an attempt to extract claims that fit into those topics / subtopics.

The v0 node, which includes JSON formatting in the prompt, is being deprecated in favor of the v1 node.
