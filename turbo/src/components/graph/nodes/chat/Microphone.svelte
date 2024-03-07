<script lang="ts">
  import IconButton from '@smui/icon-button';
  import MicrophoneIcon from '$lib/icons/Microphone.svelte';
  import StopCircleIcon from '$lib/icons/StopCircle.svelte';
  import { onMount } from 'svelte';

  let isRecording = false;
  let mediaRecorder: MediaRecorder;
  let audioChunks: Blob[] = [];

  export let key = '';
  export let messageInput = '';
  export let handleKeydown = () => {};

  async function toggleRecording() {
    if (isRecording) {
      mediaRecorder.stop();
      isRecording = false;
    } else {
      audioChunks = [];
      mediaRecorder.start();
      isRecording = true;
    }
  }

  onMount(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
      try {
        const formData = new FormData();
        formData.append('file', audioBlob, 'recording.mp3');
        formData.append('model', 'whisper-1');
        formData.append('response_format', 'text');

        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${key}`
          },
          body: formData
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.text();
        messageInput = result;
        handleKeydown({ key: 'Enter' });
        messageInput = '';
      } catch (error) {
        console.error('Error transcribing audio:', error);
      }
    };
  });
</script>

<IconButton class="material-icons" on:click={toggleRecording}>
  {#if isRecording}
    <StopCircleIcon color="#777" size="15px" />
  {:else}
    <MicrophoneIcon color="#777" size="15px" />
  {/if}
</IconButton>
