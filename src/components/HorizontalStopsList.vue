<script lang="ts" setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";

const props = defineProps<{
  stops: string[];
}>();

const stopsSpan = ref<HTMLSpanElement>();
const stopsCell = ref<HTMLDivElement>();
const stopsPagesCount = ref<number>();
const currentPage = ref<number>(0);
const stopsPageHeight = ref<number>(0);
const isTransitionEnabled = ref<boolean>(true);
let stopsInterval: number | null = null;

function updateJourneyStopsPagesCount() {
  if (!stopsSpan.value || !stopsCell.value) {
    return;
  }
  const cellHeight = stopsCell.value.clientHeight;
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
  <div ref="stopsCell" class="journey">
    <span
      ref="stopsSpan"
      :class="{ transition: isTransitionEnabled }"
      :style="{ transform: `translateY(-${currentPage * stopsPageHeight}px)` }"
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
  line-height: 6vh;
  display: inline-block;
  height: 7vh;
}

.journey span.transition {
  transition: transform 1s steps(9);
}
</style>
