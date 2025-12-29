<script lang="ts" setup>
import Clock from "../components/Clock.vue";
import DepartureBloc from "../components/DepartureBloc.vue";
import SideDisruptionPane from "../components/SideDisruptionPane.vue";
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
    <SideDisruptionPane
      class="pane"
      side="BOTTOM"
      :disruptions="[]"
    ></SideDisruptionPane>
    <Clock class="clock"></Clock>
  </ul>
</template>

<style scoped>
ul {
  padding: 0;
  margin: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1vh;
}

li {
  padding: 0 1.5vh;
}

li:first-child {
  margin-top: 1.5vh;
}

.clock {
  position: fixed;
  bottom: 1.5vh;
  right: 1.5vh;
}

.pane {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}
</style>
