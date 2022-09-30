<script lang="ts">
	// svelte
	import { fade } from 'svelte/transition';

	// icons
	import { ErrorFilled, ViewFilled, ViewOffFilled } from 'carbon-icons-svelte';

	// types
	type HTMLInputTypes =
		| 'button'
		| 'color'
		| 'date'
		| 'datetime-local'
		| 'email'
		| 'file'
		| 'hidden'
		| 'image'
		| 'month'
		| 'number'
		| 'password'
		| 'range'
		| 'reset'
		| 'search'
		| 'submit'
		| 'tel'
		| 'text'
		| 'time'
		| 'url'
		| 'week';

	// * required props *
	export let id: string;
	export let type: HTMLInputTypes;
	export let placeholder: string;

	// optional props
	export let hasInlineButton = false;
	export let error = '';
	export let helperText = '';
	export let isLabelHidden = false;
	export let isPassword = false;
	export let isRequired = false;
	export let isReadOnly = false;
	export let showPasswordText = false;
	export let label = '';
	export let onInput = () => {};
	export let units = '';
	export let value = '';

	//   functions
	const handleInput = (e: any) => {
		let target = e.target as HTMLInputElement;
		value = target.value;
		onInput();
	};

	const toggleShowPasswordText = () => {
		showPasswordText = !showPasswordText;
		type = showPasswordText ? 'text' : 'password';
	};
</script>

<div class={`relative w-full ${$$props.class}`} data-testId="input-container">
	{#if label}
		<label
			for={id}
			class={`block font-medium text-zinc-100 ${isLabelHidden ? 'sr-only' : ''} ${
				isReadOnly ? 'text-zinc-600 cursor-not-allowed' : 'cursor-text'
			}`}>
			{label}
		</label>
	{/if}
	<div class={`${label ? 'mt-1.5' : ''} relative flex`}>
		{#if units}
			<span
				class="flex w-10 flex-none items-center justify-center bg-zinc-900 px-3 pt-[8px] pb-[7px]">
				{units}
			</span>
		{/if}
		<input
			aria-invalid="true"
			aria-describedby="email-error"
			autocomplete="off"
			class={`block w-full py-2 pl-3 pr-10 bg-black border-b-2 ${
				error
					? 'border-red-300 text-red-400 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
					: isReadOnly
					? 'border-transparent text-zinc-500 cursor-not-allowed'
					: 'border-violet-700 text-zinc-100 focus:ring-white focus:border-white cursor-text'
			} placeholder-zinc-500 focus:outline-none sm:text-sm mono`}
			disabled={isReadOnly}
			{id}
			on:input={handleInput}
			name={id}
			{placeholder}
			required={isRequired}
			{type}
			{value} />
		{#if error}
			<div
				class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-red-300">
				<ErrorFilled />
			</div>
		{/if}
		{#if isPassword && value}
			<button
				on:click|preventDefault={toggleShowPasswordText}
				transition:fade={{ duration: 150 }}
				class={`absolute inset-y-0 ${
					error ? 'right-10' : 'right-2.5'
				} text-zinc-300 transition duration-150 hover:text-zinc-300`}
				data-testId={showPasswordText ? 'hide-password-text' : 'show-password-text'}>
				{#if showPasswordText}
					<ViewOffFilled size={24} />
				{:else}
					<ViewFilled size={24} />
				{/if}
			</button>
		{/if}
		{#if hasInlineButton}
			<slot />
		{/if}
	</div>
	{#if error || isReadOnly || helperText}
		<div class="mt-1.5 text-left text-xs md:text-sm">
			{#if error}
				<p class="text-red-400" id={`${id}-error`}>
					{error}
				</p>
			{:else if isReadOnly}
				<p class="text-zinc-500" id={`${id}-read-only`}>This field is read-only</p>
			{:else if helperText}
				<p class="text-white" id={`${id}-helper-text`}>
					{helperText}
				</p>
			{/if}
		</div>
	{/if}
</div>
