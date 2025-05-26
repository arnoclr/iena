<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import type { SimpleStop } from "../services/Wagon";
import VerticalStop from "./VerticalStop.vue";

const props = defineProps<{
  stops: SimpleStop[];
  color: string;
  closedStops: Set<string>;
}>();

const LINE_HEIGHT_VH = 8;

const stopsSpan = ref<HTMLSpanElement>();
const stopsPagesCount = ref<number>();
const currentPage = ref<number>(0);
const stopsPageHeight = ref<number>(0);
const isTransitionEnabled = ref<boolean>(true);
let stopsInterval: number | null = null;

function vhToPx(vh: number): number {
  return (window.innerHeight * vh) / 100;
}

function lowestEven(num: number): number {
  return num % 2 === 0 ? num : num - 1;
}

function updateJourneyStopsPagesCount() {
  if (!stopsSpan.value) {
    return;
  }
  const cellHeight = vhToPx(LINE_HEIGHT_VH);
  const spanHeight = stopsSpan.value.scrollHeight;
  stopsPagesCount.value = lowestEven(Math.ceil(spanHeight / cellHeight));
  stopsPageHeight.value = spanHeight / stopsPagesCount.value;
}

function goToNextPage() {
  return;
  if (!stopsPagesCount.value || stopsPagesCount.value <= 2) {
    return;
  }
  currentPage.value++;
  if (currentPage.value >= stopsPagesCount.value / 2 + 1) {
    isTransitionEnabled.value = false;
    currentPage.value = 0;
    setTimeout(() => {
      isTransitionEnabled.value = true;
      goToNextPage();
    }, 200);
  }
}

watch(() => props.stops, updateJourneyStopsPagesCount);

onMounted(() => {
  updateJourneyStopsPagesCount();
  window.addEventListener("resize", updateJourneyStopsPagesCount);
  stopsInterval = setInterval(goToNextPage, 5000);
});

onUnmounted(() => {
  if (stopsInterval) {
    clearInterval(stopsInterval);
  }
  window.removeEventListener("resize", updateJourneyStopsPagesCount);
});
</script>

<template>
  <div class="grid">
    <aside>
      <span>Page</span>
      <br />
      <span>{{ currentPage }} / {{ stopsPagesCount }}</span>
    </aside>
    <main>
      <div class="group">
        <template v-for="_ in 2">
          <VerticalStop
            v-for="stop in stops.slice(1)"
            class="stop"
            :stop="stop"
            :color="color"
            :tags="new Set(closedStops.has(stop.id) ? ['CLOSED'] : [])"
          ></VerticalStop>
          <div class="columnBreak"></div>
        </template>
      </div>
    </main>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: 10vh auto;
  gap: 2vh;
}

aside {
  font-size: 2.5vh;
  color: var(--text);
}

main {
  padding: 1vh;
  overflow: hidden;
}

.group {
  height: 40vh;
  column-count: auto;
  column-gap: 1vw;
  column-width: calc(30vw - 10vh);
}

.columnBreak {
  break-inside: avoid;
  width: 1px;
  height: 100%;
}
</style>
