<script setup>
import { useAsyncData } from 'nuxt/app';

	const d = await useAsyncData("nested", async () => {
		await new Promise((resolve) => setTimeout(resolve, 5000))
		return "nested"
	})
</script>

<template>
	<div>
		{{ d.data }}
	</div>
</template>