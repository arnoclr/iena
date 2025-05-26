<script lang="ts" setup>
import { computed } from "vue";
import { localized } from "../language";
import type { SimpleJourney, SimpleLine } from "../services/Wagon";
import HorizontalStopsList from "./HorizontalStopsList.vue";
import Label from "./Label.vue";
import LineDirection from "./LineDirection.vue";

const props = defineProps<{
  line: SimpleLine;
  journey: SimpleJourney;
  showStops: boolean;
  showShortTrain?: boolean;
}>();

const departure = computed(() => props.journey?.userStopDeparture);

const labelSeverity = computed(() => {
  switch (props.journey.metadata.flag) {
    case "OUTSIDE_PLATFORM":
    case "MODIFIED_JOURNEY":
      return "HIGH";
    case "REPLACEMENT_BUS":
      return "MEDIUM";
    default:
      return "LOW";
  }
});
</script>

<template>
  <article>
    <div class="labels" v-if="journey.metadata.flag || showShortTrain">
      <Label :severity="labelSeverity" v-if="journey.metadata.flag">
        <span v-if="journey.metadata.flag === 'REPLACEMENT_BUS'">
          {{
            // TODO: add translation
            localized({
              fr: "Prendre le bus de remplacement",
              en: "Take the replacement bus",
              es: "Prendre le bus de remplacement",
            })
          }}
        </span>
        <span v-if="journey.metadata.flag === 'OUTSIDE_PLATFORM'">
          {{
            // TODO: add translation
            localized({
              fr: "Voies Grandes Lignes",
              en: "Voies Grandes Lignes",
              es: "Voies Grandes Lignes",
            })
          }}
        </span>
        <span v-if="journey.metadata.flag === 'MODIFIED_JOURNEY'">
          {{
            // TODO: add translation
            localized({
              fr: "Desserte modifiée",
              en: "Attention, stops changed",
              es: "Desserte modifiée",
            })
          }}
        </span>
      </Label>
      <Label severity="LOW" v-if="departure.vehicleLength === 'SHORT'">
        {{
          localized({
            fr: "Train court",
            en: "Short train",
            es: "Tren corto",
          })
        }}
      </Label>
    </div>
    <div
      class="row"
      :class="{
        'no-stops': !showStops,
      }"
    >
      <div class="bloc">
        <div
          class="horizontalLine"
          v-if="journey.metadata.flag === 'REPLACEMENT_BUS'"
        ></div>
        <LineDirection
          :line="line"
          :departure="departure"
          :via="journey.metadata?.via"
          :direct="journey.metadata.direct"
        ></LineDirection>
        <HorizontalStopsList
          v-if="showStops && !journey.metadata.direct"
          :stops="departure.isCancelled ? [] : journey.nextStops"
          :closed-stops="journey.closedStops"
        ></HorizontalStopsList>
      </div>
      <div
        class="platform bus"
        v-if="journey.metadata.flag === 'REPLACEMENT_BUS'"
      >
        <svg
          width="215"
          height="212"
          viewBox="0 0 215 212"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M26 177H58V200C58 206.627 52.6274 212 46 212H38C31.3726 212 26 206.627 26 200V177Z"
            fill="white"
          />
          <path
            d="M158 177H190V200C190 206.627 184.627 212 178 212H170C163.373 212 158 206.627 158 200V177Z"
            fill="white"
          />
          <rect y="34" width="29" height="37" rx="9" fill="white" />
          <rect x="186" y="34" width="29" height="37" rx="9" fill="white" />
          <path
            d="M187.572 0C194.413 0 200.083 5.30102 200.543 12.126L204.745 74.5L205.839 163.841C205.928 171.082 200.082 177 192.84 177H22.1602C14.9182 177 9.0725 171.082 9.16115 163.841L10.2549 74.5L14.457 12.126C14.9169 5.30102 20.5873 0 27.4278 0H187.572ZM41.5 137C33.4919 137 27 143.492 27 151.5C27 159.508 33.4919 166 41.5 166C49.5081 166 56 159.508 56 151.5C56 143.492 49.5081 137 41.5 137ZM173.5 137C165.492 137 159 143.492 159 151.5C159 159.508 165.492 166 173.5 166C181.508 166 188 159.508 188 151.5C188 143.492 181.508 137 173.5 137ZM45.7793 34C39.0945 34 33.4989 39.0702 32.8418 45.7227L30 74.5L29.3291 101.679C29.1488 108.982 35.0199 115 42.3252 115H172.675C179.98 115 185.851 108.982 185.671 101.679L185 74.5L182.158 45.7227C181.501 39.0702 175.906 34 169.221 34H45.7793Z"
            fill="white"
          />
          <ellipse cx="149.5" cy="117" rx="26.5" ry="28" fill="white" />
          <ellipse cx="149.5" cy="81" rx="13.5" ry="14" fill="white" />
        </svg>
      </div>
      <div
        class="platform"
        v-else
        :style="{ opacity: departure.isCancelled ? 0 : 1 }"
      >
        <span>{{ departure.platform ?? "--" }}</span>
      </div>
    </div>
  </article>
</template>

<style scoped>
article {
  --border-radius: 1.36vh;
  --platform-width: 10vh;
  display: flex;
  flex-direction: column;
}

.labels {
  display: flex;
  align-self: end;
  margin-right: var(--platform-width);
}

.row {
  /* display: flex;
  align-items: start;
  width: 100%; */
  display: grid;
  grid-template-columns: calc(100% - var(--platform-width)) var(
      --platform-width
    );
}
.row.no-stops .bloc {
  padding-top: 0;
  padding-bottom: 0;
}
.row.no-stops .lineDirectionRoot {
  height: 100%;
}

.bloc {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 2vh;
  background-color: var(--background);
  border-radius: var(--border-radius);
  padding: 1vh 3vh;
}

.platform {
  display: grid;
  place-items: center;
  background-color: white;
  color: var(--background);
  border: calc(var(--border-radius) / 2) solid var(--background);
  height: var(--platform-width);
  width: var(--platform-width);
  font-weight: bold;
  font-size: 6vh;
  border-radius: 0 1vh 1vh 0;
  border-left: none;
  box-shadow: calc(-1 * var(--border-radius)) 0 0 0 var(--background);
  box-sizing: border-box;
}

.platform.bus {
  background-color: var(--worksite-background);
  border: none;
  display: grid;
  place-items: center;
}

.platform.bus svg {
  height: 6vh;
  width: auto;
}

.horizontalLine {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 1.8vh;
  background-color: var(--worksite-background);
}
</style>
