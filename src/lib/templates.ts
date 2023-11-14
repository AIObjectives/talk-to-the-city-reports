const extraction_prompt = `
I'm going to give you the transcript of a video interview and a list of topics and subtopics which have already been extracted.  

I want you to extract a list of concise claims that the interviewee may have made or supported if they had been asked the questions "what are the most important challenges faced by returning citizens in Michigan?". 

We are only interested in claims that can be mapped to one of the given topic and subtopic. The claim must be fairly general but not a platitude. It must be something that other people may potentially disagree with. Each claim must also be atomic. 

For each claim, please also provide a relevant quote from the transcript. The quote must be as concise as possible while still supporting the argument. The quote doesn't need to be a logical argument. It could also be a personal story or anecdote illustrating why the interviewee would make this claim. You may use "[...]" in the quote to skip the less interesting bits of the quote. 

Return a JSON object of the form {
  "claims": [
    {
      "claim": string, // a very concise extracted claim
      "quote": string // the exact quote,
      "topicName": string // from the given list of topics
      "subtopicName": string // from the list of subtopics
    }, 
    // ... 
  ]
}

Now here is the list of topics and subtopics: {clusters}

Now here is the comment: "{comment}"

Remember to keep the claims very concise. 
`.trim();

const summary_prompt = `
I will give you a long list for comments extracted from different video interviews on the topic of "which challenges are you and the community facing?".

I want you to propose a way to break down the information contains in this comments into topics and subtopics of interests. 

Keep the topic and subtopic names very concise and use the short description to explain what the topic is about.

Return a JSON object of the form {
  "topics": [
    {
      "topicName:": string, 
      "topicShortDescription": string,
      "subtopics": [
        {
          "subtopicName": string,  
          "subtopicShortDescription": string, 
        },
        ...
      ]
    }, 
    ... 
  ]
}

Now here are the comment: "{comments}"`.trim();

export let templates = {
	heal_michigan: {
		nodes: [
			{
				id: 'open_ai_key',
				data: { label: 'OpenAI Key', text: 'sk-...', dirty: true },
				position: { x: -200, y: 50 },
				type: 'text-input'
			},
			{
				id: 'csv',
				data: { label: 'CSV', csv: '', filename: '', size_kb: 0, dirty: true },
				position: { x: 100, y: -50 },
				type: 'csv'
			},
			{
				id: 'cluster_extraction',
				data: {
					label: 'Cluster Extraction',
					output: {},
					text: '',
					system_prompt:
						'You are a professional research assistant. You have helped run may public consultations, surveys and citizen assemblies.',
					prompt: summary_prompt,
					dirty: true
				},
				position: { x: 100, y: 100 },
				type: 'prompt'
			},
			{
				id: 'argument_extraction',
				data: {
					label: 'Argument Extraction',
					output: {},
					text: '',
					system_prompt:
						'You are a professional research assistant. You have helped run may public consultations, surveys and citizen assemblies. You have good instincts when it comes to extracting interesting insights. You are familiar with public consultation tools like Pol.is and you understand the benefits for working with very clear, concise claims that other people would be able to vote on.',
					prompt: extraction_prompt,
					dirty: true
				},
				position: { x: 0, y: 350 },
				type: 'prompt'
			},
			{
				id: 'report',
				data: {
					label: 'Report',
					output: {},
					dirty: true
				},
				position: { x: 200, y: 600 }
			}
		],
		edges: [
			{
				id: 'open_ai_key-cluster_extraction',
				source: 'open_ai_key',
				target: 'cluster_extraction'
			},
			{
				id: 'open_ai_key-argument_extraction',
				source: 'open_ai_key',
				target: 'argument_extraction'
			},
			{
				id: 'csv-cluster_extraction',
				source: 'csv',
				target: 'cluster_extraction'
			},
			{
				id: 'cluster_extraction-argument_extraction',
				source: 'cluster_extraction',
				target: 'argument_extraction'
			},
			{
				id: 'csv-argument_extraction',
				source: 'csv',
				target: 'argument_extraction'
			},
			{
				id: 'argument_extraction-report',
				source: 'argument_extraction',
				target: 'report'
			},
			{
				id: 'cluster_extraction-report',
				source: 'cluster_extraction',
				target: 'report'
			}
		]
	}
};
