<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch } from "vue";

const props = defineProps<{
  stops: string[];
}>();

const stopsSpan = ref<HTMLSpanElement>();
const stopsCell = ref<HTMLDivElement>();
const stopsPagesCount = ref<number>();
const currentPage = ref<number>(0);
let stopsInterval: number | null = null;

function updateJourneyStopsPagesCount() {
  if (stopsSpan.value && stopsCell.value) {
    const cellHeight = stopsCell.value.clientHeight;
    const spanHeight = stopsSpan.value.scrollHeight;
    stopsPagesCount.value = Math.ceil(spanHeight / cellHeight);
  }
}

function goToNextPage() {
  currentPage.value++;
  if (currentPage.value >= (stopsPagesCount.value ?? 0)) {
    currentPage.value = 0;
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
      :style="{ transform: `translateY(-${currentPage * 6}vh)` }"
    >
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
  height: 6vh;
  transition: transform 1s steps(9);
}
</style>
