<script lang="ts" setup>
import type { Dayjs } from "dayjs";
import Time from "./Time.vue";
import type { SimpleLine } from "../services/Wagon";
import { Strings } from "../Helpers";
import { computed } from "vue";

const props = defineProps<{
  line: SimpleLine;
  direction: string;
  journeyCode?: string;
  vehicleNumber?: string;
  leavesAt?: Dayjs;
  via?: string;
  direct?: boolean;
  subtitle?: string;
}>();

const twoLines = computed(() => props.subtitle !== undefined);
</script>

<template>
  <div class="lineDirectionRoot" :class="{ twoLines }">
    <div
      v-if="line.numberShapeSvg"
      class="shape"
      v-html="line.numberShapeSvg"
    ></div>
    <span v-else class="lineNumber">{{ line.number }}</span>
    <div class="texts2" v-if="twoLines">
      <span class="direction">
        {{ direction.length > 20 ? Strings.abbreviate(direction) : direction }}
      </span>
      <span class="subtitle">
        <span class="journeyCode" v-if="journeyCode">
          {{ journeyCode.slice(0, 4) ?? "" }}
        </span>
        <span>{{ subtitle }}</span>
      </span>
    </div>
    <div class="texts" v-else>
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

.lineDirectionRoot.twoLines {
  align-items: start;
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

.texts.twoLines {
  flex-direction: column;
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

.twoLines .shape:deep(svg) {
  height: 10vh;
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

.twoLines span.time {
  transform-origin: top right;
  transform: scale(0.8);
}

span.subtitle {
  display: flex;
  align-items: center;
  gap: 2vh;
  font-size: 3.5vh;
  color: var(--text-light);
}

.texts2 .direction {
  font-size: 5vh;
}
</style>
