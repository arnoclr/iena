<script lang="ts" setup>
import { localized } from "../language";
import type { SimpleJourney } from "../services/Wagon";
import Congestion from "./Congestion.vue";

const props = defineProps<{
  congestion: SimpleJourney["congestion"];
}>();
</script>

<template>
  <article v-if="congestion?.wagons?.length || 0 > 0">
    <h2>
      {{ localized({ fr: "Affluence", en: "Crowding", es: "Crowding" }) }}
    </h2>
    <div class="centered">
      <Congestion
        style="height: 8.8vh"
        :wagons="congestion?.wagons || []"
      ></Congestion>
    </div>
    <span class="labels">
      <span>{{ localized({ fr: "Arrière", en: "Rear", es: "Atrás" }) }} </span>
      <span>{{ localized({ fr: "Avant", en: "Front", es: "Delante" }) }}</span>
    </span>
  </article>
</template>

<style scoped>
article {
  box-sizing: border-box;
  width: 100%;
  padding: 2vh;
  border-radius: 0.8vh;
  background-color: var(--background);
}

h2 {
  color: var(--text);
  margin: 0;
  padding-bottom: 1vh;
  font-size: 4vh;
}

.centered {
  display: flex;
  justify-content: center;
  align-items: center;
}

.labels {
  display: flex;
  justify-content: space-between;
  color: var(--text);
  font-size: 3vh;
  padding: 2vh 4vh;
  padding-bottom: 0;
}
</style>
