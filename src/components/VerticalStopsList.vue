<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import type { SimpleStop } from "../services/Wagon";
import VerticalStop from "./VerticalStop.vue";
import WithFade from "./animations/WithFade.vue";

const props = defineProps<{
  stops: SimpleStop[];
  color: string;
  closedStops: Set<string>;
}>();

const ITEMS_PER_PAGE = 8;

const currentPageIndex = ref<number>(0);

const totalPages = computed(() => {
  const stopsCount = Math.max(0, props.stops.length - 1);
  return Math.ceil(stopsCount / ITEMS_PER_PAGE) || 1;
});

const currentPageStops = computed(() => {
  const allStops = props.stops.slice(1);
  const start = currentPageIndex.value * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;

  return allStops.slice(start, end);
});

const displayedCurrentPage = computed(() => currentPageIndex.value + 1);

function goToNextPage() {
  if (totalPages.value <= 1) return;
  currentPageIndex.value = (currentPageIndex.value + 1) % totalPages.value;
}

onMounted(() => {
  window.addEventListener("stopsListChange", goToNextPage);
});

onUnmounted(() => {
  window.removeEventListener("stopsListChange", goToNextPage);
});
</script>

<template>
  <div class="grid">
    <aside>
      <span>{{ localized({ fr: "Page", en: "Page", es: "Página" }) }}</span>
      <br />
      <span
        ><WithFade>
          <span :key="displayedCurrentPage">
            {{ displayedCurrentPage }}
          </span>
        </WithFade>
        / {{ totalPages }}</span
      >
    </aside>

    <main>
      <WithFade>
        <div class="page-container" :key="currentPageIndex">
          <VerticalStop
            v-for="stop in currentPageStops"
            :key="stop.id"
            class="stop"
            :stop="stop"
            :color="color"
            :tags="new Set(closedStops.has(stop.id) ? ['CLOSED'] : [])"
          />
        </div>
      </WithFade>
    </main>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: 10vh auto;
  gap: 2vh;
  height: 100%;
}

aside {
  padding-top: 1vh;
  font-size: 2.5vh;
  color: var(--text);
}

main {
  padding: 1vh;
  overflow: hidden;
  position: relative;
}

.page-container {
  height: 100%;
  column-count: 2;
  column-gap: 2vw;
  column-fill: auto;
}

.stop {
  break-inside: avoid;
  page-break-inside: avoid;
}
</style>
