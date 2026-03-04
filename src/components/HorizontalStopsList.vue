<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import type { SimpleStop } from "../services/Wagon";
import { Strings } from "../Helpers";

const props = defineProps<{
  stops: SimpleStop[];
  closedStops: Set<string>;
}>();

const LINE_HEIGHT_VH = 8;

const stopsSpan = ref<HTMLSpanElement>();
const stopsPagesCount = ref(0);
const currentPage = ref(0);
const stopsPageHeight = ref(0);
const isGoingBackToFirstLine = ref(false);

function getViewportHeightInPixels(vh: number): number {
  return (window.innerHeight * vh) / 100;
}

function calculatePaginationMetrics() {
  if (!stopsSpan.value) {
    return;
  }

  const cellHeight = getViewportHeightInPixels(LINE_HEIGHT_VH);
  const spanHeight = stopsSpan.value.scrollHeight;

  stopsPagesCount.value = Math.ceil(spanHeight / cellHeight);
  stopsPageHeight.value =
    stopsPagesCount.value > 0 ? spanHeight / stopsPagesCount.value : 0;
}

function resetPagination() {
  isGoingBackToFirstLine.value = true;

  setTimeout(() => {
    currentPage.value = 0;
    setTimeout(() => {
      isGoingBackToFirstLine.value = false;
    }, 50);
  }, 250);
}

function advanceToNextPage() {
  if (!stopsPagesCount.value || stopsPagesCount.value <= 1) {
    return;
  }

  if (currentPage.value >= stopsPagesCount.value - 1) {
    resetPagination();
    return;
  }

  currentPage.value++;
}

watch(() => props.stops, calculatePaginationMetrics, { immediate: true });

onMounted(() => {
  calculatePaginationMetrics();
  window.addEventListener("resize", calculatePaginationMetrics);
  window.addEventListener("stopsListChange", advanceToNextPage);
});

onUnmounted(() => {
  window.removeEventListener("resize", calculatePaginationMetrics);
  window.removeEventListener("stopsListChange", advanceToNextPage);
});
</script>

<template>
  <div class="journey">
    <span
      ref="stopsSpan"
      class="group"
      :style="{
        transform: `translateY(-${currentPage * stopsPageHeight}px)`,
        lineHeight: `${LINE_HEIGHT_VH}vh`,
      }"
      :class="{
        animationDisabled: isGoingBackToFirstLine,
      }"
    >
      <template v-for="stop in stops.slice(1)" :key="stop.id">
        <wbr />
        <span
          class="stop"
          :class="{ closed: closedStops.has(stop.id) }"
          :style="{ opacity: isGoingBackToFirstLine ? 0 : 1 }"
        >
          <span class="chevron">&nbsp;&gt;&nbsp;</span>
          <svg
            class="xmark"
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="currentColor"
          >
            <path
              d="M480-395 301.5-216.5q-18 18-42.5 17.75T216.5-217q-17.5-18-17.25-42.25T217-301l178-179-178-179q-17.5-17.5-17.5-41.75T217-743q17.5-18 42-18.25t42.5 17.75L480-565l178.5-178.5q18-18 42.5-17.75T743.5-743q17.5 18 17.25 42.25T743-659L565-480l178 179q17.5 17.5 17.5 41.75T743-217q-17.5 18-42 18.25t-42.5-17.75L480-395Z"
            />
          </svg>
          <span class="name">{{ Strings.abbreviate(stop.name) }}</span>
        </span>
      </template>
    </span>
  </div>
</template>

<style scoped>
.journey {
  display: block;
  color: var(--text-light);
  font-size: 6vh;
  height: 6vh;
  overflow: hidden;
}

.journey .group {
  margin-top: -1.1vh;
  display: inline-block;
}

.journey .group:not(.animationDisabled) {
  transition: all 0.5s ease-in-out;
}

.stop.closed .name {
  color: var(--high-congestion);
}

.chevron {
  display: inline-block;
  transform-origin: center;
  transform: scaleX(0.6);
}

.xmark {
  height: 6vh;
  width: auto;
  color: var(--high-congestion);
  vertical-align: text-bottom;
}

.stop:not(.closed) .xmark {
  display: none;
}

.stop {
  transition: opacity 0.2s ease-in-out;
  white-space: nowrap;
}
</style>
