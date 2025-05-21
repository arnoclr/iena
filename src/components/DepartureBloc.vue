<script lang="ts" setup>
import { computed } from "vue";
import { localized } from "../language";
import type { SimpleJourney, SimpleLine } from "../services/Wagon";
import HorizontalStopsList from "./HorizontalStopsList.vue";
import LineDirection from "./LineDirection.vue";
import Label from "./Label.vue";

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
            es: "Traino corto",
          })
        }}
      </Label>
    </div>
    <div class="row" :class="{ 'no-stops': !showStops }">
      <div class="bloc">
        <LineDirection
          :number-shape-svg="line.numberShapeSvg"
          :direction="departure.destination.name"
          :journey-code="departure.journeyCode"
          :leaves-at="departure.leavesAt"
          :via="journey.metadata?.via"
        ></LineDirection>
        <HorizontalStopsList
          v-if="showStops"
          :stops="journey.nextStops"
          :closed-stops="journey.closedStops"
        ></HorizontalStopsList>
      </div>
      <div class="platform">
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
  display: flex;
  flex-direction: column;
  gap: 2vh;
  background-color: #171a3c;
  border-radius: var(--border-radius);
  padding: 2vh;
}

.platform {
  display: grid;
  place-items: center;
  background-color: white;
  color: #171a3c;
  border: calc(var(--border-radius) / 2) solid #171a3c;
  height: var(--platform-width);
  width: var(--platform-width);
  font-weight: bold;
  font-size: 6vh;
  border-radius: 0 1vh 1vh 0;
  border-left: none;
  box-shadow: calc(-1 * var(--border-radius)) 0 0 0 #171a3c;
  box-sizing: border-box;
}
</style>
