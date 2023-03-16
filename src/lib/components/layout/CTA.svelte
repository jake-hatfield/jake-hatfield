<script lang="ts">
	// components
	import Button from '$components/utilities/Button.svelte';
	import Input from '$components/utilities/Input.svelte';

	// lib
	import placeholders from '$lib/metadata/placeholders';

	// icons
	import { ArrowRight } from 'carbon-icons-svelte';
</script>

<form class={`flex items-center w-full max-w-md ${$$props.class}`}>
	<Input
		hasInlineButton
		helperText={`get an email when I publish new content. no spam, unsubscribe whenever.`}
		id="cta-email"
		isLabelHidden
		placeholder={placeholders.email}
		type="email"
	>
		<Button
			class="ml-px flex-none"
			icon={ArrowRight}
			kind="secondary"
			loading={false}
			onClick={() => alert('hello')}
			size="field"
			title="sign up"
		/>
	</Input>
</form>
