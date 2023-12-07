<script lang="ts">
	import Dialog, { Title, Content, Actions } from '@smui/dialog';
	import Button, { Label } from '@smui/button';
	import Textfield from '@smui/textfield';
	import { page } from '$app/stores';
	import { dataset } from '$lib/store';
	import { Dataset } from '$lib/dataset';

	let message = '';
	let focused = false;
	let value: string = '';
	let dirty = false;
	let invalid = false;
	export let modalShowing: boolean = false;
	export let showDropdown: boolean = false;
	$: disabled = focused || !value || !dirty || invalid;
	let reportPath: string;
	$: {
		reportPath = $page.route.id?.startsWith('/report/');
	}

	async function handleOk() {
		message = '';
		const exists = await Dataset.exists(value);
		if (exists) {
			message = 'A report with this name already exists.';
			invalid = true;
		} else {
			await $dataset!.fork(value);
			message = 'forking report';
			modalShowing = false;
			showDropdown = false;
		}
	}

	function handleCancel() {
		modalShowing = false;
		showDropdown = false;
	}
</script>

{#if reportPath}
	<Dialog open={modalShowing} aria-labelledby="simple-title" aria-describedby="simple-content">
		<Title id="simple-title">Fork Report</Title>
		<Content id="simple-content">
			<p>You are about to create a fork of this report. Please enter a name for the new report:</p>
			<br />
			<Textfield
				type="text"
				bind:dirty
				bind:invalid
				updateInvalid
				value={$page.params.report}
				on:change={(e) => (value = e.target.value)}
				label="Fork"
				style="min-width: 100%;"
				on:focus={() => (focused = true)}
				on:blur={() => (focused = false)}
				withTrailingIcon={!disabled}
			/>
			<br />
		</Content>
		<p class="ml-5 mb-2">{message}</p>
		<Button on:click={handleOk}>
			<Label>OK</Label>
		</Button>
		<Button on:click={handleCancel}>
			<Label>Cancel</Label>
		</Button>
	</Dialog>
{/if}
