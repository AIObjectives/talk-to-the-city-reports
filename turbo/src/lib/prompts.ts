export const argument_extraction_system_prompt =
	'You are a professional research assistant. You have helped run many public consultations, surveys and citizen assemblies. You have good instincts when it comes to extracting interesting insights. You are familiar with public consultation tools like Pol.is and you understand the benefits for working with very clear, concise claims that other people would be able to vote on.';

export const argument_extraction_prompt_v0 = `
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

export const argument_extraction_prompt_v1 = `
I'm going to give you the transcript of a video interview and a list of topics and subtopics which have already been extracted.  

I want you to extract a list of concise claims that the interviewee may have made or supported if they had been asked the questions "what are the most important challenges faced by your community?". 

We are only interested in claims that can be mapped to one of the given topics and subtopics. The claim must be fairly general but not a platitude. It must be something that other people may potentially disagree with. Each claim must also be atomic. 

For each claim, please also provide a relevant quote from the transcript. The quote must be as concise as possible while still supporting the argument. The quote doesn't need to be a logical argument. It could also be a personal story or anecdote illustrating why the interviewee would make this claim.
`.trim();

export const argument_extraction_prompt_v1_suffix = `
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
`;

export const cluster_extraction_system_prompt =
	'You are a professional research assistant. You have helped run many public consultations, surveys and citizen assemblies.';

export const cluster_extraction_prompt_v0 = `
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

export const cluster_extraction_prompt_v1 = `
I will give you a long list of comments extracted from different video interviews on the topic of "which challenges are you and the community facing?".

I want you to propose a way to break down the information contained in these comments into topics and subtopics of interests. 

Keep the topic and subtopic names very concise and use the short description to explain what the topic is about.`.trim();

export const cluster_extraction_prompt_v1_suffix = `
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

Now here are the comment: "{comments}"`;

export const merge_extraction_prompt = `
Please merge the following clusters of topics and subtopics into one JSON document with the same format.

If the topics and subtopics are close enough to be merged, then merge them. If they are not then add them as separate topics and subtopics (perform the union of the sets).

Here are the clusters:

{clusters}

Output JSON only.
`;

export const score_claim_relevance_prompt = `
I am going to give you a claim in this format:

{
  "claim": string, // a claim
  "quote": string // the exact quote from which the claim was extracted,
  "topicName": string // the topic of the claim and quote
  "subtopicName": string // the subtopic of the claim and quote
}

Please return a score between 0 and 1 indicating how relevant this claim and quote are to the topic and subtopic. 0 means not relevant at all and 1 means very relevant.

Your response is in the form:

{
  "score": number
}

Here are the claims:

{claims}

`;

export const argument_extraction_llama_system_prompt = `\
Perform the instructions to the best of your ability.
`;

export const argument_extraction_llama_prompt = `\
### Instruction:

Extract the argument made as a list of bullet points.
Each bullet point should be a maximum of 10 words long.

• argument 1

• argument 2

• argument 3

• etc.

{comment}
`;
