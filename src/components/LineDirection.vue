<script lang="ts" setup>
import { computed } from "vue";
import { Journey, Strings } from "../Helpers";
import type { SimpleDeparture, SimpleLine } from "../services/Wagon";
import Time from "./Time.vue";
import { localized } from "../language";

const props = defineProps<{
  line: SimpleLine;
  departure: SimpleDeparture;
  via?: string;
  direct?: boolean;
  subtitle?: string;
  trainLocation?: ReturnType<typeof Journey.trainLocation>;
}>();

const twoLines = computed(() => props.subtitle !== undefined);

const direction = computed(() => {
  return props.departure.destination.name;
});
</script>

<template>
  <div
    class="lineDirectionRoot"
    :class="{ twoLines, cancelled: departure.isCancelled }"
  >
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
        <span class="journeyCode" v-if="departure.journeyCode">
          {{ departure.journeyCode.slice(0, 4) ?? "" }}
        </span>
        <div
          v-if="trainLocation && !departure.isCancelled"
          class="trainLocation"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#1f1f1f"
          >
            <path
              d="M480-116q-13.5 0-26.6-4.75Q440.29-125.5 430-135q-52-47.5-99-99.25t-82.75-105q-35.75-53.25-57-106.75T170-550.5q0-145.88 93.75-232.44T480-869.5q122.5 0 216.25 86.56T790-550.5q0 51-21.25 104.5t-57 106.75Q676-286 629-234.25T530-135q-10.29 9.5-23.4 14.25Q493.5-116 480-116Zm.02-366.5q31.98 0 54.73-22.77 22.75-22.77 22.75-54.75t-22.77-54.73q-22.77-22.75-54.75-22.75t-54.73 22.77q-22.75 22.77-22.75 54.75t22.77 54.73q22.77 22.75 54.75 22.75Z"
            />
          </svg>
          <span v-if="trainLocation.at">
            <span
              >{{
                localized({
                  fr: "Se situe à",
                  en: "Located at",
                  es: "En la estación de",
                })
              }}
              {{ trainLocation.at?.name }}</span
            >
          </span>
          <span v-if="trainLocation.arrives && trainLocation.leaves">
            <span
              >{{
                localized({
                  fr: "Se situe entre",
                  en: "Located between",
                  es: "Se situa entre",
                })
              }}
              {{ Strings.abbreviate(trainLocation.leaves?.name) }}
              {{ localized({ fr: "et", en: "and", es: "y" }) }}
              {{ Strings.abbreviate(trainLocation.arrives?.name) }}</span
            >
          </span>
        </div>
        <span v-else>{{ subtitle }}</span>
      </span>
    </div>
    <div class="texts" v-else>
      <span class="journeyCode" v-if="departure.journeyCode">
        {{ departure.journeyCode.slice(0, 4) ?? "" }}
      </span>
      <span class="vehicleNumber" v-else-if="departure.vehicleNumber">
        n° {{ departure.vehicleNumber }}
      </span>
      <span class="direction">
        {{ direction.length > 20 ? Strings.abbreviate(direction) : direction }}
      </span>
      <span class="via" v-if="via">via {{ Strings.abbreviate(via) }}</span>
      <span class="direct" v-if="direct">&gt;&gt; Direct</span>
    </div>
    <span class="time">
      <span v-if="departure.isCancelled">{{
        localized({ fr: "supprimé", en: "cancelled", es: "suprimido" })
      }}</span>
      <Time v-else-if="departure.leavesAt" :time="departure.leavesAt"></Time>
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

.cancelled span.journeyCode,
.cancelled span.vehicleNumber,
.cancelled span.direction,
.cancelled:deep(svg) {
  opacity: 0.6;
}

span.vehicleNumber {
  font-size: 2vh;
  transform: translateY(-1.5vh);
}

span.via,
span.direct {
  white-space: nowrap;
  color: var(--text-light);
  font-size: 4.5vh;
}

span.direct {
  font-style: italic;
}

span.time {
  font-size: 5vh;
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

.trainLocation {
  width: 100%;
  position: relative;
  background-color: var(--highlight);
  border-radius: 1vh;
  padding: 0.5vh 0.8vh;
  overflow: hidden;
  white-space: nowrap;
  max-width: 77vh;
}

.trainLocation span {
  font-size: 3.2vh;
  color: var(--text-light);
}

.trainLocation span:first-child {
  margin-left: 5vh;
}

.trainLocation svg {
  position: absolute;
  fill: var(--text-light);
  height: 4vh;
  width: auto;
  transform: translateY(-13%) scaleX(0.9);
}
</style>
