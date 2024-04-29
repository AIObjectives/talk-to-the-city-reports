<script lang="ts">
  import FormField from '@smui/form-field';
  import Switch from '@smui/switch';
  import Button from '@smui/button';
  import HelperText from '@smui/textfield/helper-text';
  import { type DocumentData } from 'firebase/firestore';
  import TextField from '@smui/textfield';
  import { auth } from '$lib/firebase';
  import { Dataset } from '$lib/dataset';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { loadTemplates } from '$lib/templates';
  import { _ as __ } from 'svelte-i18n';
  import _ from 'lodash';

  onMount(async () => {
    templates = await loadTemplates();
    templatesLoaded = true;
  });

  function getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  function generateReportName(): string {
    const adjectives = [
      'eager',
      'funny',
      'eccentric',
      'interesting',
      'innovative',
      'dynamic',
      'persistent',
      'intelligent',
      'curious',
      'creative',
      'ambitious',
      'bold',
      'charming',
      'dazzling',
      'enthusiastic',
      'fearless',
      'gentle',
      'honest',
      'inventive',
      'joyful',
      'kindhearted',
      'lively',
      'meticulous',
      'nimble',
      'optimistic',
      'passionate',
      'quick',
      'rational',
      'sensible',
      'thoughtful',
      'upbeat',
      'vibrant',
      'warm',
      'xenodochial',
      'youthful',
      'zealous',
      'able',
      'breezy',
      'brilliant',
      'keen',
      'devoted',
      'earnest',
      'fierce',
      'glowing',
      'harmonious',
      'idealistic',
      'jolly',
      'luxurious',
      'magnificent',
      'noble'
    ];

    const nouns = [
      'scientist',
      'scraper',
      'coder',
      'machine',
      'algorithm',
      'processor',
      'system',
      'engineer',
      'developer',
      'robot',
      'network',
      'interface',
      'database',
      'model',
      'designer',
      'administrator',
      'consultant',
      'analyst',
      'architect',
      'controller',
      'director',
      'educator',
      'facilitator',
      'guide',
      'helper',
      'innovator',
      'manager',
      'navigator',
      'observer',
      'planner',
      'researcher',
      'strategist',
      'teacher',
      'technician',
      'thinker',
      'utilizer',
      'validator',
      'visualizer',
      'writer',
      'explorer',
      'creator',
      'leader',
      'originator',
      'pioneer',
      'quizmaster',
      'reviewer',
      'specialist',
      'translator',
      'upholder',
      'virtuoso'
    ];

    const adjective = getRandomElement(adjectives);
    const noun = getRandomElement(nouns);

    return `${adjective}-${noun}`;
  }

  const rand = generateReportName();
  let projectTitle = rand;
  let projectSlug = rand;
  let projectDescription = rand;
  let projectTemplate = 'default';
  let templates: Record<string, DocumentData> = {};
  let templatesLoaded: boolean = false;
  let isPublic: boolean = true;

  function createProjectSlug(str: string): string {
    return str
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^0-9a-z\-]/g, '');
  }

  async function createNewProject(event: Event): Promise<void> {
    event.preventDefault();
    let graph = templates[projectTemplate];

    const newDataset = new Dataset(
      projectTitle,
      projectSlug,
      auth!.currentUser!.uid,
      projectTemplate,
      projectDescription,
      graph,
      '',
      '',
      true,
      !isPublic
    );

    const successFlag = await newDataset.addDatasetToFirebase();

    if (successFlag) {
      goto(`/report/${projectSlug}`);
    }
  }
</script>

<div class="flex flex-col items-center justify-center min-h-screen">
  <div class="w-full max-w-sm mt-5">
    <div class="flex flex-wrap -mx-3 mb-6">
      <h2 class="px-3 w-full text-center text-xl font-bold mb-6">
        {$__('create_a_new_report')}
      </h2>
      <div class="w-full px-3">
        <TextField
          style="width: 100%;"
          label={$__('report_name')}
          bind:value={projectTitle}
          on:input={() => {
            projectSlug = createProjectSlug(projectTitle);
          }}
        />
      </div>
      <div class="w-full px-3 py-5">
        <TextField style="width: 100%;" bind:value={projectSlug} label={$__('report_url_path')}>
          <HelperText persistent slot="helper"
            >https://talktothecity.org/report/{projectSlug}</HelperText
          >
        </TextField>
      </div>
      <div class="w-full px-3 py-5">
        <TextField style="width: 100%;" textarea bind:value={projectDescription}>
          <HelperText persistent slot="helper">{$__('report_description')}</HelperText>
        </TextField>
      </div>
      <div class="w-full px-3 py-5">
        <FormField>
          <Switch bind:checked={isPublic} />
          <span slot="label">{$__(isPublic ? 'public' : 'private')}</span>
        </FormField>
      </div>
    </div>
    {#if templatesLoaded}
      <button class="w-full px-3 pt-5" on:click={createNewProject}>
        <Button type="submit">{$__('create')}</Button>
      </button>
    {/if}
  </div>
</div>
