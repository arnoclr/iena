<script setup lang="ts">
import { onMounted, ref } from "vue";
import DepartureBloc from "./components/DepartureBloc.vue";
import type { SimpleJourney } from "./services/Wagon";
import { getNextJourneys } from "./services/fetch";
import { useLangStore } from "./stores/lang";

const langStore = useLangStore();
const journeys = ref<SimpleJourney[]>([]);

async function updateJourneys() {
  journeys.value = await getNextJourneys("stop_area:IDFM:72206", [
    "line:IDFM:C01728",
  ]);
}

setInterval(() => {
  langStore.cycleLang();
}, 5000);

setInterval(updateJourneys, 60_100);

onMounted(() => {
  updateJourneys();
});
</script>

<template>
  <ul>
    <li v-for="(journey, i) in journeys">
      <DepartureBloc
        :show-labels="i === 0"
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
