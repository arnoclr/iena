<script lang="ts" setup>
import { localized } from "../language";
import type {
  SimpleDeparture,
  SimpleJourney,
  SimpleLine,
} from "../services/Wagon";
import LineDirection from "./LineDirection.vue";

defineProps<{
  departure: SimpleDeparture;
  line: SimpleLine;
  journey?: SimpleJourney;
}>();
</script>

<template>
  <article>
    <div class="labels">
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
    <div class="row">
      <div class="bloc">
        <LineDirection
          :number-shape-svg="line.numberShapeSvg"
          :direction="departure.destination.name"
          :journey-code="departure.journeyCode"
          :leaves-at="departure.leavesAt"
        ></LineDirection>
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
  margin-right: 8vh;
  padding: 1vh 2vh;
  font-size: 3vh;
}

.row {
  display: flex;
  align-items: start;
  width: 100%;
}

.bloc {
  background-color: #171a3c;
  border-radius: var(--border-radius);
  padding: 2vh;
  width: 100%;
}

.platform {
  display: grid;
  place-items: center;
  background-color: white;
  color: #171a3c;
  border: calc(var(--border-radius) / 2) solid #171a3c;
  height: 8vh;
  width: 8vh;
  font-weight: bold;
  font-size: 6vh;
  border-radius: 0 1vh 1vh 0;
  border-left: none;
  box-shadow: calc(-1 * var(--border-radius)) 0 0 0 #171a3c;
}
</style>
