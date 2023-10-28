<script setup>
import { useAsyncData } from 'nuxt/app';

const d = await useAsyncData("main", async () => {
	await new Promise((resolve) => setTimeout(resolve, 5000))
	return "main"
})
</script>

<template>
	<div>
		About
		<NuxtPage></NuxtPage>
	</div>
</template>