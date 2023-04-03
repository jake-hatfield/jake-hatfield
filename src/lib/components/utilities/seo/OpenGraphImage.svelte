<script lang="ts">
	// optional props
	export let title: string;
	export let description: string;
	// format of image
	export let format: 'square' | 'rect' | 'rectAlt';
</script>

<div
	style="display:flex;align-items:flex-start;justify-items:start;position:relative;flex-direction:column;height:100%;width:100%;padding:50px;background-color:#000;border-width:4px;border-color:#262626;color:#fff;font-family:'IBM Plex Mono',sans-serif;"
>
	{#if title}
		<div style={`display:flex;font-size:${format === 'rect' ? '80' : '50'}px;`}>
			<div>{title}</div>
		</div>
	{/if}
	{#if description && (format === 'rect' || format === 'rectAlt')}
		<p style="color:#A3A3A3;font-size:45px;line-height:60px">
			{description}
		</p>
	{/if}
	<div
		style="display:flex;align-items:center;justify-content:space-between;position:absolute;background-color:#6D28D9;left:0px;right:0px;bottom:0px;padding:25px 25px 25px 50px;border-top-width:4px;border-color:#4C1D95;"
	>
		<p style="color:#A3E635;font-size:36px;line-height:30px">jake-hatfield.com</p>
	</div>
</div>
