<script setup>
const route = useRoute();
const copied = ref(false);

const isRoomPage = computed(() => route.path.startsWith("/rooms/"));

async function copyRoomLink() {
	await navigator.clipboard.writeText(window.location.href);
	copied.value = true;
	setTimeout(() => copied.value = false, 2000);
}

const areMapsHidden = ref(true);

function toggleMapsShowing() {
	areMapsHidden.value = !areMapsHidden.value;
}
</script>

<template>
	<header class="relative h-16 flex justify-between items-center border-b-2 border-b-gray-border bg-gray-dark text-gray-light px-4">
		<NuxtLink to="/">
			<h1 class="text-sm sm:text-lg md:text-xl font-bold text-primary uppercase">Tarkov Planner</h1>
			<p class="text-sm md:text-base">v0.1.0</p>
		</NuxtLink>

		<button v-if="isRoomPage" @click="toggleMapsShowing" class="mx-4 text-white bg-primary py-2 px-4 rounded cursor-pointer"><span class="hidden md:inline">Show maps</span> <i class="fa-solid fa-map-location-dot md:ml-1"></i></button>

		<nav v-if="isRoomPage">
			<NuxtLink @click.prevent="copyRoomLink" class="inline-block md:w-40 mx-2 md:mx-4 text-center text-white bg-primary p-2 rounded cursor-pointer"><i class="fa-solid fa-link md:mr-2"></i> <span class="hidden md:inline">{{ copied ? 'Copied !' : 'Copy room link' }}</span></NuxtLink>
			<NuxtLink to="/" class="inline-block text-gray-lighter border border-gray-medium p-2 rounded"><i class="fa-solid fa-home md:mr-1"></i> <span class="hidden md:inline">Home</span></NuxtLink>
		</nav>

		<div
			v-if="!areMapsHidden"
			class="absolute top-[calc(100%+2px)] left-0 w-full z-[100] bg-gray-dark border-b border-gray-border shadow-xl"
		>
			<MapsNav @close="toggleMapsShowing" />
		</div>
	</header>
</template>
