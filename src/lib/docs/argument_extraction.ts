let argument_extraction = `
# argument_extraction_v0 node documentation

The argument_extraction_v0 node is used to extract arguments from a CSV file. It makes one call per comment to OpenAI's @@gpt-4-1106-preview@@ with the topics and subtopics, in an attempt to extract claims that fit into those topics / subtopics.

`;

argument_extraction = argument_extraction.replace(/@@(.*?)@@/g, '`$1`');
argument_extraction = argument_extraction.replace(/(.+)(\n|$)/g, '$1<br>\n');

export default argument_extraction;
