<script lang="ts">
    import { _ as __ } from 'svelte-i18n';
    import _ from 'lodash'
    export let dataset;
</script>

<div class="flex flex-col px-2 my-4 max-w-full lg:max-w-[800px] mx-auto">
    <h1 class="text-left text-3xl uppercase my-8 text-gray-800">{dataset.title}</h1>
    <p class="text-gray-700">{$__('description')}: {dataset.description}</p>
    <p class="text-gray-700">{_.capitalize($__('template'))}: {dataset.template}</p>
    {#if dataset.projectParent}
        <p class="text-gray-500">Forked from:
            <a href="/report/{dataset.projectParent}" class="text-gray-500 hover:text-gray-700">
                {dataset.projectParent}
            </a>
        </p>
    {/if}
</div>
