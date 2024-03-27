const responses = {
  '17cde08334801e40a6110835ee62489c9e68365ef1fffc0d8c8bf020d3608b61': 'translated response',
  '0bb27701067939d4b9358f94bce6b77e0cf296e6db67c8cb1e93c88be3e9faf8':
    'Crowded streets, vibrant markets, high-rise apartments, diverse, rich culture.',
  '20f235466b65b040a2a0b11c6656ac1aaed2efe8eecfea59cb16d53322febe52':
    'Clean, efficient public transport, expensive rent, historic, culturally vibrant, safe.',
  '06643cabd565ebf8f435d16d0105b1b9bf246a2500f88829c8d1480c4f4d0f9c': {
    topics: [
      {
        topicName: 'Weather',
        subtopics: ['Current Conditions', 'Precipitation Duration']
      }
    ]
  },
  '72527412d60d3518133c47bf99bb066cb92cff7fa36fc9606ecad6cc22d3b971': {
    topics: [
      {
        topicName: 'Weather',
        subtopics: ['Current Conditions']
      }
    ]
  },
  '1cc0c4531e0cc91df9afafba55c658c8db62078e5eba14cac070a83a6f635e01': {
    topics: [
      {
        topicName: 'Weather',
        subtopics: ['Precipitation Duration']
      }
    ]
  },
  '087f95f192e154b9174207942af1822c5d43d8825550c183957b6083cca0e9d8': `{
  "response": "Taipei offers vibrant culture, convenience, but also dense living spaces."
}`,
  e362b7741e7ec13d29675b48143d37a3d4b5e455ccf714863c16737818e7e3db:
    'New York City: Bustling, crowded, diverse, expensive, vibrant, noisy, ever-changing.',
  '3c6d5b428018019749375e31356eadbbc0e1c6ea4a18fedf9156b627a1ab3970': `{
  "response": "New York: Bustling, crowded, diverse, expensive, vibrant, with limited space."
}`,
  '5c792b2ad1d597fe733d68b3139473e29ecc1485309191e1aa0763ad55849356':
    'Hello. What would you like to know about the markdown?',
  '411400533127094feb3ac35607c7e6fb647cf750fd2eb3bb0484696e165cabfb':
    'Hello. What would you like to know about the weather?',
  '809b22fd4e501625a223249f71bdc0d0fbf813b22fd86747a6f8f93f620878ec': {
    claims: [
      {
        claim: 'The rain in the city is persistent.',
        quote: 'When will the rain stop.',
        topicName: 'Weather Patterns',
        subtopicName: 'Rain Duration'
      }
    ]
  },
  cc793be2d5916623bc8af46165bc4fa9047c0e747d60dd5d53a8928f9fc4e116: {},
  '977c58066de14556ef281ccd17a1da1e34cbde1ef324ad83641ebc7312a40677': {
    claims: [
      {
        claim: 'The weather is currently pleasant in the city.',
        quote: 'The weather is indeed pleasant today',
        topicName: 'Current Conditions',
        subtopicName: 'Pleasant Weather'
      }
    ]
  },
  fe1f30e4f5c78ec13d3e562fee66a76ac5fc73abffe458ce633ac6748d5641ed: {
    topics: [
      {
        topicName: 'Current Conditions',
        topicShortDescription: 'Describes the present state of the weather.',
        subtopics: [
          {
            subtopicName: 'Pleasant Weather',
            subtopicShortDescription:
              'References to the weather being enjoyable or comfortable at the moment.'
          }
        ]
      },
      {
        topicName: 'Weather Patterns',
        topicShortDescription: 'Discusses the trends and changes in weather over time.',
        subtopics: [
          {
            subtopicName: 'Rain Duration',
            subtopicShortDescription:
              'Concerns about the length of time the rain is expected to last.'
          }
        ]
      }
    ]
  },
  ab2c974812cfbc6ffe18d755100b22f063794b5e4f41f2c4cfa27c075c5e6823: {
    topics: [
      {
        topicName: 'Current Conditions',
        topicShortDescription: 'Describes the present state of the weather.',
        subtopics: [
          {
            subtopicName: 'Pleasant Weather',
            subtopicShortDescription:
              'References to the weather being enjoyable or comfortable at the moment.'
          }
        ]
      },
      {
        topicName: 'Piano players',
        topicShortDescription: 'Discussion piano players.',
        subtopics: [
          {
            subtopicName: 'Classical Piano players',
            subtopicShortDescription:
              'Discusses classical piano players, and their role in the formation of modern music.'
          }
        ]
      },
      {
        topicName: 'Weather Patterns',
        topicShortDescription: 'Discusses the trends and changes in weather over time.',
        subtopics: [
          {
            subtopicName: 'Rain Duration',
            subtopicShortDescription:
              'Concerns about the length of time the rain is expected to last.'
          }
        ]
      }
    ]
  },
  '80e0e107ae12a48f2f643f6e9ea0bd78ca2afd6161d89f39043f80db3413d94d': {
    score: 0.5,
    explanation: 'This is a test explanation.'
  }
};

export default responses;
