<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { localized } from "../language";
import type { SimpleJourney } from "../services/Wagon";
import { Journey } from "../Helpers";
import Label from "./Label.vue";
import MiniCongestion from "./MiniCongestion.vue";
import LineDirection from "./LineDirection.vue";
import VerticalStopsList from "./VerticalStopsList.vue";

const props = defineProps<{
  journey: SimpleJourney;
  stopsListHeight?: string;
  showLabels: boolean;
}>();

const trainPosition = ref<ReturnType<typeof Journey.trainLocation> | null>(
  null
);
let interval: ReturnType<typeof setInterval>;

onMounted(() => {
  interval = setInterval(() => {
    trainPosition.value = Journey.trainLocation(props.journey);
  }, 5_000);
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>

<template>
  <div class="main">
    <Label v-if="showLabels" severity="LOW" class="labels">
      <MiniCongestion
        v-if="journey.congestion"
        :congestion="journey.congestion?.average"
        style="height: 3vh; gap: 0.4vh"
      ></MiniCongestion>
      <span v-if="journey.userStopDeparture.vehicleLength === 'LONG'">{{
        localized({ fr: "Train Long", en: "Long Train", es: "Tren Largo" })
      }}</span>
      <span v-else-if="journey.userStopDeparture.vehicleLength === 'SHORT'">{{
        localized({ fr: "Train Court", en: "Short Train", es: "Tren Corto" })
      }}</span>
    </Label>
    <article>
      <LineDirection
        :line="journey.line"
        :departure="journey.userStopDeparture"
        :subtitle="
          localized({
            fr: 'Dessert',
            en: 'Stations',
            es: 'Estaciones',
          })
        "
        :train-location="trainPosition"
      ></LineDirection>
      <VerticalStopsList
        v-if="stopsListHeight"
        :style="{ height: stopsListHeight }"
        :stops="journey.nextStops || []"
        :closed-stops="journey.closedStops"
        :color="'#' + journey.line.backgroundColor"
      ></VerticalStopsList>
    </article>
  </div>
</template>

<style scoped>
.main {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.labels {
  transform: translateY(0.8vh);
}

article {
  box-sizing: border-box;
  width: 100%;
  padding: 2vh;
  border-radius: 0.8vh;
  background-color: var(--background);
  z-index: 2;
}
</style>
