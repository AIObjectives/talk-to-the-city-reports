<script lang="ts">
  import { user } from '$lib/store';
  import Pipeline from '$components/Pipeline.svelte';
  import { marked } from 'marked';
  import { Dataset } from '$lib/dataset';
  import nodesRegister from '$lib/node_register';
  import githubIssues from './github_issues.py?raw';
</script>

<img
  alt="sleeping giant"
  src="https://talktothecity.s3.amazonaws.com/tttc-turbo/static/images/dp.jpeg"
  style="width: 100%; max-width: 800px; margin-left: auto; margin-right: auto; margin-top: 20px; margin-bottom: 20px;"
/>

<p class="docs marked mx-auto max-w-screen-md">
  {@html marked(`
# The unintended effects of graph-based ML applications

Talk to the City is first and foremost a public deliberations ingestion, analysis and publishing platform.

However in this writeup, we will visit some of the unintended side-effects of Talk to the City we discovered whilst trying out new connections for the sake of exploration. All the use cases you are about to see were never requested or explicitly built. Rather they are the result of connecting nodes together over the holidays, and seeing what happens.

Let's begin with a new node: \`webpage_v0\`. It takes in a URL, fetches the webpage, processes it using the [readability.js](https://github.com/mozilla/readability) library, and outputs the plain text.
`)}
</p>

{#if $user}
  <Pipeline
    dataset={new Dataset(
      'title',
      '/test',
      $user?.uid,
      'template',
      'description',
      {
        nodes: [
          (() => {
            const web = nodesRegister.init_new('webpage_v0');
            web.data.text = 'https://en.wikipedia.org/wiki/Metcalfe%27s_law';
            return web;
          })()
        ],
        edges: [{}]
      },
      'id'
    )}
    showNodesToolbar={false}
    height="50vh"
    width="50%"
    viewMode="standard"
    showSaveButton={false}
  />
{/if}

<p class="docs marked mx-auto max-w-screen-md">
  {@html marked(`
As we can see above, a node on its own isn't really useful. So let's add another node: the \`markdown_v0\` node. This node takes in a string, or a CSV, passes its contents through the [marked](https://marked.js.org/) library, and displays the result as sanitized, rendered HTML.
`)}
</p>
<br />

{#if $user}
  <Pipeline
    dataset={new Dataset(
      'title',
      '/test',
      $user?.uid,
      'template',
      'description',
      {
        nodes: [
          (() => {
            const web = nodesRegister.init_new('webpage_v0');
            web.data.text = "https://en.wikipedia.org/wiki/Metcalfe's_law";
            return web;
          })(),
          (() => {
            const node = nodesRegister.init_new('markdown_v0');
            return node;
          })()
        ],
        edges: [{ source: 'webpage', target: 'markdown' }]
      },
      'id'
    )}
    showNodesToolbar={false}
    height="50vh"
    width="50%"
    viewMode="standard"
    showSaveButton={false}
  />
{/if}

<p class="docs marked mx-auto max-w-screen-md">
  {@html marked(`
This is quite useful, as *display nodes* like \`markdown_v0\` serve as good sanity checks, to verify our data is indeed correct.

Let's try something a bit more useful this time, by connecting the webpage into a \`count_tokens_v0\` node.

`)}
</p>
<br />

{#if $user}
  <Pipeline
    dataset={new Dataset(
      'title',
      '/test',
      $user?.uid,
      'template',
      'description',
      {
        nodes: [
          nodesRegister.init_new('webpage_v0', {
            text: 'https://en.wikipedia.org/wiki/Metcalfe%27s_law'
          }),
          nodesRegister.init_new('count_tokens_v0', { show_in_ui: true })
        ],
        edges: [{ source: 'webpage', target: 'count_tokens' }]
      },
      'id'
    )}
    showNodesToolbar={false}
    height="50vh"
    width="50%"
    viewMode="standard"
  />
{/if}

<p class="docs marked mx-auto max-w-screen-md">
  {@html marked(`
We can now definitively know whether the page fits in a model's context.

At this point however, it is worth contemplating that being able to display the contents of a webpage, or count tokens for a webpage was never explicitely programmed into talk to the city. This may seem like a moot point we are making for the sake of narrative: but it isn't. Our only focus has been public deliberations, and the nodes you are seeing here (except for \`count_tokens_v0\` and \`markdown_v0\`) were only introduced on the same week as we are writing this article.

What's more, we could randomly select nodes, try connecting them to one another, and keep on writing these kinds of articles ad-infinitum. (Eventually, we are hoping to make these types of articles LLM-generated, with the interactive examples too.).

What other interesting side effects can we get from connecting nodes? Let's connect our \`webpage_v0\` node to a \`chat_v0\` node. I invite you to:

- paste your OpenAI key
- paste any website in the webpage node
- run the pipeline (robot icon)
- type the question "...........? Please answer in 200 words." and press enter


`)}
</p>
<br />

{#if $user}
  <Pipeline
    dataset={new Dataset(
      'webchat',
      '/test',
      $user?.uid,
      'template',
      'description',
      {
        nodes: [
          (() => {
            const web = nodesRegister.init_new('webpage_v0');
            web.data.text = 'https://en.wikipedia.org/wiki/Metcalfe%27s_law';
            return web;
          })(),
          (() => {
            const chat = nodesRegister.init_new('chat_v0');
            chat.data.input_ids = { open_ai_key: 'open_ai_key', data: 'webpage' };
            chat.position = { x: -120, y: 300 };
            return chat;
          })(),
          (() => {
            const key = nodesRegister.init_new('open_ai_key_v0');
            key.position = { x: -250, y: 0 };
            return key;
          })()
        ],
        edges: [
          { source: 'webpage', target: 'chat', id: 'webchat' },
          { source: 'open_ai_key', target: 'chat', id: 'keychat' }
        ]
      },
      'id'
    )}
    showNodesToolbar={false}
    height="50vh"
    width="50%"
    viewMode="standard"
    showSaveButton={false}
  />
{/if}

<p class="docs marked mx-auto max-w-screen-md">
  {@html marked(`
Here's a question we asked:

![tttc-metcalfes-law](https://talktothecity.s3.amazonaws.com/tttc-turbo/static/images/Monosnap-tttc-turbo-2024-01-04-04-31-45.jpeg)

This is in line with what we are experiencing at this very early stage in Talk to the City Turbo's lifecycle (2 months since inception): the introduction of certain nodes can lead to an explosion in functionality that is far greater than the functionality of that component alone.

(It is worth noting that functionality won't keep on growing exponentially forever, as practical constraints and diminishing returns may at some point start settling in.).

## Is Chatting with a Webpage useful?

One may ask whether chatting with a webpage is useful. Going by the number of plugins on the [openai plugins store](https://chat.openai.com/?model=gpt-4-plugins), it seems the answer is: "useful enough".

![openai plugins store 1](https://talktothecity.s3.amazonaws.com/tttc-turbo/static/images/Monosnap-ChatGPT-2024-01-04-00-19-41.jpeg)

What else can we chat with? We recently introduced the \`python_v0\` node which runs Python 3.7 on an AWS Lambda. So we wrote a small user script that fetches our open issues from Github. We plugged it into the chat node and were immediately able to chat with our Github issues.

In the chat node, i invite you to:

- Paste your OpenAI key
- Run the pipeline
- Write a question, e.g "What's the most important issue? Please tell me in 20 words, and provide a link.".
- Press enter.

`)}
</p>

{#if $user}
  <Pipeline
    dataset={new Dataset(
      'python chat',
      '/pychat',
      $user?.uid,
      'template',
      'description',
      {
        nodes: [
          (() => {
            const python = nodesRegister.init_new('python_v0');
            python.data.text = githubIssues;
            python.position = { x: 0, y: -1000 };
            return python;
          })(),
          (() => {
            const chat = nodesRegister.init_new('chat_v0');
            chat.data.input_ids = { open_ai_key: 'open_ai_key', data: 'python' };
            chat.position = { x: 0, y: 300 };
            return chat;
          })(),
          (() => {
            const key = nodesRegister.init_new('open_ai_key_v0');
            key.position = { x: -250, y: 0 };
            return key;
          })()
        ],
        edges: [
          { source: 'python', target: 'chat', id: 'pychat' },
          { source: 'open_ai_key', target: 'chat', id: 'keychat' }
        ]
      },
      'id'
    )}
    showNodesToolbar={false}
    height="70vh"
    width="50%"
    viewMode="standard"
    showSaveButton={false}
  />
{/if}

<p class="docs marked mx-auto max-w-screen-md">
  {@html marked(`

Here is what we got:

![github issues](https://talktothecity.s3.amazonaws.com/tttc-turbo/static/images/Monosnap-tttc-turbo-2024-01-04-01-24-53.jpeg)

Is the ability to chat with github useful? We certainly use a Slack bot just for this purpose. What if the LLM could open, edit, close tickets, or even better: 

- reason about our github issues?
- help us combat duplicate issues, or duplicated work?
- provide a sense of priority to our devs?
- etc.

We then asked ourselves: "what if the LLM could traverse and act on the graph?".

So to find out, we clumsily experimented with [function calling](https://blog.gopenai.com/function-calling-in-llm-44858b88386e). The prompt told the \`chat_v0\` node to believe it was a personal task manager. It had one function it could call which would simply update the markdown node.

<div class="video-container">
  <video controls width="100%">
    <source src="https://talktothecity.s3.us-west-1.amazonaws.com/static_builds/latest/videos/tttc-todo.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</div>

The result, as you can see above, was a rather entertaining chat-based todo manager. We once-again have to ask the question: is this useful?

![todo managers](https://talktothecity.s3.amazonaws.com/tttc-turbo/static/images/Monosnap-ChatGPT-2024-01-04-01-57-18.jpeg)

If the OpenAI plugins store is anything to go by as a metric for utility: the answer is potentially, once again, yes.

## Where to go from here?

Talk to the City is first and foremost a public deliberations platform. At AOI, we firmly believe that one of the most meaningful use cases for AI is sifting through public surveys on important public matters, organizing and publishing the voices of the people in an easy digest format.

Our first priority is the accuracy of the reports we produce, and their faithfulness to the voices they hope to represent. Having experimented with multi-agent platforms, e.g [autogpt](https://autogpt.net/) we are weary of full automation with extensive capabilities, and are more in favour of a slow and deliberate progression with a lot of testing (Talk to the City has - to date - 100 tests and counting)

However we will continue experimenting once in a while to see if our public deliberations platform has the potential to serve other use cases.

The pattern of having..

- data in a graph.
- capable utility nodes in a graph.
- Specialized LLM nodes in a graph.
- General LLM and chat nodes in a graph.

.. has so far enabled us to create sophisticated LLM pipelines that have served our purpose well.

It would seem the next step in terms of research on Talk to the City could be further exploration of:

- having all nodes advertise their capabilities in the form of function calling prompts.
- the ability for chat nodes or executive LLM nodes to:
	- amalgamate function calling abilities for other nodes in the graph.
	- traverse the graph.
	- acquire data from nodes in the graph.
	- call functions on nodes in the graph.
	- etc.

The ability to build these mini-apps by connecting a handful of nodes in the graph seems promising. Despite our focus remaining public deliberations, we will keep on exploring, in case we discover something useful.
`)}
</p>

<style>
  :global(.marked p) {
    @apply mx-auto max-w-screen-md py-2;
  }
  h1 {
    @apply mx-auto max-w-screen-md py-2;
  }
</style>
