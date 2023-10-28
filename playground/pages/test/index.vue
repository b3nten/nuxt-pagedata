<script setup lang="ts">
	import { usePageData } from "#imports"
	const { data } = await usePageData()
</script>

<template>
	<div>
		<h1>Test</h1>
		<pre>{{ JSON.stringify(data, null, 2) }}</pre>
	</div>
</template>