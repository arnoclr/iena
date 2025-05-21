<script setup lang="ts">
import { onMounted, ref } from "vue";
import DepartureBloc from "./components/DepartureBloc.vue";
import type { SimpleJourney } from "./services/Wagon";
import { getNextJourneys } from "./services/fetch";
import { useLangStore } from "./stores/lang";
import { getParamsFromUrl } from "./url";

const langStore = useLangStore();
const journeys = ref<SimpleJourney[]>([]);
const params = ref<ReturnType<typeof getParamsFromUrl>>();

async function updateJourneys() {
  const { lines, stop } = params.value || {};

  if (!lines || !stop) {
    return;
  }

  // ?stop=stop_area%3AIDFM%3A73163&lines=line%3AIDFM%3AC01742
  journeys.value = await getNextJourneys(stop, lines);
}

setInterval(() => {
  langStore.cycleLang();
}, 5000);

setInterval(updateJourneys, 60_100);

onMounted(() => {
  params.value = getParamsFromUrl(window.location.href);
  updateJourneys();
});
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
