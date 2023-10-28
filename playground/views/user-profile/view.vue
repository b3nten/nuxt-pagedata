<script setup lang="ts">
import useView from './$view';
const data = await useView();
</script>

<template>
	<div>
		{{ data }}
	</div>
</template>