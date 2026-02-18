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
  <TransitionGroup name="list" tag="ul">
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
  </TransitionGroup>
</template>

<style scoped>
ul {
  --gap: 1vh;
  padding: 0;
  margin: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--gap);
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

.list-move,
.list-leave-active,
.list-enter-active {
  transition: all 2s linear;
}

.list-leave-from,
.list-enter-to {
  transform: translateY(0);
  opacity: 1;
}

.list-leave-to {
  transform: translateY(calc(-100% - var(--gap)));
  opacity: 1;
}

.list-enter-from {
  transform: translateY(calc(100% + var(--gap)));
  opacity: 0;
}

.list-leave-active {
  position: absolute;
}
</style>
