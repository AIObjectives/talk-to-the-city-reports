import PineconeNode from '$components/graph/nodes/PineconeNode.svelte';
import NumberInputNode from '$components/graph/nodes/NumberInputNode.svelte';
import TextInputNode from '$components/graph/nodes/TextInputNode.svelte';
import PromptNode from '$components/graph/nodes/PromptNode.svelte';
import AudioNode from '$components/graph/nodes/AudioNode.svelte';
import MultiAudioNode from '$components/graph/nodes/MultiAudioNode.svelte';
import CSVNode from '$components/graph/nodes/CSVNode.svelte';
import JSONNode from '$components/graph/nodes/JSONNode.svelte';
import TranslateNode from '$components/graph/nodes/TranslateNode.svelte';
import EditCSVNode from '$components/graph/nodes/EditCSVNode.svelte';
import GridNode from '$components/graph/nodes/GridNode.svelte';
import MarkdownNode from '$components/graph/nodes/MarkdownNode.svelte';
import DefaultNode from '$components/graph/nodes/DefaultNode.svelte';
import CodeMirrorNode from '$components/graph/nodes/CodeMirrorNode.svelte';
import ChatNode from '$components/graph/nodes/chat/ChatNode.svelte';
import WhisperNode from '$components/graph/nodes/WhisperNode.svelte';
import MultiWhisperNode from '$components/graph/nodes/MultiWhisperNode.svelte';
import FilterCSVNode from '$components/graph/nodes/FilterCSVNode.svelte';
import MergeClusterExtractionNode from '$components/graph/nodes/MergeClusterExtractionNode.svelte';
import DownloadNode from '$components/graph/nodes/DownloadNode.svelte';
import GPTNode from '$components/graph/nodes/GPTNode.svelte';
import MultiGPTNode from '$components/graph/nodes/MultiGPTNode.svelte';
import MultiClusterExtractionNode from '$components/graph/nodes/MultiClusterExtractionNode.svelte';
import TextToCSVNode from '$components/graph/nodes/TextToCSVNode.svelte';
import ArgumentExtractionNode from '$components/graph/nodes/ArgumentExtractionNode.svelte';

export const nodeTypes = {
  text_input_v0: TextInputNode,
  prompt_v0: PromptNode,
  csv_v0: CSVNode,
  json_v0: JSONNode,
  participant_filter_v0: TextInputNode,
  number_input_v0: NumberInputNode,
  translate_v0: TranslateNode,
  edit_csv_v0: EditCSVNode,
  jsonata_v0: CodeMirrorNode,
  jq_v0: CodeMirrorNode,
  jq_v1: CodeMirrorNode,
  grid_v0: GridNode,
  markdown_v0: MarkdownNode,
  default_v0: DefaultNode,
  default: DefaultNode,
  merge_v0: DefaultNode,
  stringify_v0: DefaultNode,
  feedback_v0: DefaultNode,
  gpt_v0: GPTNode,
  multi_gpt_v0: MultiGPTNode,
  python_v0: CodeMirrorNode,
  pyodide_v0: CodeMirrorNode,
  report_v0: DefaultNode,
  report_v1: DefaultNode,
  chat_v0: ChatNode,
  webpage_v0: TextInputNode,
  whisper_v0: WhisperNode,
  whisper_v1: WhisperNode,
  multi_whisper_v0: MultiWhisperNode,
  audio_v0: AudioNode,
  multi_audio_v0: MultiAudioNode,
  add_csv_v0: DefaultNode,
  filter_csv_v0: FilterCSVNode,
  unique_v0: TextInputNode,
  comment_expander_v0: TextInputNode,
  merge_cluster_extraction_v0: MergeClusterExtractionNode,
  merge_cluster_extraction_v1: GPTNode,
  download_v0: DownloadNode,
  text_to_csv_v0: TextToCSVNode,
  multi_cluster_extraction_v0: MultiClusterExtractionNode,
  argument_extraction_v1: ArgumentExtractionNode,
  summarize_v0: PromptNode,
  text_v0: TextInputNode,
  pinecone_v0: PineconeNode,
  gpt_embeddings_v0: DefaultNode
};
