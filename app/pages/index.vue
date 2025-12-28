<script setup>
import { useRoomStore } from "../../stores/useRoomStore.js";
import { navigateTo } from "nuxt/app";

const roomStore = useRoomStore();
async function createNewRoom() {
	const newRoom = await roomStore.createRoom();

	navigateTo(`/rooms/${newRoom.uuid}`);
}
</script>

<template>
	<div class="h-[calc(100vh-64px)] bg-gray-darker flex flex-col justify-start items-center">
		<p class="m-16 text-white text-xl">Welcome to Tarkov Planner, a collaborative tool aiming to help you organize your raids like never before.</p>

		<button @click="createNewRoom" class="bg-primary text-white py-4 px-6 rounded uppercase font-bold text-2xl">Create a new room</button>
	</div>
</template>
