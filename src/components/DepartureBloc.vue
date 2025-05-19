<script lang="ts" setup>
import { computed } from "vue";
import { localized } from "../language";
import type { SimpleJourney, SimpleLine } from "../services/Wagon";
import HorizontalStopsList from "./HorizontalStopsList.vue";
import LineDirection from "./LineDirection.vue";

const props = defineProps<{
  line: SimpleLine;
  journey: SimpleJourney;
  showLabels: boolean;
}>();

const rowClasses = computed(() => {
  return {
    "no-stops": props.journey.stops.length === 0,
  };
});

const departure = computed(() => props.journey?.userStopDeparture);
</script>

<template>
  <article>
    <div class="labels" v-if="showLabels">
      <span v-if="departure.vehicleLength === 'SHORT'">
        {{
          localized({
            fr: "Train court",
            en: "Short train",
            es: "Traino corto",
          })
        }}
      </span>
      <span v-if="departure.vehicleLength === 'LONG'">
        {{
          localized({
            fr: "Train long",
            en: "Long train",
            es: "Traino longo",
          })
        }}
      </span>
    </div>
    <div class="row" :class="rowClasses">
      <div class="bloc">
        <LineDirection
          :number-shape-svg="line.numberShapeSvg"
          :direction="departure.destination.name"
          :journey-code="departure.journeyCode"
          :leaves-at="departure.leavesAt"
        ></LineDirection>
        <HorizontalStopsList
          v-if="journey.stops.length > 0"
          :stops="journey.stops.map((x) => x.name)"
        ></HorizontalStopsList>
      </div>
      <div class="platform" v-if="departure.platform">
        <span>{{ departure.platform }}</span>
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
  background-color: #166d71;
  border-radius: var(--border-radius) var(--border-radius) 0 0;
  display: flex;
  color: white;
  width: fit-content;
  align-self: end;
  margin-right: var(--platform-width);
  padding: 1vh 2vh;
  font-size: 3vh;
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
