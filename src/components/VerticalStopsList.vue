<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import type { SimpleStop } from "../services/Wagon";
import VerticalStop from "./VerticalStop.vue";

const props = defineProps<{
  stops: SimpleStop[];
  color: string;
  closedStops: Set<string>;
}>();

const stopsContainer = ref<HTMLElement>();
const stopsTranslateGroup = ref<HTMLElement>();
const stopsPagesCount = ref<number>();
const currentPage = ref<number>(0);
const isTransitionEnabled = ref<boolean>(true);
let stopsInterval: number | null = null;

const maxDisplayedPagesCount = computed(() => {
  return Math.max(1, Math.ceil((stopsPagesCount.value || 0) / 2));
});

const displayedCurrentPage = computed(() => {
  return currentPage.value >= maxDisplayedPagesCount.value
    ? 1
    : currentPage.value + 1;
});

function updateJourneyStopsPagesCount() {
  if (!stopsContainer.value || !stopsTranslateGroup.value) {
    return;
  }
  const containerWidth = stopsContainer.value.clientWidth;
  const translateGroupWidth = stopsTranslateGroup.value.scrollWidth;
  stopsPagesCount.value = Math.ceil(translateGroupWidth / containerWidth);
}

function goToNextPage() {
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

watch(() => props.stops.map((x) => x.id).join(), updateJourneyStopsPagesCount);

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
      <span>{{ displayedCurrentPage }} / {{ maxDisplayedPagesCount }}</span>
    </aside>
    <main ref="stopsContainer">
      <div
        class="group"
        ref="stopsTranslateGroup"
        :class="{ transition: isTransitionEnabled }"
        :style="{
          transform: `translateX(calc(-${currentPage * 100}% - ${
            currentPage || 0 / 2
          } * 1vw))`,
        }"
      >
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
  height: 100%;
  column-count: auto;
  column-gap: 1vw;
  column-width: calc(30vw - 10vh);
}

.group.transition {
  transition: transform 1s steps(16);
}

.columnBreak {
  break-inside: avoid;
  width: 1px;
  height: 100%;
}
</style>
