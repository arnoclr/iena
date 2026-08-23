<script setup lang="ts">
import { onMounted, ref } from "vue";
import BigDepartureBloc from "./components/BigDepartureBloc.vue";
import CongestionBloc from "./components/CongestionBloc.vue";
import { SIMPLE_JOURNEY } from "./mock";
import NextTrain from "./screens/NextTrain.vue";
import NextTrainsWideList from "./screens/NextTrainsWideList.vue";
import type { SimpleJourney, SimpleNotification } from "./services/Wagon";
import { getNextJourneys } from "./services/fetch";
import { useLangStore } from "./stores/lang";
import { getParamsFromUrl } from "./url";

const langStore = useLangStore();
const journeys = ref<SimpleJourney[]>([]);
const notifications = ref<SimpleNotification[]>([]);
const params = ref<ReturnType<typeof getParamsFromUrl>>();
const stopsListChangeEvent = new Event("stopsListChange");

async function updateJourneys() {
  const { lines, stop, platforms, coordinates, aimedDepartureCount, direction } =
    params.value || {};

  if (!lines || !stop || !coordinates) {
    return;
  }

  const result = await getNextJourneys(
    aimedDepartureCount || 1,
    coordinates,
    stop,
    lines,
    platforms,
    direction,
  );
  journeys.value = result.journeys;
  notifications.value = result.notifications;
}

setInterval(() => {
  langStore.cycleLang();
}, 8000);

setInterval(() => {
  window.dispatchEvent(stopsListChangeEvent);
}, 7000);

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
    :notifications="notifications"
  >
    <CongestionBloc
      v-if="params?.aimedDepartureCount === 1 && journeys.at(0)?.congestion"
      :congestion="journeys.at(0)?.congestion"
    ></CongestionBloc>
    <div v-else v-for="journey in journeys.slice(1)" :key="journey.id">
      <BigDepartureBloc
        :show-labels="true"
        :journey="journey"
      ></BigDepartureBloc>
    </div>
  </NextTrain>
  <NextTrainsWideList
    v-else
    :journeys="journeys"
    :notifications="notifications"
  ></NextTrainsWideList>
</template>

<style scoped></style>
