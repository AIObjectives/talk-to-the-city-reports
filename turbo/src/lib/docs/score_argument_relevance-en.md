The score_argument_relevance node takes in `argument_extraction` data, and `open_ai_key`. It then prompts `gpt-4-1106-preview` to score the relevance of claims for their given topic and subtopic.

This is a quality assurance node. Since it exposes the JSON in the prompt, it is versatile enough to be used in a large number of claim quality assurance scenarios.
