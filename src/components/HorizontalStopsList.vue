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
  <!-- {{ currentPage }} / {{ stopsPagesCount }} -->
  <div class="journey">
    <span
      ref="stopsSpan"
      class="group"
      :class="{ transition: isTransitionEnabled }"
      :style="{
        transform: `translateY(-${currentPage * stopsPageHeight}px)`,
        lineHeight: `${LINE_HEIGHT_VH}vh`,
      }"
    >
      <template v-for="_ in 2">
        <span
          v-for="(stop, i) in stops"
          class="stop"
          :class="{ closed: closedStops.has(stop.id) }"
        >
          <span v-if="i !== 0" class="chevron">&nbsp;&gt;&nbsp;</span>
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
        <br />
      </template>
    </span>
  </div>
</template>

<style scoped>
.journey {
  display: block;
  color: var(--text-light);
  font-size: 6vh;
}

.journey {
  height: 6vh;
  overflow: hidden;
}

.journey .group {
  margin-top: -1.1vh;
  display: inline-block;
  height: 6.6vh;
}

.journey .group.transition {
  transition: transform 1s steps(9);
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
</style>
