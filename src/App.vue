<script setup lang="ts">
import { onMounted, ref } from "vue";
import BigDepartureBloc from "./components/BigDepartureBloc.vue";
import CongestionBloc from "./components/CongestionBloc.vue";
import { SIMPLE_JOURNEY } from "./mock";
import NextTrain from "./screens/NextTrain.vue";
import NextTrainsWideList from "./screens/NextTrainsWideList.vue";
import type { SimpleJourney } from "./services/Wagon";
import { getNextJourneys } from "./services/fetch";
import { useLangStore } from "./stores/lang";
import { getParamsFromUrl } from "./url";

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
    v-if="(params?.aimedDepartureCount || 1) <= 3"
    :journey="journeys.at(0) || SIMPLE_JOURNEY"
    :journeys-count="journeys.length"
  >
    <CongestionBloc
      v-if="params?.aimedDepartureCount === 1"
      :congestion="journeys.at(0)?.congestion || SIMPLE_JOURNEY.congestion"
    ></CongestionBloc>
    <div v-else v-for="(journey, i) in journeys.slice(1)" :key="journey.id">
      <BigDepartureBloc
        :show-labels="i === 0"
        :journey="journey"
      ></BigDepartureBloc>
    </div>
  </NextTrain>
  <NextTrainsWideList v-else :journeys="journeys"></NextTrainsWideList>
</template>

<style scoped></style>
