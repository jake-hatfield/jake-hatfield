<script lang="ts">
	// optional props
	export let height = 16;
	export let width = 16;
</script>

<svg
	{height}
	{width}
	class={$$props.class ? $$props.class : ''}
	fill="#fff"
	viewBox="0 0 24 24"
	xmlns="http://www.w3.org/2000/svg"><path d="M24 22.525H0l12-21.05 12 21.05z" /></svg
>
