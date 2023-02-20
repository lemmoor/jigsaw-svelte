<script>
	import { bg_alpha } from './stores';

	let checked = $bg_alpha > 0;

	function toggleBackground() {
		if ($bg_alpha > 0) {
			$bg_alpha = 0.0;
		} else {
			$bg_alpha = 0.4;
		}
	}
</script>

<label for="switch" class="unstyled mt-4 flex cursor-pointer gap-2">
	<input on:click={toggleBackground} type="checkbox" bind:checked id="switch" class="checkbox" />
	<p>Background image</p>
</label>
