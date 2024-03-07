<script lang="ts">
  import Speaker from '$lib/icons/VolumeMedium.svelte';

  export let key: string = '';
  export let message: { role: string; content: string };
  export let color: string = '#777';

  const voices = {
    user: 'echo',
    assistant: 'fable'
  };

  async function playTextAsSpeech(text: string) {
    try {
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'tts-1',
          input: text,
          voice: voices[message.role]
        })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error('Error playing the text:', error);
    }
  }
</script>

<div class="speaker-button-container">
  <button class="speaker-button" on:click={() => playTextAsSpeech(message.content)}>
    <Speaker {color} />
  </button>
</div>

<style>
  .speaker-button-container {
    text-align: right;
    position: absolute;
    top: 0;
    right: 0;
    padding: 5px;
  }

  .speaker-button {
    background: none;
    border: none;
    cursor: pointer;
  }
</style>
