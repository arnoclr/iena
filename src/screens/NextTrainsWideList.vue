<script lang="ts" setup>
import Clock from "../components/Clock.vue";
import DepartureBloc from "../components/DepartureBloc.vue";
import type { SimpleJourney } from "../services/Wagon";

defineProps<{
  journeys: SimpleJourney[];
}>();
</script>

<template>
  <ul>
    <li v-for="(journey, i) in journeys" :key="journey.id">
      <DepartureBloc
        :show-short-train="i === 0"
        :show-stops="i < 2"
        :line="journey.line"
        :journey="journey"
      ></DepartureBloc>
    </li>
    <Clock></Clock>
  </ul>
</template>

<style scoped>
ul {
  list-style: none;
  padding: 1.3vh;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1vh;
}
</style>
