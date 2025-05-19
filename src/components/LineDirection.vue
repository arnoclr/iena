<script lang="ts" setup>
import type { Dayjs } from "dayjs";
import Time from "./Time.vue";

defineProps<{
  numberShapeSvg?: string;
  direction: string;
  journeyCode?: string;
  leavesAt?: Dayjs;
}>();
</script>

<template>
  <div class="lineDirectionRoot">
    <div class="shape" v-html="numberShapeSvg"></div>
    <div class="texts">
      <span class="journeyCode" v-if="journeyCode">{{ journeyCode }}</span>
      <span class="direction">{{ direction }}</span>
    </div>
    <span class="time">
      <Time :time="leavesAt"></Time>
    </span>
  </div>
</template>

<style scoped>
.lineDirectionRoot {
  width: 100%;
  display: grid;
  --lineDirectionWidth: min(10vh);
  grid-template-columns:
    var(--lineDirectionWidth) calc(100% - var(--lineDirectionWidth) * 4.5)
    calc(var(--lineDirectionWidth) * 3);
  gap: 2.72vh;
  align-items: center;
}

.texts {
  display: flex;
  align-items: baseline;
  gap: 1.36vh;
  width: 100%;
}

.direction {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  padding: 0.4vh;
  margin-left: auto;
}
</style>
