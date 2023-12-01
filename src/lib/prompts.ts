export const extraction_prompt = `
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

export const summary_prompt = `
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

export const merge_extraction_prompt = `
Please merge the following clusters of topics and subtopics into one JSON document with the same format.

If the topics and subtopics are close enough to be merged, then merge them. If they are not then add them as separate topics and subtopics (perform the union of the sets).

Here are the clusters:

{clusters}

Output JSON only.
`;
