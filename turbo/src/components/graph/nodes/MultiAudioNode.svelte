<script lang="ts">
  import {
    getStorage,
    ref as storageRef,
    uploadBytesResumable,
    getDownloadURL
  } from 'firebase/storage';
  import { getAuth } from 'firebase/auth';
  import Button from '@smui/button';
  import { type NodeProps } from '@xyflow/svelte';
  import { page } from '$app/stores';
  import DGNode from './DGNode.svelte';
  import _ from 'lodash';
  import { _ as __ } from 'svelte-i18n';
  import TrashCan from '$lib/icons/TrashCan.svelte';
  import Checkbox from '@smui/checkbox';
  import FormField from '@smui/form-field';

  type $$Props = NodeProps;

  function handleRemoveFile(fileToRemove) {
    // Update data.files by filtering out the removed file
    data.files = data.files.filter((file) => file !== fileToRemove);
    data.dirty = true;
  }

  export let data: $$Props['data'];
  export let id: $$Props['id'];
  export let fileType = 'Multi Audio';

  let fileInput;
  const storage = getStorage();
  const auth = getAuth();

  async function handleFilesChange(event) {
    const files = (event.target as HTMLInputElement).files;
    if (!files) return;
    data.dirty = true;

    const userId = auth.currentUser.uid;

    for (const file of files) {
      const filePath = `uploads/${userId}/${$page.params.report}/${id}_${file.name}`;
      const fileRef = storageRef(storage, filePath);

      const uploadedFile = file;
      if (uploadedFile.type.startsWith('audio/')) {
        const uploadTask = uploadBytesResumable(fileRef, uploadedFile);
        handleUpload(uploadTask, uploadedFile, filePath);
      } else {
        let reader = new FileReader();
        reader.onload = function () {
          const uploadTask = uploadBytesResumable(fileRef, uploadedFile);
          handleUpload(uploadTask, uploadedFile, filePath);
        };
        reader.readAsText(uploadedFile, 'UTF-8');
      }
    }
  }

  function handleUpload(uploadTask, uploadedFile, filePath) {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Handle progress...
      },
      (error) => {
        console.error('Upload failed', error);
      },
      async () => {
        await getDownloadURL(uploadTask.snapshot.ref);

        const fileInfo = {
          gcs_path: filePath,
          filename: uploadedFile.name,
          size_kb: uploadedFile.size / 1000
        };

        data.files = [...data.files, fileInfo];
      }
    );
  }
</script>

<DGNode {data} {id} {...$$restProps}>
  <div>
    <div>{$__(fileType)} {_.toLower($__('data'))}</div>
    {#if data.files && data.files.length}
      {#each data.files as file}
        <div class="filename-container">
          <span class="filename mr-1" style="width: 200px; min-width: 200px max-width: 200px;"
            >{file.filename}</span
          >
          <span class="file-size" style="width: 100px; min-width: 100px; max-width: 100px;"
            >{file.size_kb} KB</span
          >
          <small class="gcs-path" style="color: gray">{file.gcs_path}</small>
          <div class="trashcan-container">
            <button on:click={() => handleRemoveFile(file)}>
              <TrashCan color="#777" />
            </button>
          </div>
        </div>
        <hr style="width: 100%;" />
      {/each}
    {/if}
    <input
      class="nodrag"
      type="file"
      bind:this={fileInput}
      on:change={handleFilesChange}
      multiple
      style="display: none;"
    />
    <Button on:click={() => fileInput.click()}>{$__('upload')} {$__(fileType)}</Button>
  </div>
  <FormField>
    <Checkbox bind:checked={data.download} />
    <span slot="label">{$__('download')}</span>
  </FormField>
</DGNode>

<style>
  .filename-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .trashcan-container {
    flex: 1;
    display: flex;
    justify-content: flex-end;
  }
</style>
