<script setup>
const route = useRoute();
const copied = ref(false);

const isRoomPage = computed(() => route.path.startsWith("/rooms/"));

async function copyRoomLink() {
	await navigator.clipboard.writeText(window.location.href);
	copied.value = true;
	setTimeout(() => copied.value = false, 2000);
}
</script>

<template>
	<header class="h-16 flex justify-between items-center border-b border-b-gray-border bg-gray-dark text-gray-light px-4">
		<NuxtLink to="/">
			<h1 class="text-xl font-bold text-primary uppercase">Tarkov Planner</h1>
			<p>v0.1.0</p>
		</NuxtLink>

		<nav v-if="isRoomPage">
			<NuxtLink @click.prevent="copyRoomLink" class="mx-4 text-white bg-primary p-2 rounded cursor-pointer"><i class="fa-regular fa-copy mr-2"></i>{{ copied ? 'Copied !' : 'Copy room link' }}</NuxtLink>
			<NuxtLink to="/" class="text-gray-lighter border border-gray-medium p-2 rounded">Back to home</NuxtLink>
		</nav>
	</header>
</template>
