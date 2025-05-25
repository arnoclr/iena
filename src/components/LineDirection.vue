<script lang="ts" setup>
import type { Dayjs } from "dayjs";
import Time from "./Time.vue";
import type { SimpleLine } from "../services/Wagon";
import { Strings } from "../Helpers";

defineProps<{
  line: SimpleLine;
  direction: string;
  journeyCode?: string;
  vehicleNumber?: string;
  leavesAt?: Dayjs;
  via?: string;
  direct?: boolean;
}>();
</script>

<template>
  <div class="lineDirectionRoot">
    <div
      v-if="line.numberShapeSvg"
      class="shape"
      v-html="line.numberShapeSvg"
    ></div>
    <span v-else class="lineNumber">{{ line.number }}</span>
    <div class="texts">
      <span class="journeyCode" v-if="journeyCode">
        {{ journeyCode.slice(0, 4) ?? "" }}
      </span>
      <span class="vehicleNumber" v-else-if="vehicleNumber">
        n° {{ vehicleNumber }}
      </span>
      <span class="direction">
        {{ direction.length > 20 ? Strings.abbreviate(direction) : direction }}
      </span>
      <span class="via" v-if="via">via {{ Strings.abbreviate(via) }}</span>
      <span class="direct" v-if="direct">&gt;&gt; Direct</span>
    </div>
    <span class="time">
      <Time v-if="leavesAt" :time="leavesAt"></Time>
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

.lineNumber {
  white-space: nowrap;
  font-size: 5vh;
  font-weight: bold;
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
  color: var(--text);
  margin: 0;
  display: block;
}

span.direction {
  font-weight: bold;
  font-size: 7.2vh;
}

span.journeyCode,
span.vehicleNumber {
  min-width: 11vh;
}

span.journeyCode {
  font-size: 4.7vh;
  font-family: monospace;
}

span.vehicleNumber {
  font-size: 2vh;
  transform: translateY(-1.5vh);
}

span.via,
span.direct {
  color: var(--text-light);
  font-size: 4.5vh;
}

span.direct {
  font-style: italic;
}

span.time {
  padding: 0.4vh;
  margin-left: auto;
}
</style>
