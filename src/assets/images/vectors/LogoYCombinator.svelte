<script lang="ts">
	// optional props
	export let height = 16;
	export let width = 16;
</script>

<svg
	{height}
	{width}
	class={$$props.class ? $$props.class : ''}
	fill="currentColor"
	role="img"
	viewBox="0 0 24 24"
	xmlns="http://www.w3.org/2000/svg"
	><path
		d="M0 24V0h24v24H0zM6.951 5.896l4.112 7.708v5.064h1.583v-4.972l4.148-7.799h-1.749l-2.457 4.875c-.372.745-.688 1.434-.688 1.434s-.297-.708-.651-1.434L8.831 5.896h-1.88z"
	/></svg
>
