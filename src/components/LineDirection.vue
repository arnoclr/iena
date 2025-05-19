<script lang="ts" setup>
import type { Dayjs } from "dayjs";

defineProps<{
  numberShapeSvg?: string;
  direction: string;
  journeyCode?: string;
  leavesAt?: Dayjs;
}>();
</script>

<template>
  <div class="root">
    <div class="shape" v-html="numberShapeSvg"></div>
    <div class="texts">
      <span class="journeyCode" v-if="journeyCode">{{ journeyCode }}</span>
      <span class="direction">{{ direction }}</span>
    </div>
    <span class="time">{{ leavesAt?.format("HH:mm") }}</span>
  </div>
</template>

<style scoped>
.root {
  display: flex;
  gap: 2.72vh;
}

.texts {
  display: flex;
  align-items: baseline;
  gap: 1.36vh;
  /* flex-direction: column; */
}

.shape:deep(svg) {
  height: 8.1vh;
  width: auto;
}

span {
  color: white;
  margin: 0;
  display: block;
}

span.direction {
  font-weight: bold;
  font-size: 7.2vh;
}

span.journeyCode {
  font-size: 4.7vh;
}

span.time {
  margin-left: auto;
  font-size: 5vh;
  padding: 0.4vh;
}
</style>
