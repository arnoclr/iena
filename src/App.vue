<script setup lang="ts">
import { onMounted, ref } from "vue";
import DepartureBloc from "./components/DepartureBloc.vue";
import type { SimpleJourney } from "./services/Wagon";
import { getNextJourneys } from "./services/fetch";
import { useLangStore } from "./stores/lang";
import { getParamsFromUrl } from "./url";
import Clock from "./components/Clock.vue";
import NextTrainsWideList from "./screens/NextTrainsWideList.vue";
import NextTrain from "./screens/NextTrain.vue";
import { SIMPLE_JOURNEY } from "./mock";

const langStore = useLangStore();
const journeys = ref<SimpleJourney[]>([]);
const params = ref<ReturnType<typeof getParamsFromUrl>>();

async function updateJourneys() {
  const { lines, stop, platforms, coordinates, aimedDepartureCount } =
    params.value || {};

  if (!lines || !stop || !coordinates) {
    return;
  }

  journeys.value = await getNextJourneys(
    aimedDepartureCount || 1,
    coordinates,
    stop,
    lines,
    platforms
  );
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
  <NextTrain
    v-if="params?.aimedDepartureCount === 1"
    :journey="journeys.at(0) || SIMPLE_JOURNEY"
  ></NextTrain>
  <NextTrainsWideList v-else :journeys="journeys"></NextTrainsWideList>
</template>

<style scoped></style>
