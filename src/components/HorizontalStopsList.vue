<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch } from "vue";

const props = defineProps<{
  stops: string[];
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

function updateJourneyStopsPagesCount() {
  if (!stopsSpan.value) {
    return;
  }
  const cellHeight = vhToPx(LINE_HEIGHT_VH);
  const spanHeight = stopsSpan.value.scrollHeight;
  stopsPagesCount.value = Math.ceil(spanHeight / cellHeight);
  stopsPageHeight.value = spanHeight / stopsPagesCount.value;
}

function goToNextPage() {
  if (!stopsPagesCount.value) {
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
      :class="{ transition: isTransitionEnabled }"
      :style="{
        transform: `translateY(-${currentPage * stopsPageHeight}px)`,
        lineHeight: `${LINE_HEIGHT_VH}vh`,
      }"
    >
      {{ stops.join(" > ") }}
      <br />
      {{ stops.join(" > ") }}
    </span>
  </div>
</template>

<style scoped>
.journey {
  display: block;
  color: #ccc;
  font-size: 6vh;
}

.journey {
  height: 6vh;
  overflow: hidden;
}

.journey span {
  margin-top: -1.1vh;
  display: inline-block;
  height: 6.6vh;
}

.journey span.transition {
  transition: transform 1s steps(9);
}
</style>
