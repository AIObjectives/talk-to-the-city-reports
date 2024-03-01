<script lang="ts">
  import Dialog, { Title, Content, Actions } from '@smui/dialog';
  import Select, { Option } from '@smui/select';
  import Button, { Label } from '@smui/button';
  import Checkbox from '@smui/checkbox';
  import FormField from '@smui/form-field';
  import Textfield from '@smui/textfield';
  import HelperText from '@smui/textfield/helper-text';
  import { success, error } from '$components/toast/theme';
  import { page } from '$app/stores';
  import { Dataset } from '$lib/dataset';
  import { get } from 'svelte/store';
  import nodes from '$lib/node_register';
  import { _ as __ } from 'svelte-i18n';
  import _ from 'lodash';

  export let dataset: Dataset;
  export let claims: any;
  export let open = false;

  let miscategorized = false;
  let inaccurate = false;
  let doesNotBelong = false;
  let topic: any = null;
  let subtopic: any = null;
  let otherTopic: any = null;
  let otherTopicName = '';
  let otherSubtopicName = '';

  let inaccurateText = '';

  $: {
    if (claims) {
      open = !!claims;
    }
  }

  $: feedbackNode = get(dataset.graph.nodes).find((n) => n.data?.compute_type === 'feedback_v0')!;

  $: mergeNode = get(dataset.graph.nodes).find((n) => n.data?.compute_type === 'merge_v0')!;
  $: topics = mergeNode?.data?.output?.topics;
  $: subtopics = topic?.subtopics || [];

  function close() {
    open = false;
    miscategorized = false;
    inaccurate = false;
    doesNotBelong = false;
    topic = null;
    subtopic = null;
    otherTopic = null;
    otherTopicName = '';
    otherSubtopicName = '';
  }

  function submit() {
    let OQ = nodes.init('feedback_v0', feedbackNode.data);
    OQ.addCommentToClaim(
      claims,
      $page.params.report,
      {
        miscategorized,
        topic: topic?.topicName || otherTopicName,
        subtopic: subtopic?.subtopicName || otherSubtopicName,
        inaccurate,
        inaccurateText,
        doesNotBelong
      },
      success,
      error
    );
    claims = undefined;
    close();
  }
</script>

<Dialog
  on:close={() => {
    open = false;
  }}
  bind:open
  aria-labelledby="simple-title"
  aria-describedby="simple-content"
  style="z-index: 1000000"
  class="z-2 feedback-dialog"
>
  <Title id="simple-title" class="mb-8">{$__('feedback')}</Title>

  <Content id="simple-content">
    <div>
      <FormField>
        <Checkbox bind:checked={miscategorized} disabled={doesNotBelong} />
        <span slot="label">{$__('i_think_the_claim_is_micategorized')}</span>
      </FormField>
      {#if miscategorized}
        <p>{$__('which_topic_does_the_claim_belong_to')}</p>
        {#if !otherTopic}
          <div>
            <Select label={$__('topic')}>
              {#each topics as t}
                <Option
                  value={t.topicName}
                  on:click={(x) => {
                    topic = t;
                  }}>{t.topicName}</Option
                >
              {/each}
              <Option
                value={'other'}
                on:click={(x) => {
                  setTimeout(() => {
                    otherTopic = true;
                  }, 100);
                }}>{$__('other')}</Option
              >
            </Select>
          </div>
          <div>
            <Select label={$__('subtopic')} disabled={!topic}>
              {#each subtopics as t}
                <Option
                  value={t.subtopicName}
                  on:click={(x) => {
                    subtopic = t;
                  }}>{t.subtopicName}</Option
                >
              {/each}
            </Select>
          </div>
        {:else}
          <Textfield
            style="width: 100%;"
            helperLine$style="width: 100% !important;"
            bind:value={otherTopicName}
          >
            <HelperText slot="helper">{$__('please_tell_us_a_subtopic_name')}</HelperText>
          </Textfield>
          <Textfield
            style="width: 100%;"
            helperLine$style="width: 100% !important;"
            bind:value={otherSubtopicName}
          >
            <HelperText slot="helper">{$__('please_tell_us_a_subtopic_name')}</HelperText>
          </Textfield>
        {/if}
      {/if}
    </div>
    <div>
      <FormField>
        <Checkbox bind:checked={inaccurate} disabled={doesNotBelong} />
        <span slot="label">{$__('i_think_the_claim_is_inaccurate')}</span>
      </FormField>
      {#if inaccurate}
        <br />
        <br />
        <Textfield
          style="width: 100%;"
          helperLine$style="width: 100% !important;"
          bind:value={inaccurateText}
        >
          <HelperText slot="helper">{$__('what_should_the_claim_be')}</HelperText>
        </Textfield>
      {/if}
    </div>
    <div>
      <FormField>
        <Checkbox bind:checked={doesNotBelong} disabled={inaccurate || miscategorized} />
        <span slot="label">{$__('i_think_the_claim_does_not_belong_to_the_dataset')}</span>
      </FormField>
    </div>
  </Content>
  <Actions>
    <Button
      on:click={() => {
        close();
      }}
    >
      <Label>{$__('cancel')}</Label>
    </Button>
    <Button on:click={submit}>
      <Label>{$__('submit')}</Label>
    </Button>
  </Actions>
</Dialog>

<style>
  .feedback-dialog {
    z-index: 1000000;
  }
</style>
